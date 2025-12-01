"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { publicacionesCoalicionService, PublicacionCoalicion } from "../../../api/publicacionesCoalicion";

export function PublicacionesCoalicionSeccion() {
  const [publicaciones, setPublicaciones] = useState<PublicacionCoalicion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const formatFecha = (fecha: string): string => {
    try {
      const date = new Date(fecha);
      const year = date.getFullYear();
      const month = date.toLocaleDateString("es-ES", { month: "long" });
      return `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
    } catch {
      return fecha;
    }
  };

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await publicacionesCoalicionService.getAll({ limit: 3 });
        if (response.success && response.data) {
          setPublicaciones(response.data);
        } else {
          setError("No se pudieron cargar las publicaciones");
        }
      } catch (err) {
        console.error("Error al cargar publicaciones:", err);
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    cargarPublicaciones();
  }, []);

  return (
    <motion.section 
      id="publicaciones-coalicion" 
      className="py-20 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-montserrat font-semibold text-gray-900 mb-6">
            Publicaciones <span className="text-[#CBA135] font-semibold">Coalición</span>
          </h2>
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-8 shadow-sm"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          ></motion.div>
        </motion.div>
        
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#CBA135]"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && publicaciones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicaciones.map((publicacion, index) => (
              <motion.article
                key={publicacion.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col h-full min-h-[450px]"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => {
                  if (publicacion.url) {
                    window.open(publicacion.url, "_blank");
                  }
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={publicacion.imagen || "/api/placeholder/400/250"}
                    alt={publicacion.titulo}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#CBA135]/90 text-white text-xs font-semibold font-montserrat rounded-full backdrop-blur-sm">
                    {formatFecha(publicacion.fecha_publi)}
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 group-hover:text-[#CBA135] transition-colors duration-300 flex-shrink-0">
                    {truncateText(publicacion.titulo, 80)}
                  </h3>
                  <p className="text-gray-600 font-opensans text-sm leading-relaxed mb-4 flex-grow">
                    {truncateText(publicacion.descripcion, 150)}
                  </p>
                  {publicacion.url && (
                    <div 
                      className="flex items-center text-[#CBA135] font-semibold font-montserrat text-sm hover:text-[#B8941F] transition-colors duration-300 mt-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(publicacion.url, "_blank");
                      }}
                    >
                      <span>Leer más</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="h-1 bg-gradient-to-r from-[#CBA135] to-red-600"></div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && !error && publicaciones.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-4">No hay publicaciones disponibles en este momento.</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
