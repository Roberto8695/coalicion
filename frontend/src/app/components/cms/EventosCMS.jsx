'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { eventosService } from '@/api';

export const EventosCMS = () => {
  // Estados principales
  const [eventos, setEventos] = useState([]);
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
    startDate: '',
    endDate: '',
    location: '',
    type: '',
    status: '',
    maxParticipants: '',
    registrationUrl: '',
    imageUrl: '',
    organizer: ''
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
          conferencia: 'bg-blue-100 text-blue-800',
          taller: 'bg-green-100 text-green-800',
          webinar: 'bg-purple-100 text-purple-800',
          encuentro: 'bg-orange-100 text-orange-800',
          foro: 'bg-yellow-100 text-yellow-800'
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
          programado: 'bg-blue-100 text-blue-800',
          activo: 'bg-green-100 text-green-800',
          finalizado: 'bg-gray-100 text-gray-800',
          cancelado: 'bg-red-100 text-red-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'startdate',
      header: 'Fecha Inicio',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'location',
      header: 'Ubicación',
      render: (value) => value || '-'
    },
    {
      key: 'maxparticipants',
      header: 'Max. Participantes',
      render: (value) => value || 'Sin límite'
    }
  ];

  // Opciones para selects
  const typeOptions = [
    { value: 'conferencia', label: 'Conferencia' },
    { value: 'taller', label: 'Taller' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'encuentro', label: 'Encuentro' },
    { value: 'foro', label: 'Foro' },
    { value: 'reunion', label: 'Reunión' },
    { value: 'capacitacion', label: 'Capacitación' }
  ];

  const statusOptions = [
    { value: 'programado', label: 'Programado' },
    { value: 'activo', label: 'Activo' },
    { value: 'finalizado', label: 'Finalizado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  // Cargar datos
  useEffect(() => {
    loadEventos();
  }, [currentPage]);

  const loadEventos = async () => {
    try {
      setLoading(true);
      const response = await eventosService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setEventos(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar eventos: ' + err.message);
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
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null
      };

      let response;
      if (modalMode === 'create') {
        response = await eventosService.create(dataToSend);
      } else {
        response = await eventosService.update(selectedItem.id, dataToSend);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadEventos();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        setLoading(true);
        const response = await eventosService.delete(item.id);
        if (response.success) {
          loadEventos();
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
      startDate: item.startdate ? item.startdate.split('T')[0] + 'T' + item.startdate.split('T')[1].split('.')[0] : '',
      endDate: item.enddate ? item.enddate.split('T')[0] + 'T' + item.enddate.split('T')[1].split('.')[0] : '',
      location: item.location || '',
      type: item.type || '',
      status: item.status || '',
      maxParticipants: item.maxparticipants || '',
      registrationUrl: item.registrationurl || '',
      imageUrl: item.imageurl || '',
      organizer: item.organizer || ''
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
      startDate: '',
      endDate: '',
      location: '',
      type: '',
      status: '',
      maxParticipants: '',
      registrationUrl: '',
      imageUrl: '',
      organizer: ''
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra eventos y actividades de la coalición
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Evento
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
        data={eventos}
        columns={columns}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onView={openViewModal}
        emptyMessage="No hay eventos disponibles"
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
          modalMode === 'create' ? 'Nuevo Evento' :
          modalMode === 'edit' ? 'Editar Evento' :
          'Ver Evento'
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <p className="text-white">{selectedItem?.status}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Organizador</label>
                <p className="text-white">{selectedItem?.organizer}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Inicio</label>
                <p className="text-white">
                  {selectedItem?.startdate ? new Date(selectedItem.startdate).toLocaleString() : '-'}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Fin</label>
                <p className="text-white">
                  {selectedItem?.enddate ? new Date(selectedItem.enddate).toLocaleString() : '-'}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Ubicación</label>
                <p className="text-white">{selectedItem?.location || '-'}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">Max. Participantes</label>
                <p className="text-white">{selectedItem?.maxparticipants || 'Sin límite'}</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
              <p className="text-white leading-relaxed">{selectedItem?.description || '-'}</p>
            </div>
            {selectedItem?.registrationurl && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-300 mb-2">URL de Registro</label>
                <div className="text-white">
                  <a 
                    href={selectedItem.registrationurl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 underline break-all"
                  >
                    {selectedItem.registrationurl}
                  </a>
                </div>
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
                placeholder="Título del evento"
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
                label="Organizador"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                placeholder="Nombre del organizador"
              />
              <Input
                label="Fecha y Hora de Inicio"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Fecha y Hora de Fin"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleInputChange}
              />
              <Input
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ubicación del evento"
              />
              <Input
                label="Máximo de Participantes"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                placeholder="Sin límite si se deja vacío"
              />
              <Input
                label="URL de Registro"
                name="registrationUrl"
                value={formData.registrationUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
              <Input
                label="URL de Imagen"
                name="imageUrl"
                value={formData.imageUrl}
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
              placeholder="Descripción del evento"
            />
          </form>
        )}
      </Modal>
    </div>
  );
};