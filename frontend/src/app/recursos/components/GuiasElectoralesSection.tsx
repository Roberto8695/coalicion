"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { IconDownload, IconEye, IconFileText, IconCalendar } from "@tabler/icons-react";
import { documentosElectoralesService } from "@/api";

interface DocumentoElectoral {
  id: number;
  title: string;
  description: string;
  type: "PDF" | "DOC" | "XLSX" | "PPTX";
  fileSize?: string;
  fileUrl: string;
  previewUrl?: string;
  publishDate: string;
  category: "Manual" | "Procedimiento" | "Normativa" | "Capacitación" | "Informe";
  status: string;
  tags?: string;
  authorName?: string;
  version?: string;
  createdAt?: string;
  updatedAt?: string;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Manual": return "from-blue-600 to-blue-700";
    case "Procedimiento": return "from-green-600 to-green-700";
    case "Normativa": return "from-purple-600 to-purple-700";
    case "Capacitación": return "from-orange-600 to-orange-700";
    case "Informe": return "from-red-600 to-red-700";
    default: return "from-gray-600 to-gray-700";
  }
};

const getCategoryLabel = (category: string) => {
  return category || "Documento";
};

export function GuiasElectoralesSection() {
  const [documentos, setDocumentos] = useState<DocumentoElectoral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar documentos desde API local
  useEffect(() => {
    async function fetchDocumentos() {
      try {
        setLoading(true);
        const response = await documentosElectoralesService.getPublished();
        
        if (response.success && response.data) {
          setDocumentos(response.data);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading documentos electorales:', err);
        setError('Error al cargar los documentos electorales');
      } finally {
        setLoading(false);
      }
    }

    fetchDocumentos();
  }, []);

  // Helper function to handle file download
  const handleDownload = async (documento: DocumentoElectoral) => {
    if (!documento.fileUrl) {
      alert('No hay archivo disponible para descargar');
      return;
    }

    try {
      // Opción 1: Usar la ruta de descarga del backend si tenemos ID
      if (documento.id) {
        const downloadUrl = `/api/documentos-electorales/download/${documento.id}`;
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${documento.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.${documento.type.toLowerCase()}`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return;
      }
      
      // Opción 2: Intentar descarga directa con fetch para forzar descarga
      const response = await fetch(documento.fileUrl);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${documento.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.${documento.type.toLowerCase()}`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpiar el objeto URL
        window.URL.revokeObjectURL(url);
      } else {
        // Si falla el fetch, usar el método tradicional
        throw new Error('No se puede acceder al archivo');
      }
    } catch (error) {
      console.log('Descarga directa falló, intentando método tradicional...', error);
      
      // Método alternativo: usar link directo con download attribute
      try {
        const link = document.createElement('a');
        link.href = documento.fileUrl;
        link.download = `${documento.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.${documento.type.toLowerCase()}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        // Agregar evento para manejar la descarga
        link.addEventListener('click', (e) => {
          // Intentar forzar descarga con download attribute
          if (!link.download) {
            e.preventDefault();
            window.open(documento.fileUrl, '_blank', 'noopener,noreferrer');
          }
        });
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (linkError) {
        console.error('Error en descarga:', linkError);
        // Como último recurso, notificar al usuario
        alert('No se pudo descargar automáticamente. El archivo se abrirá en una nueva pestaña.');
        window.open(documento.fileUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handlePreview = (url: string | undefined, title: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.log(`No hay URL de vista previa para: ${title}`);
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
          {documentos.map((documento, index) => (
            <motion.div
              key={documento.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Header with category and file info */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(documento.category)}`}>
                  {getCategoryLabel(documento.category)}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded uppercase font-medium">
                    {documento.type}
                  </span>
                  {documento.fileSize && (
                    <span>
                      {documento.fileSize}
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-xl font-montserrat font-bold text-[#222426] mb-3 group-hover:text-[#CBA135] transition-colors leading-tight">
                  {documento.title}
                </h3>
                <p className="text-gray-600 font-opensans leading-relaxed mb-4 text-sm">
                  {documento.description}
                </p>
                
                {/* Date and author info */}
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <IconCalendar className="h-4 w-4 mr-2" />
                    {new Date(documento.publishDate).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  {documento.authorName && (
                    <div className="text-xs text-gray-400">
                      Organiza: {documento.authorName}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => handleDownload(documento)}
                  className="flex-1 bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-[#B8941F] hover:to-[#CBA135] transition-all duration-300 text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconDownload className="h-4 w-4" />
                  Descargar
                </motion.button>
                
                <motion.button
                  onClick={() => handlePreview(documento.previewUrl || documento.fileUrl, documento.title)}
                  className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2 hover:border-[#CBA135] hover:text-[#CBA135] transition-all duration-300 text-sm"
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
