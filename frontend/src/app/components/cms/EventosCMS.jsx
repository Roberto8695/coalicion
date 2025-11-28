'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { eventosService } from '@/api';
import { usePermissions } from '@/hooks/useAuth';

export const EventosCMS = () => {
  const { canCreateContent, canEditContent, canDeleteContent } = usePermissions();
  // Estados principales
  const [eventos, setEventos] = useState([]);
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
    type: 'taller',
    date: '',
    time: '',
    location: '',
    duration: '',
    capacity: '',
    registrationUrl: '',
    slug: '',
    organizer: '',
    status: 'upcoming',
    image: '',
    requirements: ''
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
        <div className="max-w-xs">
          <p className="font-medium text-white truncate">{value}</p>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Tipo',
      render: (value) => {
        const typeConfig = {
          taller: { label: 'Taller', color: 'bg-blue-500 text-white' },
          capacitacion: { label: 'Capacitación', color: 'bg-green-500 text-white' },
          foro: { label: 'Foro', color: 'bg-purple-500 text-white' },
          debate: { label: 'Debate', color: 'bg-red-500 text-white' }
        };
        const config = typeConfig[value] || { label: value, color: 'bg-gray-500 text-white' };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'date',
      header: 'Fecha y Hora',
      render: (value) => {
        console.log('Renderizando fecha:', value, typeof value);
        
        if (!value || value === null || value === '') {
          return <span className="text-gray-400">Sin fecha</span>;
        }
        
        try {
          const date = new Date(value);
          
          // Verificar si la fecha es válida
          if (isNaN(date.getTime())) {
            return <span className="text-red-400">Fecha inválida</span>;
          }
          
          return (
            <div className="text-sm">
              <div className="text-white">{date.toLocaleDateString('es-ES')}</div>
              <div className="text-gray-300">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          );
        } catch (error) {
          console.error('Error al procesar fecha:', error);
          return <span className="text-red-400">Error en fecha</span>;
        }
      }
    },
    {
      key: 'time',
      header: 'Hora (texto)',
      render: (value) => (
        <span className="text-sm text-gray-300">{value || '-'}</span>
      )
    },
    {
      key: 'location',
      header: 'Ubicación',
      render: (value) => (
        <div className="max-w-xs">
          <p className="text-sm text-white truncate">{value || '-'}</p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Estado',
      render: (value) => {
        const statusConfig = {
          upcoming: { label: 'Próximo', color: 'bg-yellow-500 text-black' },
          ongoing: { label: 'En curso', color: 'bg-green-500 text-white' },
          completed: { label: 'Completado', color: 'bg-gray-500 text-white' },
          cancelled: { label: 'Cancelado', color: 'bg-red-500 text-white' }
        };
        const config = statusConfig[value] || { label: value, color: 'bg-gray-500 text-white' };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'capacity',
      header: 'Capacidad',
      render: (value) => <span className="text-sm text-gray-300">{value || '-'}</span>
    }
  ];

  // Opciones de tipo de evento
  const eventTypeOptions = [
    { value: 'taller', label: 'Taller' },
    { value: 'capacitacion', label: 'Capacitación' },
    { value: 'foro', label: 'Foro' },
    { value: 'debate', label: 'Debate' }
  ];

  // Opciones de estado
  const statusOptions = [
    { value: 'upcoming', label: 'Próximo' },
    { value: 'ongoing', label: 'En curso' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  // Cargar eventos
  const loadEventos = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await eventosService.getAll({
        page,
        limit: itemsPerPage
      });
      
      console.log('Respuesta completa de eventos:', response);
      console.log('Datos de eventos:', response.data);
      
      if (response.success) {
        setEventos(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages);
          setTotalItems(response.pagination.total);
          setCurrentPage(response.pagination.page);
        }
      } else {
        setError(response.message || 'Error al cargar eventos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generar slug automáticamente
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Evitar guiones múltiples
      .trim('-'); // Remover guiones al inicio y final
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Generar slug automáticamente cuando cambia el título
      if (name === 'title') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'taller',
      date: '',
      time: '',
      location: '',
      duration: '',
      capacity: '',
      registrationUrl: '',
      slug: '',
      organizer: '',
      status: 'upcoming',
      image: '',
      requirements: ''
    });
  };

  // Abrir modal para crear
  const handleCreate = () => {
    if (!canCreateContent) {
      setError('No tienes permisos para crear eventos');
      return;
    }
    resetForm();
    setModalMode('create');
    setSelectedItem(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (item) => {
    if (!canEditContent) {
      setError('No tienes permisos para editar eventos');
      return;
    }
    console.log('Item original para editar:', item);
    
    // Mapear los datos del item a los campos correctos, ignorando campos del esquema anterior
    const mappedData = {
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'taller',
      // Usar 'date' si existe, sino 'startDate' (por compatibilidad), sino vacío
      date: item.date ? new Date(item.date).toISOString().slice(0, 16) : 
            item.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : '',
      time: item.time || '',
      location: item.location || '',
      duration: item.duration || '',
      capacity: item.capacity?.toString() || '',
      registrationUrl: item.registrationUrl || '',
      slug: item.slug || '',
      organizer: item.organizer || '',
      status: item.status || 'upcoming',
      image: item.image || item.imageUrl || '', // Compatibilidad con imageUrl
      requirements: item.requirements || ''
    };

    console.log('Datos mapeados para formulario:', mappedData);
    
    setFormData(mappedData);
    setModalMode('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  // Abrir modal para ver
  const handleView = (item) => {
    setSelectedItem(item);
    setModalMode('view');
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    resetForm();
  };

  // Función para limpiar datos y asegurar que solo se envíen campos válidos
  const cleanEventData = (data) => {
    const validFields = [
      'title', 'description', 'type', 'date', 'time', 'location', 
      'duration', 'capacity', 'registrationUrl', 'slug', 
      'organizer', 'status', 'image', 'requirements'
    ];
    
    const cleanData = {};
    validFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== '') {
        cleanData[field] = data[field];
      }
    });
    
    return cleanData;
  };

  // Guardar (crear o actualizar)
  const handleSave = async () => {
    // Validar permisos según el modo del modal
    if (modalMode === 'create' && !canCreateContent) {
      setError('No tienes permisos para crear eventos');
      return;
    }
    if (modalMode === 'edit' && !canEditContent) {
      setError('No tienes permisos para editar eventos');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Preparar datos para envío
      const rawData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        time: formData.time,
        location: formData.location,
        duration: formData.duration,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        registrationUrl: formData.registrationUrl,
        slug: formData.slug,
        organizer: formData.organizer,
        status: formData.status,
        image: formData.image,
        requirements: formData.requirements
      };

      // Limpiar datos para asegurar que solo se envíen campos válidos
      const dataToSend = cleanEventData(rawData);

      console.log('Datos raw:', rawData);
      console.log('Datos limpiados:', dataToSend);
      console.log('Modo:', modalMode);
      if (selectedItem) {
        console.log('Item seleccionado:', selectedItem);
      }

      let response;
      if (modalMode === 'create') {
        response = await eventosService.create(dataToSend);
      } else {
        response = await eventosService.update(selectedItem.id, dataToSend);
      }

      if (response.success) {
        handleCloseModal();
        loadEventos(currentPage);
      } else {
        setError(response.message || 'Error al guardar evento');
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al conectar con el servidor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (item) => {
    if (!canDeleteContent) {
      setError('No tienes permisos para eliminar eventos');
      return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await eventosService.delete(item.id);
      if (response.success) {
        loadEventos(currentPage);
      } else {
        setError(response.message || 'Error al eliminar evento');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    loadEventos();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Eventos</h1>
          <p className="text-gray-300">Administra talleres, capacitaciones, foros y debates</p>
        </div>
        {canCreateContent && (
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Nuevo Evento
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={eventos}
          loading={loading}
          onView={handleView}
          onEdit={canEditContent ? handleEdit : undefined}
          onDelete={canDeleteContent ? handleDelete : undefined}
          emptyMessage="No hay eventos disponibles"
        />
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => loadEventos(page)}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          modalMode === 'create' ? 'Nuevo Evento' :
          modalMode === 'edit' ? 'Editar Evento' : 'Detalles del Evento'
        }
        size="large"
      >
        {modalMode === 'view' ? (
          /* Vista de solo lectura */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
                <p className="text-gray-300">{selectedItem?.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
                <p className="text-gray-300">{eventTypeOptions.find(t => t.value === selectedItem?.type)?.label}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fecha y Hora</label>
                <p className="text-gray-300">
                  {selectedItem?.date ? 
                    (() => {
                      try {
                        const date = new Date(selectedItem.date);
                        return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleString('es-ES');
                      } catch (error) {
                        return 'Error en fecha';
                      }
                    })() 
                    : 'Sin fecha asignada'
                  }
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Hora (texto adicional)</label>
                <p className="text-gray-300">{selectedItem?.time || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ubicación</label>
                <p className="text-gray-300">{selectedItem?.location || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Duración</label>
                <p className="text-gray-300">{selectedItem?.duration || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Capacidad</label>
                <p className="text-gray-300">{selectedItem?.capacity || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Estado</label>
                <p className="text-gray-300">{statusOptions.find(s => s.value === selectedItem?.status)?.label}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Organizador</label>
                <p className="text-gray-300">{selectedItem?.organizer || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">URL de Registro</label>
                <p className="text-gray-300">{selectedItem?.registrationUrl || '-'}</p>
              </div>
            </div>
            {selectedItem?.description && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                <p className="text-gray-300">{selectedItem.description}</p>
              </div>
            )}
            {selectedItem?.requirements && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Requisitos</label>
                <p className="text-gray-300">{selectedItem.requirements}</p>
              </div>
            )}
          </div>
        ) : (
          /* Formulario */
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Título *"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Título del evento"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tipo *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {eventTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  label="Fecha y hora"
                  name="date"
                  type="datetime-local"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Input
                  label="Hora (texto adicional)"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="ej: 10:00 AM"
                />
              </div>
              <div>
                <Input
                  label="Ubicación"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Lugar del evento"
                />
              </div>
              <div>
                <Input
                  label="Duración"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="ej: 3 horas"
                />
              </div>
              <div>
                <Input
                  label="Capacidad"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="Número máximo de participantes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Estado *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  label="Organizador"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleInputChange}
                  placeholder="Nombre del organizador"
                />
              </div>
              <div>
                <Input
                  label="URL de Registro"
                  name="registrationUrl"
                  type="url"
                  value={formData.registrationUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Input
                  label="Slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="url-amigable"
                />
              </div>
              <div>
                <Input
                  label="Imagen"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="URL de la imagen"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del evento"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Requisitos
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Requisitos para participar"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                onClick={handleCloseModal}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {modalMode === 'create' ? 'Crear Evento' : 'Actualizar Evento'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};