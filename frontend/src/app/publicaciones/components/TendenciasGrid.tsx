"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { publicacionesTendenciasService, getAssetUrl, type PublicacionTendencia } from "@/api";

interface TendenciasGridProps {
  limit?: number;
}

export const TendenciasGrid: React.FC<TendenciasGridProps> = ({ limit }) => {
  const [publicaciones, setPublicaciones] = useState<PublicacionTendencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPublicaciones = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = limit 
          ? await publicacionesTendenciasService.getRecent(limit)
          : await publicacionesTendenciasService.getAll();
        
        if (response.data) {
          setPublicaciones(response.data);
        }
      } catch (err) {
        console.error('Error al cargar publicaciones:', err);
        setError('Error al cargar las publicaciones');
      } finally {
        setLoading(false);
      }
    };

    loadPublicaciones();
  }, [limit]);

  const reloadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = limit 
        ? await publicacionesTendenciasService.getRecent(limit)
        : await publicacionesTendenciasService.getAll();
      
      if (response.data) {
        setPublicaciones(response.data);
      }
    } catch (err) {
      console.error('Error al cargar publicaciones:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  // Colores para las tarjetas
  const colors = [
    { primary: "#CBA135", light: "rgba(203, 161, 53, 0.1)", border: "rgba(203, 161, 53, 0.2)" },
    { primary: "#DC2626", light: "rgba(220, 38, 38, 0.1)", border: "rgba(220, 38, 38, 0.2)" },
    { primary: "#059669", light: "rgba(5, 150, 105, 0.1)", border: "rgba(5, 150, 105, 0.2)" },
    { primary: "#7C3AED", light: "rgba(124, 58, 237, 0.1)", border: "rgba(124, 58, 237, 0.2)" },
    { primary: "#EA580C", light: "rgba(234, 88, 12, 0.1)", border: "rgba(234, 88, 12, 0.2)" },
    { primary: "#0284C7", light: "rgba(2, 132, 199, 0.1)", border: "rgba(2, 132, 199, 0.2)" },
  ];

  if (error) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-red-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Error al cargar contenido</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={reloadData}
          className="inline-flex items-center px-4 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reintentar
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {loading ? (
        // Estado de carga mejorado
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Array.from({ length: limit || 6 }).map((_, i) => (
            <motion.div
              key={`loading-${i}`}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="h-64 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : publicaciones.length > 0 ? (
        // Grid de publicaciones
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {publicaciones.map((publicacion, i) => {
            const colorScheme = colors[i % colors.length];
            
            return (
              <motion.article
                key={publicacion.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer relative"
                onClick={() => handleCardClick(publicacion.url)}
                initial={{ 
                  opacity: 0, 
                  y: 60,
                  scale: 0.95
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1
                }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{
                  y: -12,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                style={{
                  borderColor: colorScheme.border
                }}
              >
                {/* Efecto de hover en el fondo */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${colorScheme.light} 0%, transparent 50%)`
                  }}
                ></div>

                {/* Imagen */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
                  
                  <Image
                    src={getAssetUrl(publicacion.imagen || '')}
                    alt={publicacion.titulo}
                    width={400}
                    height={256}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmOWZhZmIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgZmlsbD0idXJsKCNhKSIvPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyOCIgcj0iMzAiIGZpbGw9IiNkMWQ1ZGIiLz48cGF0aCBkPSJNMTgwIDExOGgyMHYyMGgtMjB6bTUgNWgxMHYxMGgtMTB6IiBmaWxsPSIjOWNhM2FmIi8+PHRleHQgeD0iNTAlIiB5PSIxNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";
                    }}
                  />
                  
                  {/* Indicador de enlace externo */}
                  {publicacion.url && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <svg className="w-4 h-4" style={{ color: colorScheme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Barra de color superior */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 z-20"
                    style={{ backgroundColor: colorScheme.primary }}
                  ></div>
                </div>

                {/* Contenido */}
                <div className="relative z-10 p-6 space-y-4">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-montserrat font-bold text-lg text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                        {truncateText(publicacion.titulo, 80)}
                      </h3>
                      {publicacion.autor && (
                        <span 
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap"
                          style={{
                            backgroundColor: colorScheme.light,
                            color: colorScheme.primary,
                            borderColor: colorScheme.border
                          }}
                        >
                          {publicacion.autor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="font-opensans text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {truncateText(publicacion.descripcion || '', 150)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colorScheme.primary }}
                      ></div>
                      <span className="text-xs font-medium text-gray-500">Tendencia Electoral</span>
                    </div>
                    
                    {publicacion.url && (
                      <div 
                        className="flex items-center text-xs font-medium transition-colors duration-300"
                        style={{ color: colorScheme.primary }}
                      >
                        <span>Leer más</span>
                        <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Fecha si está disponible */}
                  {publicacion.created_at && (
                    <div className="text-xs text-gray-400 pt-1">
                      {new Date(publicacion.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        // Estado vacío
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-gray-400 mb-6">
            <svg className="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-montserrat font-semibold text-gray-900 mb-3">
            No hay tendencias electorales disponibles
          </h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            Las publicaciones de tendencias electorales aparecerán aquí una vez que sean agregadas desde el panel de administración.
          </p>
        </motion.div>
      )}

      {/* CSS personalizado para la animación shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TendenciasGrid;