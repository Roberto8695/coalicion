'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { Table } from './Table';
import { tiposPublicacionService } from '@/api';
import { useDashboardFeedback } from '@/app/dashboard/components/DashboardFeedback';

const initialForm = {
  name: '',
  slug: '',
  color: '#3B82F6',
  is_active: true
};

const TiposPublicacionCMS = () => {
  const { confirmAction, notify } = useDashboardFeedback();
  const [tipos, setTipos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTipos = async () => {
    try {
      setLoading(true);
      const response = await tiposPublicacionService.getAll({ limit: 100 });
      if (response.success) setTipos(response.data);
    } catch (err) {
      setError(`Error al cargar tipos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTipos();
  }, []);

  const generateSlug = (value) => value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const openCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      slug: item.slug || '',
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
      ...(name === 'name' && modalMode === 'create' ? { slug: generateSlug(value) } : {})
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = modalMode === 'create'
        ? await tiposPublicacionService.create(formData)
        : await tiposPublicacionService.update(selectedItem.id, formData);

      if (!response.success) {
        throw new Error(response.message || 'No se pudo guardar el tipo');
      }

      notify({
        title: modalMode === 'create' ? 'Tipo añadido' : 'Tipo actualizado',
        message: 'Los cambios se guardaron correctamente.'
      });
      setShowModal(false);
      await loadTipos();
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!await confirmAction({
      title: 'Eliminar tipo',
      message: `¿Deseas eliminar "${item.name}"? Esta acción no se puede deshacer.`
    })) return;

    try {
      setLoading(true);
      const response = await tiposPublicacionService.delete(item.id);
      if (!response.success) throw new Error(response.message || 'No se pudo eliminar el tipo');
      notify({ title: 'Tipo eliminado', message: 'El tipo se eliminó correctamente.' });
      await loadTipos();
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
          <h1 className="text-2xl font-bold text-white lg:text-3xl">Tipos de publicaciones</h1>
          <p className="text-gray-300">Administra los tipos disponibles para las publicaciones.</p>
        </div>
        <Button onClick={openCreate} className="bg-[#CBA135] text-white">Nuevo tipo</Button>
      </div>

      {error && <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      <div className="rounded-xl border border-gray-700 bg-gray-800/50">
        <Table data={tipos} columns={columns} loading={loading} onEdit={openEdit} onDelete={handleDelete} emptyMessage="No hay tipos disponibles" />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Nuevo tipo de publicación' : 'Editar tipo de publicación'}
        onConfirm={handleSubmit}
        onCancel={() => setShowModal(false)}
        confirmText={modalMode === 'create' ? 'Crear' : 'Actualizar'}
        isLoading={loading}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Informe" />
          <Input label="Slug" name="slug" value={formData.slug} onChange={handleChange} required placeholder="ej. informe" />
          <Input label="Color" name="color" type="color" value={formData.color} onChange={handleChange} />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
            Tipo activo
          </label>
        </form>
      </Modal>
    </div>
  );
};

export default TiposPublicacionCMS;
