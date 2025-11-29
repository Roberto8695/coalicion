'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { publicacionesCoalicionService } from '@/api';
import { usePermissions } from '@/hooks/useAuth';

// Tipos para las publicaciones de coalición
interface PublicacionCoalicion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_publi: string;
  url?: string;
  imagen: string | null;
  created_at: string;
  updated_at: string;
}

interface CreatePublicacionCoalicion {
  titulo: string;
  descripcion: string;
  fecha_publi: string;
  url?: string;
  imagen?: File;
}

interface UpdatePublicacionCoalicion {
  titulo: string;
  descripcion: string;
  fecha_publi: string;
  url?: string;
  imagen?: File;
}

interface FormData {
  titulo: string;
  descripcion: string;
  fecha_publi: string;
  url: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface PublicacionesCoalicionCMSProps {
  className?: string;
}

export const PublicacionesCoalicionCMS: React.FC<PublicacionesCoalicionCMSProps> = ({ 
  className = '' 
}) => {
  // Permisos del usuario
  const { canCreateContent, canEditContent, canDeleteContent } = usePermissions();
  
  // Estados principales
  const [publicaciones, setPublicaciones] = useState<PublicacionCoalicion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del modal
  const [showModal, setShowModal] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    descripcion: '',
    fecha_publi: '',
    url: ''
  });

  // Estados para upload de imagen
  const [imagePreview, setImagePreview] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Estados para notificaciones
  const [notification, setNotification] = useState<Notification | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Función para mostrar notificaciones
  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Cargar publicaciones
  const loadPublicaciones = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const filters = {
        page,
        limit: 12,
        ...(searchTerm && { search: searchTerm })
      };
      
      const response = await publicacionesCoalicionService.getAllWithFilters(filters);
      
      if (response && response.data) {
        setPublicaciones(Array.isArray(response.data) ? response.data : []);
        setCurrentPage(response.pagination?.page || 1);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        console.warn('Respuesta inválida del servicio:', response);
        setPublicaciones([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
      showNotification('Error al cargar las publicaciones de coalición', 'error');
      setPublicaciones([]);
      setCurrentPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, showNotification]);

  // Efectos
  useEffect(() => {
    loadPublicaciones();
  }, [loadPublicaciones]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPublicaciones(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, loadPublicaciones]);

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar selección de imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Procesar archivo de imagen
  const processImageFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      showNotification('Por favor selecciona solo archivos de imagen', 'error');
    }
  };

  // Manejar drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  // Limpiar formulario
  const clearForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      fecha_publi: '',
      url: ''
    });
    setSelectedImage(null);
    setImagePreview('');
    setEditingId(null);
    setShowModal(false);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Crear publicación
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica en el frontend
    if (!formData.titulo.trim()) {
      showNotification('El título es requerido', 'error');
      return;
    }
    
    if (!formData.descripcion.trim()) {
      showNotification('La descripción es requerida', 'error');
      return;
    }
    
    if (!formData.fecha_publi) {
      showNotification('La fecha de publicación es requerida', 'error');
      return;
    }
    
    try {
      const createData: CreatePublicacionCoalicion = {
        ...formData,
        ...(selectedImage && { imagen: selectedImage })
      };

      console.log('Datos a enviar:', {
        titulo: createData.titulo,
        descripcion: createData.descripcion,
        fecha_publi: createData.fecha_publi,
        url: createData.url,
        hasImage: !!createData.imagen
      });

      await publicacionesCoalicionService.create(createData);
      showNotification('Publicación de coalición creada exitosamente', 'success');
      clearForm();
      loadPublicaciones(currentPage);
    } catch (error) {
      console.error('Error al crear publicación:', error);
      // Mostrar el mensaje de error específico si está disponible
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la publicación de coalición';
      showNotification(errorMessage, 'error');
    }
  };

  // Editar publicación
  const handleEdit = (publicacion: PublicacionCoalicion) => {
    setEditingId(publicacion.id);
    setFormData({
      titulo: publicacion.titulo,
      descripcion: publicacion.descripcion,
      fecha_publi: publicacion.fecha_publi.split('T')[0],
      url: publicacion.url || ''
    });
    if (publicacion.imagen) {
      const imagen = publicacion.imagen;
      // Simplificar la verificación de tipo
      if (typeof imagen !== 'string' && imagen) {
        // Asumimos que es File si no es string
        setImagePreview(URL.createObjectURL(imagen as File));
      } else if (typeof imagen === 'string') {
        setImagePreview(imagen);
      }
    }
    setShowModal(true);
  };

  // Actualizar publicación
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    console.log('🔄 Starting update process...');
    console.log('Editing ID:', editingId);
    console.log('Form data:', formData);
    console.log('Selected image:', selectedImage ? selectedImage.name : 'No image');
    console.log('Selected image type:', selectedImage ? selectedImage.type : 'No image');
    console.log('Selected image size:', selectedImage ? selectedImage.size : 'No image');

    try {
      const updateData: UpdatePublicacionCoalicion = {
        ...formData,
        ...(selectedImage && { imagen: selectedImage })
      };

      console.log('📤 Sending update data:', {
        titulo: updateData.titulo,
        descripcion: updateData.descripcion,
        fecha_publi: updateData.fecha_publi,
        url: updateData.url,
        imagen: updateData.imagen ? `File: ${updateData.imagen.name} (${updateData.imagen.size} bytes)` : 'No file'
      });

      const result = await publicacionesCoalicionService.update(editingId, updateData);
      console.log('✅ Update successful:', result);
      showNotification('Publicación de coalición actualizada exitosamente', 'success');
      clearForm();
      loadPublicaciones(currentPage);
    } catch (error) {
      console.error('❌ Error al actualizar publicación:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la publicación de coalición';
      showNotification(errorMessage, 'error');
    }
  };

  // Eliminar publicación
  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación de coalición?')) {
      return;
    }

    try {
      await publicacionesCoalicionService.delete(id);
      showNotification('Publicación de coalición eliminada exitosamente', 'success');
      loadPublicaciones(currentPage);
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      showNotification('Error al eliminar la publicación de coalición', 'error');
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`h-screen bg-gray-800 ${className}`}>
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm ${
          notification.type === 'success' ? 'bg-green-500/90 text-white' :
          notification.type === 'error' ? 'bg-red-500/90 text-white' :
          'bg-blue-500/90 text-white'
        }`}>
          <div className="flex items-center">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Gestión de Publicaciones de Coalición
              </h1>
              <p className="text-gray-300">
                Administra las publicaciones específicas de la coalición
              </p>
            </div>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Gestiona las publicaciones relacionadas con la coalición electoral
          </p>
        </div>

        {/* Estadísticas */}
        

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar publicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {canCreateContent && (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
            >
              + Nueva Publicación
            </button>
          )}
        </div>

        {/* Tabla de publicaciones */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : publicaciones.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-12 border border-gray-700">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14-7H5m14 14H5" />
              </svg>
              <h3 className="text-xl font-medium text-white mb-2">
                No hay publicaciones de coalición
              </h3>
              <p className="text-gray-300">
                Comienza creando tu primera publicación de coalición
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Imagen
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {publicaciones.map((publicacion, index) => (
                    <tr 
                      key={publicacion.id} 
                      className={`hover:bg-gray-700/30 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'
                      }`}
                    >
                      {/* Imagen */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                          {publicacion.imagen ? (
                            <Image
                              src={(() => {
                                const imagen = publicacion.imagen;
                                if (!imagen) return '';
                                if (typeof imagen === 'string') return imagen;
                                // Si es File, crear URL temporal
                                return URL.createObjectURL(imagen as File);
                              })()}
                              alt={publicacion.titulo}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Error loading image:', publicacion.imagen);
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                          ) : (
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                          {/* Fallback icon for image errors */}
                          <svg 
                            className="w-8 h-8 text-gray-400" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            style={{ display: 'none' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                      </td>
                      
                      {/* Título */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white max-w-xs">
                          <div className="truncate" title={publicacion.titulo}>
                            {publicacion.titulo}
                          </div>
                        </div>
                      </td>
                      
                      {/* Descripción */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-md">
                          <div className="line-clamp-2" title={publicacion.descripcion}>
                            {publicacion.descripcion}
                          </div>
                        </div>
                      </td>
                      
                      {/* Fecha */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {formatDate(publicacion.fecha_publi)}
                        </div>
                      </td>
                      
                      {/* URL */}
                      <td className="px-6 py-4">
                        {publicacion.url ? (
                          <a
                            href={publicacion.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#CBA135] hover:text-[#E5B935] font-medium flex items-center max-w-xs"
                            title={publicacion.url}
                          >
                            <span className="truncate">Ver enlace</span>
                            <svg className="w-3 h-3 ml-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      
                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {canEditContent && (
                            <button
                              onClick={() => handleEdit(publicacion)}
                              className="p-2 bg-[#CBA135] hover:bg-[#E5B935] text-white rounded-lg transition-colors"
                              title="Editar publicación"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          {canDeleteContent && (
                            <button
                              onClick={() => handleDelete(publicacion.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                              title="Eliminar publicación"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => loadPublicaciones(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors text-gray-300"
            >
              Anterior
            </button>
            
            <div className="flex space-x-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => loadPublicaciones(page)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-[#CBA135] text-white'
                          : 'bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-700 text-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>
            
            <button
              onClick={() => loadPublicaciones(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors text-gray-300"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <form onSubmit={editingId ? handleUpdate : handleCreate}>
              <div className="bg-gray-800 px-6 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">
                    {editingId ? 'Editar Publicación' : 'Nueva Publicación'}
                  </h3>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      required
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      placeholder="Ingresa el título de la publicación"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      name="descripcion"
                      required
                      rows={4}
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      placeholder="Describe la publicación de coalición"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha de Publicación *
                      </label>
                      <input
                        type="date"
                        name="fecha_publi"
                        required
                        value={formData.fecha_publi}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL (opcional)
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                        placeholder="https://ejemplo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Imagen (opcional)
                    </label>
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-6 transition-colors duration-200 ${
                        isDragOver 
                          ? 'border-[#CBA135] bg-[#CBA135]/10' 
                          : 'border-gray-600 hover:border-[#CBA135]'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      {imagePreview ? (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Vista previa"
                            width={128}
                            height={128}
                            className="w-32 h-32 object-cover rounded-xl mx-auto"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setImagePreview('');
                              setSelectedImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transform translate-x-1/2 -translate-y-1/2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg 
                            className={`mx-auto h-12 w-12 transition-colors duration-200 ${
                              isDragOver ? 'text-[#CBA135]' : 'text-gray-400'
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="mt-4">
                            <p className={`text-sm font-medium transition-colors duration-200 ${
                              isDragOver ? 'text-[#CBA135]' : 'text-white'
                            }`}>
                              {isDragOver ? 'Suelta la imagen aquí' : 'Arrastra una imagen aquí'}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              o haz clic para seleccionar
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              PNG, JPG hasta 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 px-6 py-4 flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 justify-end rounded-b-xl">
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-600 border border-gray-500 rounded-xl shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CBA135]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#CBA135] hover:bg-[#E5B935] text-white rounded-xl shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#CBA135]"
                >
                  {editingId ? 'Actualizar' : 'Crear'} Publicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};