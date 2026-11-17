'use client';

import { useState } from 'react';
import { Input } from './Input';
import { Modal } from './Modal';
import { usePermissions } from '@/hooks/useAuth';
import { useDashboardFeedback } from '@/app/dashboard/components/DashboardFeedback';

const slugify = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

export const QuickAddSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  service,
  initialForm,
  createPayload = (form) => form,
  getOption = (item) => ({ value: item.id, label: item.name }),
  onCreated
}) => {
  const { canManageCategories } = usePermissions();
  const { notify } = useDashboardFeedback();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name: fieldName, value: fieldValue } = event.target;
    setFormData((current) => ({
      ...current,
      [fieldName]: fieldValue,
      ...(fieldName === 'name' ? { slug: slugify(fieldValue) } : {})
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await service.create(createPayload(formData));
      if (!response.success) {
        throw new Error(response.message || 'No se pudo crear la opción');
      }

      const created = response.data;
      onCreated(created);
      setShowModal(false);
      setFormData(initialForm);
      notify({
        title: 'Opción añadida',
        message: 'La nueva opción ya está disponible en este formulario.'
      });
    } catch (err) {
      setError(`Error al crear: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">{label}</label>
      <div className="flex items-start gap-2">
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-gray-700 text-white">
              {option.label}
            </option>
          ))}
        </select>
        {canManageCategories && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="shrink-0 rounded-md border border-[#CBA135] px-3 py-2 text-sm font-semibold text-[#CBA135] transition-colors hover:bg-[#CBA135] hover:text-white"
          >
            + Añadir
          </button>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Añadir ${label.toLowerCase()}`}
        onConfirm={handleSubmit}
        onCancel={() => setShowModal(false)}
        confirmText="Añadir"
        isLoading={loading}
      >
        <div className="space-y-4">
          <Input
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Ej. Informe especial"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </Modal>
    </div>
  );
};
