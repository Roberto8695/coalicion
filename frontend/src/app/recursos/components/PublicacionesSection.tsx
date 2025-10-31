"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconDownload, IconEye, IconCalendar, IconTag, IconFileText } from "@tabler/icons-react";
import { publicacionesService } from "@/api";

interface Publicacion {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  date?: string;
  author?: string;
  pages?: number;
  downloadUrl?: string;
  previewUrl?: string;
  tags?: string[];
  featured?: boolean;
  fileSize?: number;
  fileFormat?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "informe": return "from-blue-600 to-blue-700";
    case "estudio": return "from-green-600 to-green-700";
    case "monitoreo": return "from-purple-600 to-purple-700";
    case "investigacion": return "from-orange-600 to-orange-700";
    default: return "from-gray-600 to-gray-700";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "informe": return "Informe";
    case "estudio": return "Estudio";
    case "monitoreo": return "Monitoreo";
    case "investigacion": return "Investigación";
    default: return "Documento";
  }
};

// Helper function to extract text from description

export function PublicacionesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load publicaciones from local API
  useEffect(() => {
    async function fetchPublicaciones() {
      try {
        setLoading(true);
        const response = await publicacionesService.getAll();
        setPublicaciones(response.data);
        setError(null);
      } catch (err) {
        console.error('Error loading publicaciones:', err);
        setError('Error al cargar las publicaciones');
      } finally {
        setLoading(false);
      }
    }

    fetchPublicaciones();
  }, []);
  
  const categories = [
    { id: "all", label: "Todos" },
    { id: "electoral", label: "Electoral" },
    { id: "desinformacion", label: "Desinformación" },
    { id: "democracia", label: "Democracia" },
    { id: "analisis", label: "Análisis" }
  ];

  const filteredPublicaciones = selectedCategory === "all" 
    ? publicaciones 
    : publicaciones.filter(pub => pub.category === selectedCategory);

  const handleDownload = async (url: string | undefined, title: string) => {
    if (!url) {
      alert('No hay archivo disponible para descargar');
      return;
    }
    
    try {
      // Método más compatible: fetch + blob + ObjectURL
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Crear elemento <a> temporal para forzar descarga
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Obtener extensión del archivo desde la URL o usar tipo por defecto
      const extension = url.split('.').pop()?.toLowerCase() || 'pdf';
      const fileName = `${title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.${extension}`;
      
      link.download = fileName;
      link.style.display = 'none';
        
      // Añadir al DOM, hacer click y limpiar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar el blob URL después de un tiempo
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
        
    } catch (error) {
      console.error('Error al descargar archivo:', error);
      alert('Error al descargar el archivo');
    }
  };

  const handlePreview = (url: string | undefined, title: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      console.log(`Vista previa: ${title}`);
      alert(`Funcionalidad de vista previa para: ${title}`);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <motion.section
        className="py-20 lg:py-28 bg-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-[#CBA135]"></div>
          <p className="mt-4 text-lg text-gray-600">Cargando publicaciones...</p>
        </div>
      </motion.section>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.section
        className="py-20 lg:py-28 bg-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-500 text-lg font-semibold mb-4">{error}</div>
          <p className="text-gray-600">Por favor, verifica la conexión al servidor.</p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      id="publicaciones"
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-bold mb-6">
            <span className="text-[#222426]">Publicaciones e </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Informes
            </span>
          </h2>
          
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-6"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-opensans">
            Informes especializados, estudios de investigación y documentos de monitoreo electoral
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* Publications Grid */}
        {filteredPublicaciones.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPublicaciones.map((publicacion, index) => (
            <motion.div
              key={publicacion.id}
              className={`bg-white rounded-2xl border-2 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group ${
                publicacion.featured ? "border-[#CBA135]" : "border-gray-200"
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              layout
            >
             
             

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTypeColor(publicacion.type)}`}>
                  {getTypeLabel(publicacion.type)}
                </span>
                <div className="text-xs text-gray-500">
                  {publicacion.pages} páginas
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-lg font-montserrat font-bold text-[#222426] mb-3 group-hover:text-[#CBA135] transition-colors line-clamp-2">
                  {publicacion.title}
                </h3>
                                  <p className="text-gray-600 font-opensans text-sm leading-relaxed mb-4 line-clamp-3">
                    {publicacion.description}
                  </p>
                
                {/* Meta info */}
                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center">
                    <IconCalendar className="h-3 w-3 mr-2" />
                    {publicacion.date 
                      ? new Date(publicacion.date).toLocaleDateString('es-ES')
                      : publicacion.createdAt 
                        ? new Date(publicacion.createdAt).toLocaleDateString('es-ES')
                        : 'Fecha no disponible'
                    }
                  </div>
                  <div className="flex items-center">
                    <IconFileText className="h-3 w-3 mr-2" />
                    {publicacion.author || 'Coalición Nacional'}
                  </div>
                  {publicacion.pages && (
                    <div className="flex items-center">
                      <IconTag className="h-3 w-3 mr-2" />
                      {publicacion.pages} páginas
                    </div>
                  )}
                </div>

                {/* Tags */}
                {publicacion.tags && publicacion.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {publicacion.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleDownload(
                    publicacion.downloadUrl, 
                    publicacion.title
                  )}
                  className="flex-1 bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white px-3 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-[#B8941F] hover:to-[#CBA135] transition-all duration-300 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconDownload className="h-3 w-3" />
                  Descargar
                </motion.button>
                
                <motion.button
                  onClick={() => handlePreview(
                    publicacion.previewUrl || publicacion.downloadUrl, 
                    publicacion.title
                  )}
                  className="px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-[#CBA135] hover:text-[#CBA135] transition-all duration-300 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconEye className="h-3 w-3" />
                  Ver
                </motion.button>
              </div>
            </motion.div>
          ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <IconFileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No hay publicaciones disponibles
            </h3>
            <p className="text-gray-500">
              {selectedCategory === "all" 
                ? "Aún no se han cargado publicaciones."
                : `No hay publicaciones en la categoría "${categories.find(c => c.id === selectedCategory)?.label}".`
              }
            </p>
          </motion.div>
        )}

        {/* Bottom CTA - Show only when there are publications */}
        {filteredPublicaciones.length > 0 && (
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-full border border-gray-200">
            <IconTag className="h-5 w-5 text-[#CBA135]" />
            <span className="text-gray-700 font-opensans font-medium">
              Nuevas publicaciones disponibles mensualmente
            </span>
          </div>
        </motion.div>
        )}
      </div>
    </motion.section>
  );
}