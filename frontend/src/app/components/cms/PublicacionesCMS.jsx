'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { publicacionesService, categoriasService } from '@/api';
import { usePermissions } from '@/hooks/useAuth';

// Función para convertir URLs de Google Drive a URLs de descarga directa
const convertGoogleDriveUrl = (url) => {
  if (!url) return url;
  
  // Verificar si es una URL de Google Drive
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Convertir a URL de descarga directa
    const fileId = match[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  return url; // Si no es de Google Drive, devolver la URL original
};

export const PublicacionesCMS = () => {
  // Permisos del usuario
  const { canCreateContent, canEditContent, canDeleteContent } = usePermissions();
  
  // Estados principales
  const [publicaciones, setPublicaciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    categoria_id: '',
    date: '',
    author: '',
    pages: '',
    downloadUrl: '',
    previewUrl: '',
    tags: '',
    featured: false,
    thumbnail: '',
    fileSize: '',
    status: 'draft'
  });

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
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'author',
      header: 'Autor',
      render: (value) => value || '-'
    },
    {
      key: 'date',
      header: 'Fecha',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'status',
      header: 'Estado',
      render: (value) => {
        const statusColors = {
          published: 'bg-green-100 text-green-800',
          draft: 'bg-yellow-100 text-yellow-800',
          archived: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value || 'draft'}
          </span>
        );
      }
    }
  ];

  // Opciones para selects
  const typeOptions = [
    { value: 'informe', label: 'Informe' },
    { value: 'estudio', label: 'Estudio' },
    { value: 'monitoreo', label: 'Monitoreo' },
    { value: 'investigacion', label: 'Investigación' }
  ];

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'published', label: 'Publicado' },
    { value: 'archived', label: 'Archivado' }
  ];

  // Cargar datos inicial
  useEffect(() => {
    loadPublicaciones();
    loadCategorias();
  }, [currentPage]);

  const loadPublicaciones = async () => {
    try {
      setLoading(true);
      const response = await publicacionesService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setPublicaciones(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar publicaciones: ' + err.message);
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : null,
        categoria_id: formData.categoria_id ? parseInt(formData.categoria_id) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null,
        downloadUrl: convertGoogleDriveUrl(formData.downloadUrl) // Convertir URL de descarga para descarga directa
      };

      let response;
      if (modalMode === 'create') {
        response = await publicacionesService.create(dataToSend);
      } else {
        response = await publicacionesService.update(selectedItem.id, dataToSend);
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
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      try {
        setLoading(true);
        const response = await publicacionesService.delete(item.id);
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
      title: item.title || '',
      description: item.description || '',
      type: item.type || '',
      categoria_id: item.categoria_id || '',
      date: item.date ? item.date.split('T')[0] : '',
      author: item.author || '',
      pages: item.pages || '',
      downloadUrl: item.downloadurl || '',
      previewUrl: item.previewurl || '',
      tags: item.tags ? item.tags.join(', ') : '',
      featured: item.featured || false,
      thumbnail: item.thumbnail || '',
      fileSize: item.filesize || '',
      status: item.status || 'draft'
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
      categoria_id: '',
      date: '',
      author: '',
      pages: '',
      downloadUrl: '',
      previewUrl: '',
      tags: '',
      featured: false,
      thumbnail: '',
      fileSize: '',
      status: 'draft'
    });
    setSelectedItem(null);
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
              <h1 className="text-2xl font-bold text-white">Gestión de Publicaciones</h1>
              <p className="mt-1 text-sm text-gray-300">
                Administra las publicaciones del sistema
              </p>
            </div>
            {canCreateContent && (
              <Button onClick={openCreateModal}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Publicación
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

          {/* Tabla */}
          <Table
            data={publicaciones}
            columns={columns}
            loading={loading}
            onEdit={canEditContent ? openEditModal : undefined}
            onDelete={canDeleteContent ? handleDelete : undefined}
            onView={openViewModal}
            emptyMessage="No hay publicaciones disponibles"
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
          modalMode === 'create' ? 'Nueva Publicación' :
          modalMode === 'edit' ? 'Editar Publicación' :
          'Ver Publicación'
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Título</label>
                <p className="mt-1 text-sm text-gray-100">{selectedItem?.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Tipo</label>
                <p className="mt-1 text-sm text-gray-100">{selectedItem?.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Autor</label>
                <p className="mt-1 text-sm text-gray-100">{selectedItem?.author || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Fecha</label>
                <p className="mt-1 text-sm text-gray-100">
                  {selectedItem?.date ? new Date(selectedItem.date).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Descripción</label>
              <p className="mt-1 text-sm text-gray-100">{selectedItem?.description || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">URL de descarga</label>
                <p className="mt-1 text-sm text-blue-400">
                  {selectedItem?.downloadUrl ? (
                    <a href={selectedItem.downloadUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {selectedItem.downloadUrl}
                    </a>
                  ) : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">URL de vista previa</label>
                <p className="mt-1 text-sm text-blue-400">
                  {selectedItem?.previewUrl ? (
                    <a href={selectedItem.previewUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {selectedItem.previewUrl}
                    </a>
                  ) : '-'}
                </p>
              </div>
            </div>
            
            {/* Botones de acción para URLs */}
            <div className="flex gap-4 pt-4 border-t border-gray-700">
              {selectedItem?.downloadUrl && (
                <a 
                  href={selectedItem.downloadUrl}
                  download
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar
                </a>
              )}
              
              {selectedItem?.previewUrl && (
                <a 
                  href={selectedItem.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Vista Previa
                </a>
              )}
            </div>
          </div>
        ) : (
          // Formulario
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Título"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Título de la publicación"
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
              <Input
                label="Categoría"
                name="categoria_id"
                type="select"
                value={formData.categoria_id}
                onChange={handleInputChange}
                placeholder="Selecciona una categoría"
                options={categorias.map(cat => ({ value: cat.id, label: cat.name }))}
              />
              <Input
                label="Autor"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Nombre del autor"
              />
              <Input
                label="Fecha"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              <Input
                label="Páginas"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleInputChange}
                placeholder="Número de páginas"
              />
              <Input
                label="URL de descarga"
                name="downloadUrl"
                value={formData.downloadUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
              <Input
                label="URL de vista previa"
                name="previewUrl"
                value={formData.previewUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
              <Input
                label="Estado"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                options={statusOptions}
              />
            </div>

            <Input
              label="Descripción"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción de la publicación"
            />

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
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 focus:ring-offset-gray-800 border-gray-600 bg-gray-700 rounded"
              />
              <label className="ml-2 block text-sm text-gray-300">
                Publicación destacada
              </label>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};