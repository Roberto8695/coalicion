'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { verificadoresService } from '@/api';

export const VerificadoresCMS = () => {
  // Estados principales
  const [verificadores, setVerificadores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados del modal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedItem, setSelectedItem] = useState(null);

  // Estados del formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    methodology: '',
    sourceUrl: '',
    verificationUrl: '',
    status: '',
    confidence: '',
    publishDate: '',
    lastVerification: '',
    tags: '',
    author: ''
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
      key: 'name',
      header: 'Nombre',
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
          'fact-check': 'bg-blue-100 text-blue-800',
          'data-verification': 'bg-green-100 text-green-800',
          'source-validation': 'bg-purple-100 text-purple-800',
          'cross-reference': 'bg-orange-100 text-orange-800'
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
          verificado: 'bg-green-100 text-green-800',
          'en-proceso': 'bg-yellow-100 text-yellow-800',
          pendiente: 'bg-orange-100 text-orange-800',
          rechazado: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'confidence',
      header: 'Confianza',
      render: (value) => {
        if (!value) return '-';
        const confidenceNum = parseFloat(value);
        let color = 'text-gray-600';
        if (confidenceNum >= 80) color = 'text-green-600';
        else if (confidenceNum >= 60) color = 'text-yellow-600';
        else if (confidenceNum >= 40) color = 'text-orange-600';
        else color = 'text-red-600';
        
        return <span className={`font-medium ${color}`}>{value}%</span>;
      }
    },
    {
      key: 'publishdate',
      header: 'Fecha Publicación',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'author',
      header: 'Autor',
      render: (value) => value || '-'
    },
    {
      key: 'verificationurl',
      header: 'Verificación',
      render: (value) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
          Ver verificación
        </a>
      ) : '-'
    }
  ];

  // Opciones para selects
  const typeOptions = [
    { value: 'fact-check', label: 'Verificación de Hechos' },
    { value: 'data-verification', label: 'Verificación de Datos' },
    { value: 'source-validation', label: 'Validación de Fuentes' },
    { value: 'cross-reference', label: 'Referencias Cruzadas' },
    { value: 'document-analysis', label: 'Análisis de Documentos' },
    { value: 'statement-verification', label: 'Verificación de Declaraciones' }
  ];

  const statusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en-proceso', label: 'En Proceso' },
    { value: 'verificado', label: 'Verificado' },
    { value: 'rechazado', label: 'Rechazado' }
  ];

  // Cargar datos
  useEffect(() => {
    loadVerificadores();
  }, [currentPage]);

  const loadVerificadores = async () => {
    try {
      setLoading(true);
      const response = await verificadoresService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setVerificadores(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar verificadores: ' + err.message);
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
        confidence: formData.confidence ? parseFloat(formData.confidence) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : null
      };

      let response;
      if (modalMode === 'create') {
        response = await verificadoresService.create(dataToSend);
      } else {
        response = await verificadoresService.update(selectedItem.id, dataToSend);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadVerificadores();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este verificador?')) {
      try {
        setLoading(true);
        const response = await verificadoresService.delete(item.id);
        if (response.success) {
          loadVerificadores();
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
      name: item.name || '',
      description: item.description || '',
      type: item.type || '',
      methodology: item.methodology || '',
      sourceUrl: item.sourceurl || '',
      verificationUrl: item.verificationurl || '',
      status: item.status || '',
      confidence: item.confidence || '',
      publishDate: item.publishdate ? item.publishdate.split('T')[0] : '',
      lastVerification: item.lastverification ? item.lastverification.split('T')[0] : '',
      tags: item.tags ? item.tags.join(', ') : '',
      author: item.author || ''
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
      name: '',
      description: '',
      type: '',
      methodology: '',
      sourceUrl: '',
      verificationUrl: '',
      status: '',
      confidence: '',
      publishDate: '',
      lastVerification: '',
      tags: '',
      author: ''
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Verificadores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra verificadores de hechos y sistemas de validación
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Verificador
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
        data={verificadores}
        columns={columns}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onView={openViewModal}
        emptyMessage="No hay verificadores disponibles"
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
          modalMode === 'create' ? 'Nuevo Verificador' :
          modalMode === 'edit' ? 'Editar Verificador' :
          'Ver Verificador'
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
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.name}</p>
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
                <label className="block text-sm font-medium text-gray-700">Nivel de Confianza</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.confidence}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem?.author || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha Publicación</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedItem?.publishdate ? new Date(selectedItem.publishdate).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Última Verificación</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedItem?.lastverification ? new Date(selectedItem.lastverification).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <p className="mt-1 text-sm text-gray-900">{selectedItem?.description || '-'}</p>
            </div>
            {selectedItem?.methodology && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Metodología</label>
                <p className="mt-1 text-sm text-gray-900">{selectedItem.methodology}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {selectedItem?.sourceurl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL de Fuente</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a href={selectedItem.sourceurl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      Ver fuente
                    </a>
                  </p>
                </div>
              )}
              {selectedItem?.verificationurl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">URL de Verificación</label>
                  <p className="mt-1 text-sm text-gray-900">
                    <a href={selectedItem.verificationurl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      Ver verificación
                    </a>
                  </p>
                </div>
              )}
            </div>
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
                label="Nombre"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Nombre del verificador"
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
                label="Nivel de Confianza (%)"
                name="confidence"
                type="number"
                min="0"
                max="100"
                value={formData.confidence}
                onChange={handleInputChange}
                placeholder="85"
              />
              <Input
                label="Autor"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Nombre del autor"
              />
              <Input
                label="Fecha de Publicación"
                name="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={handleInputChange}
              />
              <Input
                label="Última Verificación"
                name="lastVerification"
                type="date"
                value={formData.lastVerification}
                onChange={handleInputChange}
              />
              <Input
                label="URL de Fuente"
                name="sourceUrl"
                value={formData.sourceUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
              <Input
                label="URL de Verificación"
                name="verificationUrl"
                value={formData.verificationUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <Input
              label="Descripción"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción del verificador"
            />

            <Input
              label="Metodología"
              name="methodology"
              type="textarea"
              value={formData.methodology}
              onChange={handleInputChange}
              placeholder="Metodología utilizada para la verificación"
            />

            <Input
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="verificación, hechos, datos, electoral"
              helperText="Separa los tags con comas"
            />
          </form>
        )}
      </Modal>
    </div>
  );
};