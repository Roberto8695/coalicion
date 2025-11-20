"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { publicacionesTendenciasService } from "@/api";
import { getAssetUrl } from "@/api/config";

interface Publication {
  id: number;
  titulo: string;
  descripcion: string;
  autor?: string;
  imagen?: string;
  url?: string;
  created_at?: string;
}

export function LatestNewsSection() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPublications();
  }, []);

  const loadPublications = async () => {
    try {
      setLoading(true);
      // Obtener las últimas 3 publicaciones de tendencias
      const response = await publicacionesTendenciasService.getRecent(3);
      
      if (response.data) {
        setPublications(response.data);
      }
    } catch (error) {
      console.error('Error al cargar publicaciones de tendencias:', error);
      // En caso de error, usar un array vacío
      setPublications([]);
    } finally {
      setLoading(false);
    }
  };

  // Obtener las últimas 3 publicaciones
  const latestPublications = publications.slice(0, 3);

  // Función para truncar texto
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <motion.section 
      id="latest-news" 
      className="py-20 bg-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Decorative background elements */}
      <motion.div 
        className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-[#CBA135]/10 to-red-400/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-red-400/10 to-[#CBA135]/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
      ></motion.div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-montserrat font-semibold text-gray-900 mb-6">
            Tendencias <span className="text-[#CBA135] font-semibold">Electorales</span>
          </h2>
          
          {/* Red underline with gradient */}
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-8 shadow-sm"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          ></motion.div>
        </motion.div>
        
        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg h-[450px]"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : latestPublications.length > 0 ? (
            latestPublications.map((publication, index) => (
              <motion.article
                key={publication.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col h-full min-h-[450px]"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => handleCardClick(publication.url)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getAssetUrl(publication.imagen || "")}
                    alt={publication.titulo}
                    width={400}
                    height={250}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+") {
                        target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";
                      }
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-grow flex flex-col">
                  {/* Handle/Source - usar autor si está disponible */}
                  {publication.autor && (
                    <span className="inline-block px-3 py-1 bg-[#CBA135]/10 text-[#CBA135] text-xs font-semibold font-montserrat rounded-full mb-3 w-fit">
                      @{publication.autor}
                    </span>
                  )}
                  
                  {/* Title */}
                  <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 group-hover:text-[#CBA135] transition-colors duration-300 flex-shrink-0">
                    {truncateText(publication.titulo, 80)}
                  </h3>
                  
                  {/* Subtitle - usar descripcion */}
                  <p className="text-gray-600 font-opensans text-sm leading-relaxed flex-grow">
                    {truncateText(publication.descripcion || '', 150)}
                  </p>
                </div>
                
                {/* Bottom border with accent color */}
                <div className="h-1 bg-gradient-to-r from-[#CBA135] to-red-600"></div>
              </motion.article>
            ))
          ) : (
            // Empty state
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay publicaciones disponibles
              </h3>
              <p className="text-gray-500">
                Las publicaciones de tendencias electorales aparecerán aquí una vez que sean agregadas desde el dashboard.
              </p>
            </motion.div>
          )}
        </div>
        
        {/* Ver más publicaciones button */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Link
            href="/publicaciones"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white font-semibold font-montserrat text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-[#CBA135]/20 hover:border-[#CBA135]/40"
          >
            <span>Ver Todas las Publicaciones</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
      
      {/* Additional background pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#CBA135] rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          viewport={{ once: true }}
        ></motion.div>
        <motion.div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
          viewport={{ once: true }}
        ></motion.div>
        <motion.div 
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-[#CBA135] rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.6 }}
          viewport={{ once: true }}
        ></motion.div>
      </div>
    </motion.section>
  );
}
