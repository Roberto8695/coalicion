'use client';

import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { Table } from './Table';
import { tiposNoticiaService } from '@/api';
import { useDashboardFeedback } from '@/app/dashboard/components/DashboardFeedback';

const initialForm = { name: '', slug: '', color: '#3B82F6', is_active: true };

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const TiposNoticiaCMS = ({
  service = tiposNoticiaService,
  title = 'Tipos de noticias',
  description = 'Administra los tipos disponibles para las noticias.',
  singularLabel = 'tipo de noticia'
}) => {
  const { confirmAction, notify } = useDashboardFeedback();
  const [tipos, setTipos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTipos = async () => {
    try {
      setLoading(true);
      const response = await service.getAll({ limit: 100 });
      if (response.success) setTipos(response.data);
    } catch (err) {
      setError(`Error al cargar tipos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTipos(); }, []);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'name' && !selectedItem ? { slug: slugify(value) } : {})
    }));
  };

  const openCreate = () => {
    setSelectedItem(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      slug: item.slug || '',
      color: item.color || '#3B82F6',
      is_active: item.is_active !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = selectedItem
        ? await service.update(selectedItem.id, formData)
        : await service.create(formData);
      if (!response.success) throw new Error(response.message || 'No se pudo guardar el tipo');
      setShowModal(false);
      notify({ title: selectedItem ? 'Tipo actualizado' : 'Tipo añadido', message: 'Los cambios se guardaron correctamente.' });
      await loadTipos();
    } catch (err) {
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!await confirmAction({ title: 'Eliminar tipo', message: `¿Deseas eliminar "${item.name}"?` })) return;
    try {
      setLoading(true);
      const response = await service.delete(item.id);
      if (!response.success) throw new Error(response.message || 'No se pudo eliminar el tipo');
      await loadTipos();
    } catch (err) {
      setError(`Error al eliminar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nombre', render: (value, row) => <div className="flex items-center gap-3"><span className="h-4 w-4 rounded-full" style={{ backgroundColor: row.color }} />{value}</div> },
    { key: 'slug', header: 'Slug' },
    { key: 'is_active', header: 'Estado', render: (value) => <span className={`rounded-full px-2 py-1 text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{value ? 'Activo' : 'Inactivo'}</span> }
  ];

  return (
    <div className="min-h-full min-w-0 bg-gray-800 p-4 lg:p-6">
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-700 bg-gray-800/50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white lg:text-3xl">{title}</h1>
          <p className="text-gray-300">{description}</p>
        </div>
        <Button onClick={openCreate} className="bg-[#CBA135] text-white">Nuevo tipo</Button>
      </div>
      {error && <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50">
        <Table data={tipos} columns={columns} loading={loading} onEdit={openEdit} onDelete={handleDelete} emptyMessage="No hay tipos disponibles" />
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedItem ? `Editar ${singularLabel}` : `Nuevo ${singularLabel}`} onConfirm={handleSubmit} onCancel={() => setShowModal(false)} confirmText={selectedItem ? 'Actualizar' : 'Crear'} isLoading={loading}>
        <div className="space-y-4">
          <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} required placeholder="Ej. Entrevista" />
          <Input label="Slug" name="slug" value={formData.slug} onChange={handleChange} required placeholder="ej. entrevista" />
          <Input label="Color" name="color" type="color" value={formData.color} onChange={handleChange} />
          <label className="flex items-center gap-2 text-sm text-gray-300"><input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} /> Tipo activo</label>
        </div>
      </Modal>
    </div>
  );
};

export default TiposNoticiaCMS;
