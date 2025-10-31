'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { noticiasService, categoriasService } from '@/api';

export const NoticiasCMS = () => {
  // Estados principales
  const [noticias, setNoticias] = useState([]);
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
    date: '',
    location: '',
    organizer: '',
    participants: '',
    url: '',
    status: 'upcoming',
    featured: false,
    image: '',
    slug: '',
    duration: '',
    registrationurl: ''
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
          actividad: 'bg-blue-100 text-blue-800',
          taller: 'bg-green-100 text-green-800',
          comunicado: 'bg-purple-100 text-purple-800',
          evento: 'bg-orange-100 text-orange-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
    {
      key: 'organizer',
      header: 'Organizador',
      render: (value) => value || '-'
    },
    {
      key: 'date',
      header: 'Fecha',
      render: (value) => value ? new Date(value).toLocaleDateString() : '-'
    },
    {
      key: 'location',
      header: 'Ubicación',
      render: (value) => value || '-'
    },
    {
      key: 'status',
      header: 'Estado',
      render: (value) => {
        const statusColors = {
          upcoming: 'bg-blue-100 text-blue-800',
          ongoing: 'bg-green-100 text-green-800',
          completed: 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[value] || 'bg-gray-100 text-gray-800'}`}>
            {value === 'upcoming' ? 'Próximo' : value === 'ongoing' ? 'En curso' : value === 'completed' ? 'Completado' : value || 'upcoming'}
          </span>
        );
      }
    },
    {
      key: 'featured',
      header: 'Destacada',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Sí' : 'No'}
        </span>
      )
    }
  ];

  // Opciones para selects
  const statusOptions = [
    { value: 'upcoming', label: 'Próximo' },
    { value: 'ongoing', label: 'En curso' },
    { value: 'completed', label: 'Completado' }
  ];

  const typeOptions = [
    { value: 'actividad', label: 'Actividad' },
    { value: 'taller', label: 'Taller' },
    { value: 'comunicado', label: 'Comunicado' },
    { value: 'evento', label: 'Evento' }
  ];

  // Cargar datos
  useEffect(() => {
    loadNoticias();
    loadCategorias();
  }, [currentPage]);

  const loadNoticias = async () => {
    try {
      setLoading(true);
      const response = await noticiasService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setNoticias(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar noticias: ' + err.message);
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

  // Generar slug automáticamente
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Manejar formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Auto-generar slug cuando cambia el título
      if (name === 'title' && modalMode === 'create') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Preparar los datos según el esquema de la base de datos
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        date: formData.date || null,
        location: formData.location || null,
        organizer: formData.organizer || null,
        participants: formData.participants ? parseInt(formData.participants) : null,
        url: formData.url || null,
        status: formData.status || 'upcoming',
        featured: formData.featured || false,
        image: formData.image || null,
        slug: formData.slug,
        duration: formData.duration || null,
        registrationurl: formData.registrationurl || null
      };

      console.log('Datos a enviar:', dataToSend);

      let response;
      if (modalMode === 'create') {
        response = await noticiasService.create(dataToSend);
      } else {
        response = await noticiasService.update(selectedItem.id, dataToSend);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadNoticias();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        setLoading(true);
        const response = await noticiasService.delete(item.id);
        if (response.success) {
          loadNoticias();
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
      date: item.date ? item.date.split('T')[0] : '',
      location: item.location || '',
      organizer: item.organizer || '',
      participants: item.participants || '',
      url: item.url || '',
      status: item.status || 'upcoming',
      featured: item.featured || false,
      image: item.image || '',
      slug: item.slug || '',
      duration: item.duration || '',
      registrationurl: item.registrationurl || ''
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
      date: '',
      location: '',
      organizer: '',
      participants: '',
      url: '',
      status: 'upcoming',
      featured: false,
      image: '',
      slug: '',
      duration: '',
      registrationurl: ''
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Noticias</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las noticias del sistema
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Evento/Actividad
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
        data={noticias}
        columns={columns}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onView={openViewModal}
        emptyMessage="No hay noticias disponibles"
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
          modalMode === 'create' ? 'Nuevo Evento/Actividad' :
          modalMode === 'edit' ? 'Editar Evento/Actividad' :
          'Ver Evento/Actividad'
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
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.type || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Organizador</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.organizer || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Fecha</label>
                <p className="mt-1 text-sm text-gray-300">
                  {selectedItem?.date ? new Date(selectedItem.date).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Ubicación</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.location || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Estado</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.status || 'draft'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Duración</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.duration || '-'}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400">Participantes</label>
                <p className="mt-1 text-sm text-gray-300">{selectedItem?.participants || '-'}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400">Descripción</label>
              <p className="mt-1 text-sm text-gray-300">{selectedItem?.description || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400">URL de Registro</label>
              <p className="mt-1 text-sm text-gray-300">
                {selectedItem?.registrationurl ? (
                  <a href={selectedItem.registrationurl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    {selectedItem.registrationurl}
                  </a>
                ) : '-'}
              </p>
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
                placeholder="Título del evento/actividad"
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
                label="Organizador"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                placeholder="Nombre del organizador"
              />
              <Input
                label="Fecha"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
              />
              <Input
                label="Ubicación"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Lugar del evento"
              />
              <Input
                label="Duración"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Ej: 2 horas, 1 día"
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
                label="Participantes"
                name="participants"
                type="number"
                value={formData.participants}
                onChange={handleInputChange}
                placeholder="Número de participantes"
                min="0"
              />
              <Input
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="url-amigable"
                helperText="URL amigable para el evento"
              />
            </div>

            <Input
              label="Descripción"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción del evento o actividad"
            />

            <Input
              label="URL de Registro"
              name="registrationurl"
              value={formData.registrationurl}
              onChange={handleInputChange}
              placeholder="https://..."
              helperText="URL para registro al evento"
            />

            <Input
              label="URL de Imagen"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://..."
            />

            <Input
              label="URL del Evento"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              placeholder="https://..."
              helperText="URL principal del evento"
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
                Evento destacado
              </label>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};