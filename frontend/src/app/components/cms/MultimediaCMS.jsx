'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { FileUpload } from './FileUpload';
import { FilePicker } from './FilePicker';
import { multimediaService, categoriasService, uploadsService } from '@/api';

export const MultimediaCMS = () => {
  // Estados principales
  const [multimedia, setMultimedia] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    thumbnail: '',
    downloadurl: '',
    previewurl: '',
    duration: '',
    format: '',
    size: '',
    tags: '',
    featured: false,
    slug: '',
    mediafile: '',
    categoria_id: ''
  });

  // Estados para subida de archivos
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedMainFile, setSelectedMainFile] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Función para obtener URL completa
  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Convertir URL relativa a URL completa del backend
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return `${baseUrl.replace('/api', '')}${url}`;
  };

  // Función para forzar descarga de archivos
  const handleForceDownload = (url) => {
    if (!url) {
      alert('URL de descarga no válida o no disponible');
      return;
    }

    try {
      // Construir URL de descarga forzada
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      
      // Extraer la ruta relativa del archivo
      let filePath = url;
      if (url.startsWith('/uploads/')) {
        filePath = url.replace('/uploads/', '');
      } else if (url.includes('/uploads/')) {
        filePath = url.split('/uploads/')[1];
      }
      
      // Parsear el path para obtener tipo, formato y nombre
      const pathParts = filePath.split('/');
      if (pathParts.length >= 3) {
        const type = pathParts[0];
        const format = pathParts[1];
        const filename = pathParts[2];
        
        const downloadUrl = `${baseUrl.replace('/api', '')}/api/uploads/download/${type}/${format}/${filename}`;
        
        // Crear enlace de descarga
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('URL de archivo no válida');
      }
      
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert('Error al descargar el archivo');
    }
  };

  // Configuración de columnas
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'title',
      header: 'Título',
      render: (value) => (
        <div className="max-w-xs truncate font-medium text-gray-300">
          {value}
        </div>
      )
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (value) => {
        const typeColors = {
          infografia: 'bg-blue-100 text-blue-800',
          video: 'bg-red-100 text-red-800',
          arte: 'bg-purple-100 text-purple-800',
          presentacion: 'bg-green-100 text-green-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value === 'infografia' ? 'Infografía' : value === 'presentacion' ? 'Presentación' : value}
          </span>
        );
      }
    },
    {
      key: 'size',
      header: 'Tamaño',
      render: (value) => value || '-'
    },
    {
      key: 'format',
      header: 'Formato',
      render: (value) => value || '-'
    },
    {
      key: 'downloadurl',
      header: 'Archivo',
      render: (value) => value ? (
        <button
          onClick={() => handleForceDownload(value)}
          className="text-blue-400 hover:text-blue-300 underline cursor-pointer bg-none border-none p-0"
        >
          Descargar
        </button>
      ) : '-'
    }
  ];

  // Opciones para selects
  const typeOptions = [
    { value: 'infografia', label: 'Infografía' },
    { value: 'video', label: 'Video' },
    { value: 'arte', label: 'Arte' },
    { value: 'presentacion', label: 'Presentación' }
  ];

  // Obtener tipos de archivos aceptados según el tipo
  const getAcceptedFiles = (type) => {
    const acceptedTypes = {
      'infografia': 'image/jpeg,image/jpg,image/png,image/svg+xml,application/pdf',
      'video': 'video/mp4,video/avi,video/quicktime,video/x-msvideo',
      'arte': 'image/jpeg,image/jpg,image/png,image/svg+xml,image/gif',
      'presentacion': 'application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };
    return acceptedTypes[type] || '*/*';
  };

  // Cargar datos
  useEffect(() => {
    loadMultimedia();
    loadCategorias();
  }, [currentPage]);

  const loadMultimedia = async () => {
    try {
      setLoading(true);
      const response = await multimediaService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setMultimedia(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar multimedia: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await categoriasService.getAll();
      if (response.success) {
        setCategorias(response.data);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar selección de archivo principal
  const handleMainFileSelect = (file) => {
    setSelectedMainFile(file);
    
    // Auto-completar campos basados en el archivo
    const extension = uploadsService.getFileExtension(file.name);
    const slug = uploadsService.generateSlug(file.name);
    const size = uploadsService.formatFileSize(file.size);
    
    setFormData(prev => ({
      ...prev,
      format: extension.toUpperCase(),
      size: size,
      slug: slug,
      mediafile: file.name
    }));
  };

  // Subir archivo principal
  const handleMainFileUpload = async (file) => {
    if (!formData.type) {
      setError('Selecciona primero el tipo de multimedia');
      return;
    }

    try {
      setUploadingFile(true);
      const response = await uploadsService.uploadFile(file, formData.type);
      
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          downloadurl: response.data.url,
          mediafile: response.data.filename,
          format: response.data.format,
          size: response.data.size,
          duration: response.data.duration || prev.duration
        }));
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw new Error(`Error subiendo archivo: ${error.message}`);
    } finally {
      setUploadingFile(false);
    }
  };

  // Manejar selección de miniatura desde picker
  const handleThumbnailSelect = (fileUrl, fileName) => {
    setFormData(prev => ({ ...prev, thumbnail: fileUrl }));
  };

  // Manejar selección de vista previa desde picker
  const handlePreviewSelect = (fileUrl, fileName) => {
    setFormData(prev => ({ ...prev, previewurl: fileUrl }));
  };

  // Subir miniatura
  const handleThumbnailUpload = async (file) => {
    try {
      const response = await uploadsService.uploadThumbnail(file, 'thumbnail');
      
      if (response.success) {
        setFormData(prev => ({ ...prev, thumbnail: response.data.url }));
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw new Error(`Error subiendo miniatura: ${error.message}`);
    }
  };

  // Subir vista previa
  const handlePreviewUpload = async (file) => {
    try {
      const response = await uploadsService.uploadThumbnail(file, 'preview');
      
      if (response.success) {
        setFormData(prev => ({ ...prev, previewurl: response.data.url }));
        return response;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw new Error(`Error subiendo vista previa: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null
      };

      let response;
      if (modalMode === 'create') {
        response = await multimediaService.create(dataToSend);
      } else {
        response = await multimediaService.update(selectedItem.id, dataToSend);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadMultimedia();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo multimedia?')) {
      try {
        setLoading(true);
        const response = await multimediaService.delete(item.id);
        if (response.success) {
          loadMultimedia();
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
      title: item.title || '',
      description: item.description || '',
      type: item.type || '',
      thumbnail: item.thumbnail || '',
      downloadurl: item.downloadurl || '',
      previewurl: item.previewurl || '',
      duration: item.duration || '',
      format: item.format || '',
      size: item.size || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
      featured: item.featured || false,
      slug: item.slug || '',
      mediafile: item.mediafile || '',
      categoria_id: item.categoria_id || ''
    });
    setShowModal(true);
  };

  const openViewModal = (item) => {
    setModalMode('view');
    setSelectedItem(item);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      thumbnail: '',
      downloadurl: '',
      previewurl: '',
      duration: '',
      format: '',
      size: '',
      tags: '',
      featured: false,
      slug: '',
      mediafile: '',
      categoria_id: ''
    });
    setSelectedItem(null);
    setSelectedMainFile(null);
    setUploadingFile(false);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Multimedia</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra archivos multimedia del sistema
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Multimedia
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabla */}
      <Table
        data={multimedia}
        columns={columns}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onView={openViewModal}
        emptyMessage="No hay archivos multimedia disponibles"
      />

      {/* Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalMode === 'create' ? 'Nuevo Multimedia' :
          modalMode === 'edit' ? 'Editar Multimedia' :
          'Ver Multimedia'
        }
        size="lg"
        onConfirm={modalMode !== 'view' ? handleSubmit : undefined}
        onCancel={closeModal}
        confirmText={modalMode === 'create' ? 'Crear' : 'Actualizar'}
        isLoading={loading}
      >
        {modalMode === 'view' ? (
          // Vista de solo lectura
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                <p className="text-white font-medium">{selectedItem?.title}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                <p className="text-white">{selectedItem?.type}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Tamaño</label>
                <p className="text-white">{selectedItem?.size || '-'}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Formato</label>
                <p className="text-white">{selectedItem?.format || '-'}</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
              <p className="text-white leading-relaxed">{selectedItem?.description || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">URL de Descarga</label>
                <div className="text-white">
                  {selectedItem?.downloadurl ? (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleForceDownload(selectedItem.downloadurl)}
                        className="text-blue-400 hover:text-blue-300 underline cursor-pointer bg-none border-none p-0 block"
                      >
                        Descargar archivo
                      </button>
                      <p className="text-xs text-gray-400 break-all">{selectedItem.downloadurl}</p>
                    </div>
                  ) : '-'}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">URL de Vista Previa</label>
                <div className="text-white">
                  {selectedItem?.previewurl ? (
                    <a 
                      href={getFullUrl(selectedItem.previewurl)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 underline break-all"
                    >
                      {selectedItem.previewurl}
                    </a>
                  ) : '-'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Duración</label>
                <p className="text-white">{selectedItem?.duration || '-'}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Archivo de Medios</label>
                <p className="text-white">{selectedItem?.mediafile || '-'}</p>
              </div>
            </div>
          </div>
        ) : (
          // Formulario
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Título del archivo"
              />
              <Input
                label="Tipo"
                name="type"
                type="select"
                value={formData.type}
                onChange={handleInputChange}
                required
                placeholder="Selecciona un tipo"
                options={typeOptions}
              />
            </div>

            {/* Subida de archivo principal */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300 border-b border-gray-700 pb-2">
                Archivo Principal
              </h3>
              
              <FileUpload
                label="Subir Archivo"
                accept={getAcceptedFiles(formData.type)}
                maxSize={100}
                onFileSelect={handleMainFileSelect}
                onUpload={handleMainFileUpload}
                disabled={!formData.type}
                helperText={!formData.type ? "Primero selecciona el tipo de multimedia" : "Arrastra o selecciona el archivo principal"}
              />

              {/* URL manual como alternativa */}
              <Input
                label="URL de Descarga (alternativa)"
                name="downloadurl"
                value={formData.downloadurl}
                onChange={handleInputChange}
                placeholder="https://... (opcional si subes archivo)"
                helperText="Puedes subir un archivo o ingresar una URL manualmente"
              />
            </div>

            {/* Metadatos auto-completados */}
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Tamaño del Archivo"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="Se detecta automáticamente"
                helperText="Se completa automáticamente al subir archivo"
              />
              <Input
                label="Formato"
                name="format"
                value={formData.format}
                onChange={handleInputChange}
                placeholder="Se detecta automáticamente"
                helperText="Se completa automáticamente al subir archivo"
              />
              <Input
                label="Duración"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="00:05:30 (para videos/audio)"
                helperText="Formato: HH:MM:SS"
              />
            </div>

            {/* Slug auto-generado */}
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="Se genera automáticamente"
              helperText="URL amigable - se genera automáticamente del nombre del archivo"
            />

            {/* Miniatura y vista previa */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300 border-b border-gray-700 pb-2">
                Imágenes
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FileUpload
                    label="Subir Miniatura"
                    accept="image/*"
                    maxSize={10}
                    onFileSelect={(file) => console.log('Miniatura seleccionada:', file)}
                    onUpload={handleThumbnailUpload}
                    helperText="Imagen pequeña para mostrar en listas"
                  />
                  
                  <FilePicker
                    label="O seleccionar miniatura existente"
                    type="thumbnails"
                    value={formData.thumbnail}
                    onChange={handleThumbnailSelect}
                    placeholder="Seleccionar desde archivos existentes"
                  />
                </div>

                <div className="space-y-4">
                  <FileUpload
                    label="Subir Vista Previa"
                    accept="image/*"
                    maxSize={10}
                    onFileSelect={(file) => console.log('Vista previa seleccionada:', file)}
                    onUpload={handlePreviewUpload}
                    helperText="Imagen de vista previa más grande"
                  />
                  
                  <FilePicker
                    label="O seleccionar vista previa existente"
                    type="previews"
                    value={formData.previewurl}
                    onChange={handlePreviewSelect}
                    placeholder="Seleccionar desde archivos existentes"
                  />
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-300 border-b border-gray-700 pb-2">
                Información Adicional
              </h3>
              
              <Input
                label="Descripción"
                name="description"
                type="textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción del archivo multimedia"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Archivo de Medios"
                  name="mediafile"
                  value={formData.mediafile}
                  onChange={handleInputChange}
                  placeholder="Se completa automáticamente"
                  helperText="Nombre del archivo de medios"
                />
                <Input
                  label="Categoría"
                  name="categoria_id"
                  type="select"
                  value={formData.categoria_id}
                  onChange={handleInputChange}
                  placeholder="Selecciona una categoría"
                  options={categorias.map(cat => ({ value: cat.id, label: cat.name }))}
                />
              </div>

              <Input
                label="Tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
                helperText="Separa los tags con comas"
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-300">
                  Archivo destacado
                </label>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};