'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { IconFileDescription, IconPlus } from '@tabler/icons-react';
import { documentosElectoralesService } from '@/api';
import { usePermissions } from '@/hooks/useAuth';

export const DocumentosElectoralesCMS = () => {
  // Permisos del usuario
  const permissions = usePermissions();
  
  // Verificar acceso al dashboard
  if (!permissions.canAccessDashboard) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-lg font-semibold">
          No tienes permisos para acceder a esta sección
        </div>
      </div>
    );
  }

  // Estados principales
  const [documentos, setDocumentos] = useState([]);
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
    type: 'PDF',
    category: 'Manual',
    fileUrl: '',
    previewUrl: '',
    fileSize: '',
    publishDate: '',
    status: 'borrador',
    tags: '',
    authorName: '',
    version: '1.0'
  });

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Configuración de columnas
  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (value) => <span className="font-mono text-sm text-gray-300">{value}</span>
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
          PDF: 'bg-red-500/20 text-red-300',
          DOC: 'bg-blue-500/20 text-blue-300',
          XLSX: 'bg-green-500/20 text-green-300',
          PPTX: 'bg-orange-500/20 text-orange-300'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[value] || 'bg-gray-500/20 text-gray-300'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (value) => {
        const categoryColors = {
          Manual: 'bg-blue-500/20 text-blue-300',
          Procedimiento: 'bg-green-500/20 text-green-300',
          Normativa: 'bg-purple-500/20 text-purple-300',
          Capacitación: 'bg-orange-500/20 text-orange-300',
          Informe: 'bg-indigo-500/20 text-indigo-300'
        };
        const categoryLabels = {
          Manual: 'Manual',
          Procedimiento: 'Procedimiento',
          Normativa: 'Normativa',
          Capacitación: 'Capacitación',
          Informe: 'Informe'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[value] || 'bg-gray-500/20 text-gray-300'}`}>
            {categoryLabels[value] || value}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Estado',
      render: (value) => {
        const statusColors = {
          borrador: 'bg-yellow-500/20 text-yellow-300',
          revision: 'bg-orange-500/20 text-orange-300',
          publicado: 'bg-green-500/20 text-green-300',
          archivado: 'bg-gray-500/20 text-gray-300'
        };
        const statusLabels = {
          borrador: 'Borrador',
          revision: 'En Revisión',
          publicado: 'Publicado',
          archivado: 'Archivado'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value] || 'bg-gray-500/20 text-gray-300'}`}>
            {statusLabels[value] || value}
          </span>
        );
      }
    },
    {
      key: 'publishDate',
      header: 'Fecha de Publicación',
      render: (value) => (
        <span className="text-gray-300">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </span>
      )
    },
    {
      key: 'version',
      header: 'Versión',
      render: (value) => (
        <span className="text-gray-300">
          {value || '1.0'}
        </span>
      )
    }
  ];

  // Opciones para selects
  const typeOptions = [
    { value: 'PDF', label: 'PDF' },
    { value: 'DOC', label: 'Word (DOC/DOCX)' },
    { value: 'XLSX', label: 'Excel (XLSX)' },
    { value: 'PPTX', label: 'PowerPoint (PPTX)' }
  ];

  const categoryOptions = [
    { value: 'Manual', label: 'Manual' },
    { value: 'Procedimiento', label: 'Procedimiento' },
    { value: 'Normativa', label: 'Normativa' },
    { value: 'Capacitación', label: 'Capacitación' },
    { value: 'Informe', label: 'Informe' }
  ];

  const statusOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'revision', label: 'En Revisión' },
    { value: 'publicado', label: 'Publicado' },
    { value: 'archivado', label: 'Archivado' }
  ];

  // Cargar datos
  useEffect(() => {
    loadDocumentos();
  }, [currentPage]);

  const loadDocumentos = async () => {
    try {
      setLoading(true);
      // Nota: necesitarás crear este servicio en el API
      const response = await documentosElectoralesService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setDocumentos(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar documentos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para convertir URL de Google Drive a descarga directa
  const convertGoogleDriveUrl = (url) => {
    if (!url) return url;
    
    // Detectar si es URL de Google Drive con formato /view
    const driveViewMatch = url.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/);
    if (driveViewMatch) {
      const fileId = driveViewMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    // Detectar si es URL de Google Drive con formato /open
    const driveOpenMatch = url.match(/https:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (driveOpenMatch) {
      const fileId = driveOpenMatch[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    // Si no es Google Drive o ya está en formato correcto, devolver original
    return url;
  };

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Convertir automáticamente URLs de Google Drive SOLO para fileUrl
    if (name === 'fileUrl' && value) {
      const originalUrl = value;
      newValue = convertGoogleDriveUrl(value);
      
      // Mostrar notificación si se hizo conversión
      if (originalUrl !== newValue && originalUrl.includes('drive.google.com')) {
        console.log('✅ URL de Google Drive convertida automáticamente a descarga directa');
        // Opcional: mostrar un mensaje temporal al usuario
        const tempMsg = document.createElement('div');
        tempMsg.innerHTML = '✅ URL convertida automáticamente para descarga directa';
        tempMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 10px 15px; border-radius: 5px; z-index: 9999; font-size: 14px;';
        document.body.appendChild(tempMsg);
        setTimeout(() => document.body.removeChild(tempMsg), 3000);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar permisos
    if (modalMode === 'create' && !permissions.canCreateContent) {
      setError('No tienes permisos para crear documentos');
      return;
    }
    
    if (modalMode === 'edit' && !permissions.canEditContent) {
      setError('No tienes permisos para editar documentos');
      return;
    }
    
    try {
      setLoading(true);
      
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        fileUrl: formData.fileUrl,
        previewUrl: formData.previewUrl || null,
        fileSize: formData.fileSize ? parseInt(formData.fileSize) : null,
        publishDate: formData.publishDate || null,
        status: formData.status,
        tags: formData.tags || null,
        authorName: formData.authorName || null,
        version: formData.version || '1.0'
      };

      let response;
      if (modalMode === 'create') {
        response = await documentosElectoralesService.create(dataToSend);
      } else {
        response = await documentosElectoralesService.update(selectedItem.id, dataToSend);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadDocumentos();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    // Verificar permisos
    if (!permissions.canDeleteContent) {
      setError('No tienes permisos para eliminar documentos');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      try {
        setLoading(true);
        const response = await documentosElectoralesService.delete(item.id);
        if (response.success) {
          loadDocumentos();
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
    if (!permissions.canCreateContent) {
      setError('No tienes permisos para crear documentos');
      return;
    }
    setModalMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    if (!permissions.canEditContent) {
      setError('No tienes permisos para editar documentos');
      return;
    }
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'PDF',
      category: item.category || 'Manual',
      fileUrl: item.fileUrl || '',
      previewUrl: item.previewUrl || '',
      fileSize: item.fileSize || '',
      publishDate: item.publishDate ? item.publishDate.split('T')[0] : '',
      status: item.status || 'borrador',
      tags: item.tags || '',
      authorName: item.authorName || '',
      version: item.version || '1.0'
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
      type: 'PDF',
      category: 'Manual',
      fileUrl: '',
      previewUrl: '',
      fileSize: '',
      publishDate: '',
      status: 'borrador',
      tags: '',
      authorName: '',
      version: '1.0'
    });
    setSelectedItem(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setError('');
  };

  return (
    <div className="space-y-6 bg-gray-800 h-screen p-6">
      <div className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-700 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Documentos Electorales</h1>
              <p className="mt-1 text-sm text-gray-300">
                Administra los documentos electorales del sistema
              </p>
            </div>
            {permissions.canCreateContent && (
              <Button onClick={openCreateModal}>
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Documento
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
          

          {/* Tabla */}
      <Table
        data={documentos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay documentos disponibles"
        onView={openViewModal}
        onEdit={permissions.canEditContent ? openEditModal : undefined}
        onDelete={permissions.canDeleteContent ? handleDelete : undefined}
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
          modalMode === 'create' ? '📄 Nuevo Documento Electoral OEP' :
          modalMode === 'edit' ? '✏️ Editar Documento Electoral' :
          '👁️ Ver Documento Electoral'
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
                <label className="block text-sm font-bold text-gray-400">Título</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.title}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Tipo</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.type}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Categoría</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.category}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Estado</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.status}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Versión</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.version}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Fecha de Publicación</label>
                <p className="mt-1 text-sm text-gray-300">
                  {selectedItem?.publishDate ? new Date(selectedItem.publishDate).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Autor</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.authorName || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Tamaño de Archivo</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.fileSize || '-'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400">Descripción</label>
              <p className="mt-1 text-sm text-gray-300">{selectedItem?.description || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400">URL del Archivo</label>
              <p className="mt-1 text-sm text-gray-300">
                {selectedItem?.fileUrl ? (
                  <a href={selectedItem.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    {selectedItem.fileUrl}
                  </a>
                ) : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400">Etiquetas</label>
              <p className="mt-1 text-sm text-gray-300">{selectedItem?.tags || '-'}</p>
            </div>
          </div>
        ) : (
          // Formulario
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Input
                  label="Título"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Título del documento electoral"
                />
              </div>
              <Input
                label="Tipo de Archivo"
                name="type"
                type="select"
                value={formData.type}
                onChange={handleInputChange}
                required
                options={typeOptions}
              />
              <Input
                label="Categoría"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleInputChange}
                required
                options={categoryOptions}
              />
              <Input
                label="Estado"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                options={statusOptions}
              />
              <Input
                label="Versión"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                placeholder="Ej: 1.0, 2.1"
              />
              <Input
                label="Fecha de Publicación"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
              />
              <Input
                label="Tamaño del Archivo (KB)"
                name="fileSize"
                type="number"
                value={formData.fileSize}
                onChange={handleInputChange}
                placeholder="Tamaño en KB"
              />
              <Input
                label="Autor"
                name="authorName"
                value={formData.authorName}
                onChange={handleInputChange}
                placeholder="Nombre del autor"
              />
            </div>

            <Input
              label="Descripción"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción del documento electoral"
            />

            <Input
              label="URL del Archivo"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleInputChange}
              required
              placeholder="https://... (URLs de Google Drive se convierten automáticamente)"
              helperText="Se acepta cualquier URL. Las URLs de Google Drive se convertirán automáticamente para descarga directa."
            />

            <Input
              label="URL de Vista Previa"
              name="previewUrl"
              value={formData.previewUrl}
              onChange={handleInputChange}
              placeholder="https://... (URL original para vista previa)"
              helperText="URL para vista previa (opcional). Se mantiene tal como la escribas."
            />

            <Input
              label="Etiquetas"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="electoral, manual, procedimiento"
              helperText="Etiquetas separadas por comas"
            />
          </form>
        )}
      </Modal>
    </div>
  );
};
