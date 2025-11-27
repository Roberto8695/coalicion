'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { publicacionesTendenciasService, uploadsService } from '@/api';
import { usePermissions } from '@/hooks/useAuth';

export const PublicacionesTendenciasCMS = () => {
  // Permisos del usuario
  const { canCreateContent, canEditContent, canDeleteContent } = usePermissions();
  
  // Estados principales
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    autor: '',
    imagen: '',
    url: ''
  });

  // Estados para upload de imagen
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'titulo',
      header: 'Título',
      render: (value) => (
        <div className="max-w-xs truncate font-medium text-gray-300">
          {value}
        </div>
      )
    },
    {
      key: 'autor',
      header: 'Autor',
      render: (value) => value || '-'
    },
    {
      key: 'imagen',
      header: 'Imagen',
      render: (value) => value ? (
        <span className="text-green-400 text-sm">✓ Sí</span>
      ) : (
        <span className="text-gray-500 text-sm">- No</span>
      )
    },
    {
      key: 'url',
      header: 'URL',
      render: (value) => value ? (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ) : '-'
    },
    {
      key: 'created_at',
      header: 'Fecha Creación',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    }
  ];

  // Cargar datos inicial
  useEffect(() => {
    loadPublicaciones();
  }, [currentPage]);

  const loadPublicaciones = async () => {
    try {
      setLoading(true);
      const response = await publicacionesTendenciasService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setPublicaciones(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar publicaciones de tendencias: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar upload de imagen
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Validaciones del archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP, GIF');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Subir imagen usando el servicio de uploads como thumbnail
      const response = await uploadsService.uploadThumbnail(file, 'thumbnail');
      
      if (response.success) {
        // Actualizar formData con la URL de la imagen
        setFormData(prev => ({
          ...prev,
          imagen: response.data.url
        }));
        
        // Crear URL temporal para preview
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setError(response.error || 'Error al subir la imagen');
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError('Error de conexión al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Manejar drag & drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  // Abrir selector de archivos
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let response;
      if (modalMode === 'create') {
        response = await publicacionesTendenciasService.create(formData);
      } else {
        response = await publicacionesTendenciasService.update(selectedItem.id, formData);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadPublicaciones();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación de tendencia?')) {
      try {
        setLoading(true);
        const response = await publicacionesTendenciasService.delete(item.id);
        if (response.success) {
          loadPublicaciones();
        }
      } catch (err) {
        setError('Error al eliminar: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Funciones de modal
  const openCreateModal = () => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      titulo: item.titulo || '',
      descripcion: item.descripcion || '',
      autor: item.autor || '',
      imagen: item.imagen || '',
      url: item.url || ''
    });
    setImagePreview(item.imagen || '');
    setShowModal(true);
  };

  const openViewModal = (item) => {
    setModalMode('view');
    setSelectedItem(item);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      autor: '',
      imagen: '',
      url: ''
    });
    setSelectedItem(null);
    setImagePreview('');
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setError('');
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Publicaciones Tendencias E.</h1>
              <p className="mt-1 text-sm text-gray-300">
                Administra las publicaciones de tendencias electorales
              </p>
            </div>
            {canCreateContent && (
              <Button onClick={openCreateModal}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Publicación Tendencia
              </Button>
            )}
          </div>
        </div>

        <div className="p-8">
          {/* Error */}
          {error && (
            <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
              {error}
              <button 
                onClick={() => setError('')}
                className="float-right text-red-300 hover:text-red-100"
              >
                ×
              </button>
            </div>
          )}

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500/20">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Publicaciones</p>
                  <p className="text-2xl font-bold text-white">{totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500/20">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Con Imágenes</p>
                  <p className="text-2xl font-bold text-white">
                    {publicaciones.filter(pub => pub.imagen).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500/20">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Con URLs</p>
                  <p className="text-2xl font-bold text-white">
                    {publicaciones.filter(pub => pub.url).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <Table
            data={publicaciones}
            columns={columns}
            loading={loading}
            onEdit={canEditContent ? openEditModal : undefined}
            onDelete={canDeleteContent ? handleDelete : undefined}
            onView={openViewModal}
            emptyMessage="No hay publicaciones de tendencias disponibles"
          />

          {/* Paginación */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalMode === 'create' ? 'Nueva Publicación Tendencia' :
          modalMode === 'edit' ? 'Editar Publicación Tendencia' :
          'Ver Publicación Tendencia'
        }
        size="lg"
        onConfirm={modalMode !== 'view' ? handleSubmit : undefined}
        onCancel={closeModal}
        confirmText={modalMode === 'create' ? 'Crear' : 'Actualizar'}
        isLoading={loading}
      >
        {modalMode === 'view' ? (
          // Vista de solo lectura
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Título</label>
                <p className="mt-1 text-sm text-gray-100">{selectedItem?.titulo}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Descripción</label>
                <p className="mt-1 text-sm text-gray-100">{selectedItem?.descripcion || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Autor</label>
                <p className="mt-1 text-sm text-gray-100">{selectedItem?.autor || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Imagen</label>
                {selectedItem?.imagen ? (
                  <img 
                    src={selectedItem.imagen} 
                    alt="Imagen de la publicación"
                    className="mt-2 max-w-xs h-auto rounded border border-gray-600"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-100">-</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">URL</label>
                {selectedItem?.url ? (
                  <a 
                    href={selectedItem.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-1 text-sm text-blue-400 hover:text-blue-300"
                  >
                    {selectedItem.url}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-gray-100">-</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Fecha de Creación</label>
                <p className="mt-1 text-sm text-gray-100">
                  {selectedItem?.created_at ? new Date(selectedItem.created_at).toLocaleString() : '-'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Formulario
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Título"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              required
              placeholder="Título de la tendencia electoral"
            />

            <Input
              label="Descripción"
              name="descripcion"
              type="textarea"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción detallada de la tendencia"
              rows={4}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Autor"
                name="autor"
                value={formData.autor}
                onChange={handleInputChange}
                placeholder="Nombre del autor"
              />
              
              <Input
                label="URL de la Publicación"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/publicacion"
                helperText="URL de la publicación original (opcional)"
              />
            </div>

            {/* Campo de imagen con drag & drop */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Imagen
              </label>
              
              <div
                className={`w-full px-4 py-6 border-2 border-dashed rounded-lg transition-colors duration-200 text-center cursor-pointer
                  ${error && error.includes('imagen') 
                    ? "border-red-500 bg-red-900/20" 
                    : "border-gray-600 hover:border-blue-400 bg-gray-700"
                  } hover:bg-gray-600`}
                onClick={handleClickUpload}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-400">Subiendo imagen...</span>
                  </div>
                ) : imagePreview || formData.imagen ? (
                  <div className="space-y-3">
                    <img 
                      src={imagePreview || formData.imagen} 
                      alt="Vista previa"
                      className="mx-auto max-w-xs h-auto rounded border border-gray-600"
                    />
                    <div className="text-green-400">
                      <svg className="mx-auto h-6 w-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Imagen cargada correctamente</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Haz clic para cambiar la imagen
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <svg className="mx-auto h-8 w-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                    <p className="text-xs text-gray-500 mt-1">
                      JPG, PNG, WebP, GIF (máx. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};