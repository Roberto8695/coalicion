'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';
import { Input } from './Input';
import { Table } from './Table';
import { Pagination } from './Pagination';
import { categoriasService } from '@/api';

export const CategoriasCMS = () => {
  // Estados principales
  const [categorias, setCategorias] = useState([]);
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
    icon: '',
    color: '#3B82F6',
    slug: '',
    isActive: true
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
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          {row.color && (
            <div 
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: row.color }}
            />
          )}
          <span className="font-medium text-gray-300">{value}</span>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Descripción',
      render: (value) => (
        <div className="max-w-xs truncate text-gray-300">
          {value || '-'}
        </div>
      )
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-600 px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'isactive',
      header: 'Estado',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  // Cargar datos
  useEffect(() => {
    loadCategorias();
  }, [currentPage]);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriasService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      
      if (response.success) {
        setCategorias(response.data);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      }
    } catch (err) {
      setError('Error al cargar categorías: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Generar slug automáticamente
  const generateSlug = (name) => {
    return name
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
      
      // Auto-generar slug cuando cambia el nombre
      if (name === 'name' && modalMode === 'create') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      let response;
      if (modalMode === 'create') {
        response = await categoriasService.create(formData);
      } else {
        response = await categoriasService.update(selectedItem.id, formData);
      }

      if (response.success) {
        setShowModal(false);
        resetForm();
        loadCategorias();
      }
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      try {
        setLoading(true);
        const response = await categoriasService.delete(item.id);
        if (response.success) {
          loadCategorias();
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
      icon: item.icon || '',
      color: item.color || '#3B82F6',
      slug: item.slug || '',
      isActive: item.isactive !== undefined ? item.isactive : true
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
      icon: '',
      color: '#3B82F6',
      slug: '',
      isActive: true
    });
    setSelectedItem(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
    setError('');
  };

  // Colores predefinidos
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las categorías del sistema
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Categoría
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
        data={categorias}
        columns={columns}
        loading={loading}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onView={openViewModal}
        emptyMessage="No hay categorías disponibles"
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
          modalMode === 'create' ? 'Nueva Categoría' :
          modalMode === 'edit' ? 'Editar Categoría' :
          'Ver Categoría'
        }
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
                <label className="block text-sm font-medium text-gray-300">Nombre</label>
                <div className="flex items-center space-x-3 mt-1">
                  {selectedItem?.color && (
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-600"
                      style={{ backgroundColor: selectedItem.color }}
                    />
                  )}
                  <p className="text-sm text-gray-100">{selectedItem?.name}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Slug</label>
                <p className="mt-1 text-sm text-gray-100 font-mono bg-gray-700 px-2 py-1 rounded border border-gray-600">
                  {selectedItem?.slug}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Color</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-600"
                    style={{ backgroundColor: selectedItem?.color }}
                  />
                  <p className="text-sm text-gray-100 font-mono">{selectedItem?.color}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Estado</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  selectedItem?.isactive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedItem?.isactive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Descripción</label>
              <p className="mt-1 text-sm text-gray-100">{selectedItem?.description || '-'}</p>
            </div>
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
                placeholder="Nombre de la categoría"
              />
              <Input
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                placeholder="url-amigable"
                helperText="URL amigable para la categoría"
              />
            </div>

            <Input
              label="Descripción"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción de la categoría"
            />

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-3">
                Color
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
                        formData.color === color 
                          ? 'border-blue-400 ring-2 ring-blue-400 ring-opacity-50 scale-110' 
                          : 'border-gray-500 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    name="color"
                    type="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-12 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer"
                    title="Selector de color personalizado"
                  />
                  <span className="text-xs text-gray-400 font-mono">
                    {formData.color}
                  </span>
                </div>
              </div>
            </div>

            <Input
              label="Icono"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              placeholder="nombre-del-icono"
              helperText="Nombre del icono (opcional)"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 focus:ring-offset-gray-800 border-gray-600 bg-gray-700 rounded"
              />
              <label className="ml-2 block text-sm text-gray-300">
                Categoría activa
              </label>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};