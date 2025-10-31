'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { guiasElectoralesService } from '@/api';

export const GuiasElectoralesCMS = () => {
  // Estados principales
  const [guias, setGuias] = useState([]);
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
    targetAudience: '',
    type: '',
    version: '',
    downloadUrl: '',
    publishDate: '',
    lastUpdate: '',
    tags: '',
    status: ''
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
          manual: 'bg-blue-100 text-blue-800',
          guia: 'bg-green-100 text-green-800',
          tutorial: 'bg-purple-100 text-purple-800',
          protocolo: 'bg-orange-100 text-orange-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Estado',
      render: (value) => {
        const statusColors = {
          borrador: 'bg-yellow-100 text-yellow-800',
          publicado: 'bg-green-100 text-green-800',
          revision: 'bg-orange-100 text-orange-800',
          archivado: 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'version',
      header: 'Versión',
      render: (value) => value || '-'
    },
    {
      key: 'publishdate',
      header: 'Fecha Publicación',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'targetaudience',
      header: 'Audiencia',
      render: (value) => value || '-'
    },
    {
      key: 'downloadurl',
      header: 'Descargar',
      render: (value) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-400">
          Descargar
        </a>
      ) : '-'
    }
  ];

  // Opciones para selects
  const typeOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'guia', label: 'Guía' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'protocolo', label: 'Protocolo' },
    { value: 'instructivo', label: 'Instructivo' },
    { value: 'procedimiento', label: 'Procedimiento' }
  ];

  const statusOptions = [
    { value: 'borrador', label: 'Borrador' },
    { value: 'revision', label: 'En Revisión' },
    { value: 'publicado', label: 'Publicado' },
    { value: 'archivado', label: 'Archivado' }
  ];

  const audienceOptions = [
    { value: 'ciudadania', label: 'Ciudadanía General' },
    { value: 'organizaciones', label: 'Organizaciones' },
    { value: 'autoridades', label: 'Autoridades Electorales' },
    { value: 'observadores', label: 'Observadores Electorales' },
    { value: 'medios', label: 'Medios de Comunicación' },
    { value: 'partidos', label: 'Partidos Políticos' },
    { value: 'candidatos', label: 'Candidatos' }
  ];

  // Cargar datos
  useEffect(() => {
    loadGuias();
  }, [currentPage]);

  const loadGuias = async () => {
    try {
      setLoading(true);
      const response = await guiasElectoralesService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setGuias(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar guías electorales: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const dataToSend = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null
      };

      let response;
      if (modalMode === 'create') {
        response = await guiasElectoralesService.create(dataToSend);
      } else {
        response = await guiasElectoralesService.update(selectedItem.id, dataToSend);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadGuias();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta guía electoral?')) {
      try {
        setLoading(true);
        const response = await guiasElectoralesService.delete(item.id);
        if (response.success) {
          loadGuias();
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
      targetAudience: item.targetaudience || '',
      type: item.type || '',
      version: item.version || '',
      downloadUrl: item.downloadurl || '',
      publishDate: item.publishdate ? item.publishdate.split('T')[0] : '',
      lastUpdate: item.lastupdate ? item.lastupdate.split('T')[0] : '',
      tags: item.tags ? item.tags.join(', ') : '',
      status: item.status || ''
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
      targetAudience: '',
      type: '',
      version: '',
      downloadUrl: '',
      publishDate: '',
      lastUpdate: '',
      tags: '',
      status: ''
    });
    setSelectedItem(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Guías Electorales</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra guías, manuales y documentos electorales
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Guía Electoral
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
        data={guias}
        columns={columns}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onView={openViewModal}
        emptyMessage="No hay guías electorales disponibles"
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
          modalMode === 'create' ? 'Nueva Guía Electoral' :
          modalMode === 'edit' ? 'Editar Guía Electoral' :
          'Ver Guía Electoral'
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
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estado</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Versión</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.version || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Audiencia Objetivo</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.targetaudience || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Publicación</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedItem?.publishdate ? new Date(selectedItem.publishdate).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Última Actualización</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedItem?.lastupdate ? new Date(selectedItem.lastupdate).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <p className="mt-1 text-sm text-gray-900">{selectedItem?.description || '-'}</p>
            </div>
            {selectedItem?.downloadurl && (
              <div>
                <label className="block text-sm font-medium text-gray-700">URL de Descarga</label>
                <p className="mt-1 text-sm text-gray-900">
                  <a href={selectedItem.downloadurl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-800">
                    {selectedItem.downloadurl}
                  </a>
                </p>
              </div>
            )}
            {selectedItem?.tags && selectedItem.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.tags.join(', ')}</p>
              </div>
            )}
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
                placeholder="Título de la guía electoral"
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
                label="Estado"
                name="status"
                type="select"
                value={formData.status}
                onChange={handleInputChange}
                required
                placeholder="Selecciona un estado"
                options={statusOptions}
              />
              <Input
                label="Audiencia Objetivo"
                name="targetAudience"
                type="select"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="Selecciona la audiencia"
                options={audienceOptions}
              />
              <Input
                label="Versión"
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                placeholder="v1.0"
              />
              <Input
                label="URL de Descarga"
                name="downloadUrl"
                value={formData.downloadUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
              <Input
                label="Fecha de Publicación"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
              />
              <Input
                label="Última Actualización"
                name="lastUpdate"
                type="date"
                value={formData.lastUpdate}
                onChange={handleInputChange}
              />
            </div>

            <Input
              label="Descripción"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción de la guía electoral"
            />

            <Input
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="electoral, guía, manual, democracia"
              helperText="Separa los tags con comas"
            />
          </form>
        )}
      </Modal>
    </div>
  );
};