"use client";
import React, { useState, useEffect } from "react";
import { useAuth, usePermissions } from "@/hooks/useAuth";

interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password?: string;
  rol: 'administrador' | 'editor' | 'lector';
  created_at?: string;
  updated_at?: string;
}

export function UsuariosCMS() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { user } = useAuth();
  const { canManageUsers } = usePermissions();

  const loadUsuarios = async () => {
    try {
      setIsLoading(true);
      
      // Obtener token del localStorage usando la misma clave que authService
      const token = localStorage.getItem('authToken');
      console.log('Loading users with token:', token ? 'EXISTS' : 'MISSING');
      console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'NULL');
      
      const response = await fetch('/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const result = await response.json();
      console.log('API Response:', result);
      console.log('Data type:', typeof result.data);
      console.log('Data content:', result.data);

      if (response.ok && result.success) {
        // El backend devuelve: { data: { data: [...], pagination: {...} } }
        // Necesitamos acceder a result.data.data para obtener el array de usuarios
        let usuariosData = [];
        
        if (result.data && Array.isArray(result.data.data)) {
          usuariosData = result.data.data;
        } else if (Array.isArray(result.data)) {
          usuariosData = result.data;
        } else {
          console.log('Estructura de datos inesperada:', result.data);
          usuariosData = [];
        }
        
        console.log('Usuarios data final:', usuariosData);
        setUsuarios(usuariosData);
        setError("");
      } else {
        const errorMessage = result.message || result.error || `Error ${response.status}: ${response.statusText}`;
        console.error('API Error:', errorMessage);
        setError(errorMessage);
        setUsuarios([]); // Resetear a array vacío en caso de error
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError('Error de conexión al cargar usuarios');
      setUsuarios([]); // Resetear a array vacío en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  // Verificar permisos de administrador
  if (!canManageUsers) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Acceso Denegado</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Solo los administradores pueden acceder a la gestión de usuarios.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateUsuario = async (formData: FormData) => {
    try {
      setIsLoading(true);
      
      // Convertir FormData a objeto JSON
      const userData = {
        nombre: formData.get('nombre') as string,
        correo: formData.get('correo') as string,
        password: formData.get('password') as string,
        rol: formData.get('rol') as string
      };

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (result.success) {
        setShowForm(false);
        await loadUsuarios();
        setError("");
      } else {
        setError(result.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
      setError('Error de conexión al crear usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUsuario = async (formData: FormData) => {
    if (!editingUsuario?.id) return;

    try {
      setIsLoading(true);
      
      // Convertir FormData a objeto JSON
      const userData: Partial<Usuario> = {
        nombre: formData.get('nombre') as string,
        correo: formData.get('correo') as string,
        rol: formData.get('rol') as 'administrador' | 'editor' | 'lector'
      };

      // Solo incluir password si se proporcionó
      const password = formData.get('password') as string;
      if (password && password.trim()) {
        userData.password = password;
      }

      const response = await fetch(`/api/usuarios/${editingUsuario.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (result.success) {
        setEditingUsuario(null);
        setShowForm(false);
        await loadUsuarios();
        setError("");
      } else {
        setError(result.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setError('Error de conexión al actualizar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUsuario = async (usuario: Usuario) => {
    if (!usuario.id) return;

    // Prevenir que un admin se elimine a sí mismo
    if (usuario.id === user?.id) {
      alert("No puedes eliminar tu propia cuenta de administrador.");
      return;
    }

    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${usuario.nombre}"?`)) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/usuarios/${usuario.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (result.success) {
          await loadUsuarios();
          setError("");
        } else {
          setError(result.error || 'Error al eliminar usuario');
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setError('Error de conexión al eliminar usuario');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingUsuario(null);
    setError("");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingUsuario) {
      handleEditUsuario(formData);
    } else {
      handleCreateUsuario(formData);
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'administrador':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'lector':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={cancelForm}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la lista
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        
        {/* User Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    required
                    defaultValue={editingUsuario?.nombre || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Nombre completo del usuario"
                  />
                </div>

                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    id="correo"
                    required
                    defaultValue={editingUsuario?.correo || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña {editingUsuario ? '(dejar vacío para mantener actual)' : '*'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required={!editingUsuario}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Contraseña segura"
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="rol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rol *
                  </label>
                  <select
                    name="rol"
                    id="rol"
                    required
                    defaultValue={editingUsuario?.rol || 'lector'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="lector">Lector</option>
                    <option value="editor">Editor</option>
                    <option value="administrador">Administrador</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Lector: Solo lectura | Editor: Crear/editar contenido | Administrador: Control total
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 hover:bg-[#CBA135] disabled:bg-blue-400 text-white rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isLoading ? 'Guardando...' : editingUsuario ? 'Actualizar Usuario' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los usuarios del sistema y sus permisos
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-[#CBA135] text-white font-semibold rounded-lg 
            transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Array.isArray(usuarios) ? usuarios.length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Administradores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(usuarios) ? usuarios.filter(u => u.rol === 'administrador').length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Editores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(usuarios) ? usuarios.filter(u => u.rol === 'editor').length : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Lectores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Array.isArray(usuarios) ? usuarios.filter(u => u.rol === 'lector').length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Lista de Usuarios
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Cargando usuarios...</p>
            </div>
          ) : usuarios.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No hay usuarios</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Comienza creando tu primer usuario.
              </p>
            </div>
          ) : (
            usuarios.map((usuario) => (
              <div key={usuario.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-lg">
                        {usuario.nombre.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {usuario.nombre}
                        {usuario.id === user?.id && (
                          <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Tú)</span>
                        )}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(usuario.rol)}`}>
                        {usuario.rol}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {usuario.correo}
                    </p>
                    {usuario.created_at && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        Creado: {new Date(usuario.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEdit(usuario)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    title="Editar usuario"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  {usuario.id !== user?.id && (
                    <button
                      onClick={() => handleDeleteUsuario(usuario)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar usuario"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}