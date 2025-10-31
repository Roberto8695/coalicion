"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconDownload, IconEye, IconFileText, IconCalendar } from "@tabler/icons-react";
import { guiasElectoralesService } from "@/api";

interface GuiaElectoral {
  id: number;
  title: string;
  description: string;
  type: "PDF" | "DOC" | "XLSX";
  size?: string;
  downloadUrl?: string;
  previewUrl?: string;
  date: string;
  category: "manual" | "procedimiento" | "normativa" | "capacitacion";
  fileSize?: number;
  fileFormat?: string;
  createdAt?: string;
  updatedAt?: string;
}

const guiasElectorales: GuiaElectoral[] = [
  {
    id: 1,
    title: "Manual de Verificación de Hechos Electorales",
    description: "Guía completa para la verificación de información electoral y detección de desinformación.",
    type: "PDF",
    size: "2.3 MB",
    downloadUrl: "/docs/manual-verificacion.pdf",
    date: "2024-03-15",
    category: "manual"
  },
  {
    id: 2,
    title: "Procedimientos de Monitoreo Electoral",
    description: "Protocolos y metodologías para el monitoreo efectivo de procesos electorales.",
    type: "PDF",
    size: "1.8 MB",
    downloadUrl: "/docs/procedimientos-monitoreo.pdf",
    date: "2024-02-28",
    category: "procedimiento"
  },
  {
    id: 3,
    title: "Marco Normativo Electoral Boliviano",
    description: "Compendio de leyes y reglamentos que rigen los procesos electorales en Bolivia.",
    type: "PDF",
    size: "4.1 MB",
    downloadUrl: "/docs/marco-normativo.pdf",
    date: "2024-01-20",
    category: "normativa"
  },
  {
    id: 4,
    title: "Guía de Capacitación para Observadores",
    description: "Material de formación para observadores electorales y verificadores de información.",
    type: "PDF",
    size: "3.2 MB",
    downloadUrl: "/docs/capacitacion-observadores.pdf",
    date: "2024-03-01",
    category: "capacitacion"
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "manual": return "from-blue-600 to-blue-700";
    case "procedimiento": return "from-green-600 to-green-700";
    case "normativa": return "from-purple-600 to-purple-700";
    case "capacitacion": return "from-orange-600 to-orange-700";
    default: return "from-gray-600 to-gray-700";
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case "manual": return "Manual";
    case "procedimiento": return "Procedimiento";
    case "normativa": return "Normativa";
    case "capacitacion": return "Capacitación";
    default: return "Documento";
  }
};

export function GuiasElectoralesSection() {
  const [guias, setGuias] = useState<GuiaElectoral[]>(guiasElectorales);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar guías desde API local
  useEffect(() => {
    async function fetchGuias() {
      try {
        setLoading(true);
        const response = await guiasElectoralesService.getAll();
        const data = response.data;
        
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const mapped: GuiaElectoral[] = data.map((item: any) => ({
          id: item.id,
          title: item.title || 'Guía sin título',
          description: item.description || '',
          type: (item.fileFormat?.toUpperCase() as "PDF" | "DOC" | "XLSX") || "PDF",
          size: item.fileSize ? `${(item.fileSize / 1024 / 1024).toFixed(1)} MB` : "N/A",
          downloadUrl: item.downloadUrl,
          previewUrl: item.previewUrl,
          date: item.date || item.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          category: (item.category as "manual" | "procedimiento" | "normativa" | "capacitacion") || "manual",
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        /* eslint-enable @typescript-eslint/no-explicit-any */
        
        if (mapped.length > 0) {
          setGuias(mapped);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading guías electorales:', err);
        setError('Error al cargar las guías electorales');
      } finally {
        setLoading(false);
      }
    }

    fetchGuias();
  }, []);

  // Helper function to handle file download
  const handleDownload = (guia: GuiaElectoral) => {
    if (!guia.downloadUrl) {
      alert('No hay archivo disponible para descargar');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = guia.downloadUrl;
      link.download = `${guia.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.${guia.type.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
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
          <p className="mt-4 text-lg text-gray-600">Cargando guías electorales...</p>
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
      id="guias-electorales"
      className="py-20 lg:py-28 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-slate-50/50"></div>
      
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
            <span className="text-[#222426]">OEP </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Documentos Electorales
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
            Documentos especializados, manuales y guías para el fortalecimiento de los procesos electorales
          </p>
        </motion.div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {guias.map((guia, index) => (
            <motion.div
              key={guia.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Header with category and type */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(guia.category)}`}>
                  {getCategoryLabel(guia.category)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {guia.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {guia.size}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-montserrat font-bold text-[#222426] mb-3 group-hover:text-[#CBA135] transition-colors">
                  {guia.title}
                </h3>
                <p className="text-gray-600 font-opensans leading-relaxed mb-6">
                  {guia.description}
                </p>
                
                {/* Date */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <IconCalendar className="h-4 w-4 mr-2" />
                  {new Date(guia.date).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => handleDownload(guia)}
                  className="flex-1 bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-[#B8941F] hover:to-[#CBA135] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconDownload className="h-4 w-4" />
                  Descargar
                </motion.button>
                
                <motion.button
                  onClick={() => handlePreview(guia.previewUrl || guia.downloadUrl, guia.title)}
                  className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-[#CBA135] hover:text-[#CBA135] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconEye className="h-4 w-4" />
                  Vista Previa
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-full border border-gray-200">
            <IconFileText className="h-5 w-5 text-[#CBA135]" />
            <span className="text-gray-700 font-opensans font-medium">
              ¿Necesitas más recursos? Contáctanos para acceso completo
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
