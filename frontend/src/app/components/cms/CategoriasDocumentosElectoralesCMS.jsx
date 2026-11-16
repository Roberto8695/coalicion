'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { Table } from './Table';
import { categoriasDocumentosElectoralesService } from '@/api';
import { useDashboardFeedback } from '@/app/dashboard/components/DashboardFeedback';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  color: '#3B82F6',
  is_active: true
};

const CategoriasDocumentosElectoralesCMS = () => {
  const { confirmAction, notify } = useDashboardFeedback();
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const response = await categoriasDocumentosElectoralesService.getAll({ limit: 100 });
      if (response.success) setCategorias(response.data);
    } catch (err) {
      setError(`Error al cargar categorías: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  const slugify = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const openCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      slug: item.slug || '',
      description: item.description || '',
      color: item.color || '#3B82F6',
      is_active: item.is_active !== false
    });
    setShowModal(true);
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && modalMode === 'create' ? { slug: slugify(value) } : {})
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = modalMode === 'create'
        ? await categoriasDocumentosElectoralesService.create(formData)
        : await categoriasDocumentosElectoralesService.update(selectedItem.id, formData);
      if (!response.success) throw new Error(response.message || 'No se pudo guardar la categoría');

      notify({
        title: modalMode === 'create' ? 'Categoría añadida' : 'Categoría actualizada',
        message: 'Los cambios se guardaron correctamente.'
      });
      setShowModal(false);
      await loadCategorias();
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!await confirmAction({
      title: 'Eliminar categoría',
      message: `¿Deseas eliminar "${item.name}"? Esta acción no se puede deshacer.`
    })) return;

    try {
      setLoading(true);
      const response = await categoriasDocumentosElectoralesService.delete(item.id);
      if (!response.success) throw new Error(response.message || 'No se pudo eliminar la categoría');
      notify({ title: 'Categoría eliminada', message: 'La categoría se eliminó correctamente.' });
      await loadCategorias();
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    {
      key: 'name',
      header: 'Nombre',
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 rounded-full" style={{ backgroundColor: row.color }} />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'slug', header: 'Slug' },
    { key: 'description', header: 'Descripción', render: (value) => value || '-' },
    {
      key: 'is_active',
      header: 'Estado',
      render: (value) => (
        <span className={`rounded-full px-2 py-1 text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ];

  return (
    <div className="min-h-full min-w-0 bg-gray-800 p-4 lg:p-6">
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-700 bg-gray-800/50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Categorías de documentos electorales</h1>
          <p className="text-gray-300">Administra las categorías exclusivas del repositorio electoral.</p>
        </div>
        <Button onClick={openCreate} className="bg-[#CBA135] text-white">Nueva categoría</Button>
      </div>

      {error && <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      <div className="rounded-xl border border-gray-700 bg-gray-800/50">
        <Table data={categorias} columns={columns} loading={loading} onEdit={openEdit} onDelete={handleDelete} emptyMessage="No hay categorías disponibles" />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Nueva categoría' : 'Editar categoría'}
        onConfirm={handleSubmit}
        onCancel={() => setShowModal(false)}
        confirmText={modalMode === 'create' ? 'Crear' : 'Actualizar'}
        isLoading={loading}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Manual" />
          <Input label="Slug" name="slug" value={formData.slug} onChange={handleChange} required placeholder="ej. manual" />
          <Input label="Descripción" name="description" type="textarea" value={formData.description} onChange={handleChange} placeholder="Descripción opcional" />
          <Input label="Color" name="color" type="color" value={formData.color} onChange={handleChange} />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            Categoría activa
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default CategoriasDocumentosElectoralesCMS;
