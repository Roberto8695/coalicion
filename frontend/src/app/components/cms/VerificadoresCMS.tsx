"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconSearch,
  IconFilter,
  IconExternalLink,
  IconShield,
  IconRobot,
  IconCode,
  IconTool,
  IconWorld
} from '@tabler/icons-react';
import { verificadoresService, uploadsService } from '@/api/services';
import type { Verificador } from '@/api/services';
import { Pagination } from './Pagination';

interface VerificadoresCMSProps {
  onClose?: () => void;
}

export function VerificadoresCMS({ onClose }: VerificadoresCMSProps) {
  const [verificadores, setVerificadores] = useState<Verificador[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState<Partial<Verificador>>({
    name: '',
    description: '',
    type: 'website',
    url: '',
    logo: '',
    features: [],
    isactive: true
  });
  
  // Estados para upload de logo
  const [logoPreview, setLogoPreview] = useState('');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Cargar verificadores con paginación
  const loadVerificadores = async () => {
    try {
      setLoading(true);
      const response = await verificadoresService.getAll({
        page: currentPage,
        limit: itemsPerPage
      });
      setVerificadores(response.data || []);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
        setTotalItems(response.pagination.total || 0);
      }
    } catch (error) {
      console.error('Error cargando verificadores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerificadores();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtrar verificadores
  const filteredVerificadores = verificadores.filter(verificador => {
    const matchesSearch = verificador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (verificador.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesType = typeFilter === 'all' || verificador.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && (verificador.isActive ?? verificador.isactive)) ||
                         (statusFilter === 'inactive' && !(verificador.isActive ?? verificador.isactive));
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let logoUrl = formData.logo;
      
      // Si hay un archivo seleccionado, subirlo primero
      if (selectedLogo) {
        setUploadingLogo(true);
        const uploadResponse = await uploadsService.uploadFile(selectedLogo, 'logos');
        if (uploadResponse.success) {
          logoUrl = uploadResponse.data.url;
        }
        setUploadingLogo(false);
      }
      
      const dataToSubmit = {
        ...formData,
        logo: logoUrl,
        features: Array.isArray(formData.features) ? formData.features : 
                 typeof formData.features === 'string' ? (formData.features as string).split(',').map((f: string) => f.trim()) : [],
        // Usar isactive en minúsculas para coincidir con la base de datos
        isactive: formData.isactive !== undefined ? formData.isactive : true
      };

      // Remover el id de los datos a actualizar para evitar conflictos
      if (editingId && dataToSubmit.id) {
        delete dataToSubmit.id;
      }

      console.log('Datos a enviar:', dataToSubmit);

      if (editingId) {
        await verificadoresService.update(editingId, dataToSubmit);
      } else {
        await verificadoresService.create(dataToSubmit);
        // Si estamos creando un nuevo elemento, ir a la primera página
        setCurrentPage(1);
      }

      await loadVerificadores();
      resetForm();
    } catch (error) {
      console.error('Error guardando verificador:', error);
      alert('Error al guardar el verificador. Por favor, inténtalo de nuevo.');
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'website',
      url: '',
      logo: '',
      features: [],
      isactive: true
    });
    setEditingId(null);
    setShowForm(false);
    setLogoPreview('');
    setSelectedLogo(null);
    setIsDragOver(false);
    setUploadingLogo(false);
  };

  // Editar verificador
  const handleEdit = (verificador: Verificador) => {
    setFormData({
      ...verificador,
      features: verificador.features || [],
      isactive: verificador.isActive ?? verificador.isactive
    });
    
    // Si hay logo, mostrarlo como preview
    if (verificador.logo) {
      setLogoPreview(verificador.logo);
    }
    
    setEditingId(verificador.id || null);
    setShowForm(true);
  };

  // Eliminar verificador
  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este verificador?')) {
      try {
        await verificadoresService.delete(id);
        // Si estamos en una página que se vacía, ir a la página anterior
        const remainingItems = totalItems - 1;
        const maxPage = Math.ceil(remainingItems / itemsPerPage) || 1;
        if (currentPage > maxPage) {
          setCurrentPage(maxPage);
        } else {
          await loadVerificadores();
        }
      } catch (error) {
        console.error('Error eliminando verificador:', error);
      }
    }
  };

  // Manejar selección de archivo de logo
  const handleLogoChange = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona solo archivos de imagen');
    }
  };

  // Manejar drag & drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleLogoChange(file);
    }
  };

  // Limpiar logo
  const clearLogo = () => {
    setLogoPreview('');
    setSelectedLogo(null);
    setFormData(prev => ({ ...prev, logo: '' }));
  };

  // Obtener icono por tipo
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return <IconWorld className="w-4 h-4" />;
      case 'bot': return <IconRobot className="w-4 h-4" />;
      case 'api': return <IconCode className="w-4 h-4" />;
      case 'tool': return <IconTool className="w-4 h-4" />;
      default: return <IconShield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gray-800">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135] mx-auto mb-4"></div>
            <p className="text-gray-300">Cargando verificadores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-800">
      <div className="p-8">
        {/* Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Gestión de Verificadores
              </h1>
              <p className="text-gray-300">
                Administra las herramientas de verificación de hechos
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <IconPlus className="w-5 h-5" />
                Nuevo Verificador
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <IconSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar verificadores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              />
            </div>

            {/* Filtro por tipo */}
            <div className="relative">
              <IconFilter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent appearance-none"
              >
                <option value="all">Todos los tipos</option>
                <option value="website">Sitios Web</option>
                <option value="bot">Bots</option>
                <option value="api">APIs</option>
                <option value="tool">Herramientas</option>
              </select>
            </div>

            {/* Filtro por estado */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de verificadores en tabla */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
          {filteredVerificadores.length === 0 ? (
            <div className="text-center py-12">
              <IconShield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No se encontraron verificadores</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Logo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Características
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredVerificadores.map((verificador, index) => (
                    <tr 
                      key={verificador.id} 
                      className={`hover:bg-gray-700/30 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'
                      }`}
                    >
                      {/* Logo */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
                          {verificador.logo ? (
                            <Image
                              src={verificador.logo}
                              alt={verificador.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <IconShield className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Nombre */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white max-w-xs">
                          <div className="truncate" title={verificador.name}>
                            {verificador.name}
                          </div>
                          <div className="mt-1">
                            <a
                              href={verificador.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#CBA135] hover:text-[#E5B935] text-xs flex items-center gap-1"
                            >
                              <IconExternalLink className="w-3 h-3" />
                              Visitar
                            </a>
                          </div>
                        </div>
                      </td>

                      {/* Descripción */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300 max-w-md">
                          <div className="line-clamp-2" title={verificador.description}>
                            {verificador.description}
                          </div>
                        </div>
                      </td>

                      {/* Tipo */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200 border border-gray-500 w-fit">
                          {getTypeIcon(verificador.type)}
                          <span className="capitalize">{verificador.type}</span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            (verificador.isActive ?? verificador.isactive) ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            (verificador.isActive ?? verificador.isactive) ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {(verificador.isActive ?? verificador.isactive) ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </td>

                      {/* Características */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          {verificador.features && verificador.features.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {verificador.features.slice(0, 2).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                              {verificador.features.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{verificador.features.length - 2} más
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Sin características</span>
                          )}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(verificador)}
                            className="p-2 bg-[#CBA135] hover:bg-[#E5B935] text-white rounded-lg transition-colors"
                            title="Editar verificador"
                          >
                            <IconEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => verificador.id && handleDelete(verificador.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            title="Eliminar verificador"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal del formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingId ? 'Editar Verificador' : 'Nuevo Verificador'}
                  </h2>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      placeholder="Nombre del verificador"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      placeholder="Descripción del verificador"
                    />
                  </div>

                  {/* Tipo y URL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo *
                      </label>
                      <select
                        required
                        value={formData.type || 'website'}
                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'website' | 'bot' | 'api' | 'tool' }))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      >
                        <option value="website">Sitio Web</option>
                        <option value="bot">Bot</option>
                        <option value="api">API</option>
                        <option value="tool">Herramienta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                        placeholder="https://ejemplo.com"
                      />
                    </div>
                  </div>

                  {/* Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Logo
                    </label>
                    
                    {/* Campo de URL */}
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="URL del logo"
                        value={formData.logo || ''}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, logo: e.target.value }));
                          if (e.target.value) {
                            setLogoPreview(e.target.value);
                            setSelectedLogo(null);
                          }
                        }}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      />
                    </div>
                    
                    {/* Zona de drag & drop */}
                    <div 
                      className={`relative border-2 border-dashed rounded-xl p-6 transition-colors duration-200 ${
                        isDragOver 
                          ? 'border-[#CBA135] bg-[#CBA135]/10' 
                          : 'border-gray-600 hover:border-[#CBA135]'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleLogoChange(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      {logoPreview ? (
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <Image
                              src={logoPreview}
                              alt="Preview"
                              width={120}
                              height={120}
                              className="rounded-xl object-contain bg-gray-700 p-2"
                            />
                            <button
                              type="button"
                              onClick={clearLogo}
                              className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <svg className={`mx-auto h-12 w-12 transition-colors duration-200 ${
                            isDragOver ? 'text-[#CBA135]' : 'text-gray-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <div className="mt-4">
                            <p className={`text-sm font-medium transition-colors duration-200 ${
                              isDragOver ? 'text-[#CBA135]' : 'text-white'
                            }`}>
                              {isDragOver ? 'Suelta el logo aquí' : 'Arrastra un logo aquí'}
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              o haz clic para seleccionar
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              PNG, JPG hasta 10MB
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {uploadingLogo && (
                        <div className="absolute inset-0 bg-gray-800/80 flex items-center justify-center rounded-xl">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CBA135] mx-auto mb-2"></div>
                            <p className="text-sm text-gray-300">Subiendo logo...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Características */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Características (separadas por comas)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value.split(',').map(f => f.trim()).filter(f => f) }))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      placeholder="Ej: Verificación en tiempo real, Base de datos, Reportes semanales"
                    />
                  </div>

                  {/* Estado activo */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isactive || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, isactive: e.target.checked }))}
                      className="w-4 h-4 text-[#CBA135] bg-gray-700 border-gray-600 rounded focus:ring-[#CBA135] focus:ring-2"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-300">
                      Verificador activo
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    disabled={uploadingLogo}
                    className="flex-1 bg-[#CBA135] hover:bg-[#E5B935] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center"
                  >
                    {uploadingLogo ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Subiendo...
                      </>
                    ) : (
                      `${editingId ? 'Actualizar' : 'Crear'} Verificador`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded-xl transition-colors font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Componente de Paginación */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}