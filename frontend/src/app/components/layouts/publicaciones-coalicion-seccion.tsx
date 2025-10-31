"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

export function PublicacionesCoalicionSeccion() {
  // Función para truncar texto
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  // Datos de las publicaciones con imágenes de uploads
  const publicaciones = [
    {
      id: 1,
      imagen: "/uploads/coalicionp1.webp",
      titulo: "Candidatos electos a la Asamblea Legislativa",
      descripcion: "Conocer a los candidatos electos por departamento y circunscripción.",
      fecha: "2025",
      url: "http://candidatos2025.labtecnosocial.org/"
    },
    {
      id: 2,
      imagen: "/uploads/coalicionp2.webp",
      titulo: "Segundo reporte sobre rumores y desinformación electoral",
      descripcion: "Análisis interactivo del panorama electoral de Bolivia.",
      fecha: "Julio 2025",
      url: "https://articles.chequeabolivia.bo/reports/julio25/index.html"
    },
    {
      id: 3,
      imagen: "/uploads/coalicionp4.webp",
      titulo: "La credibilidad del proceso electoral y el voto nulo, focos de la desinformación en el “Día D”",
      descripcion: "Bolivia votó y definió un balotaje. La jornada se desarrolló con normalidad en las urnas, pero con un alto nivel de desinformación en las redes.",
      fecha: "Agosto 2025",
      url: "https://boliviaverificaelecciones.bo/la-credibilidad-del-proceso-electoral-y-el-voto-nulo-focos-de-la-desinformacion-en-el-dia-d"
    }
  ];

  return (
    <motion.section 
      id="publicaciones-coalicion" 
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
            Publicaciones <span className="text-[#CBA135] font-semibold">Coalición</span>
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
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicaciones.map((publicacion, index) => (
            <motion.article
              key={publicacion.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group flex flex-col h-full min-h-[450px]"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => window.open(publicacion.url, '_blank')}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={publicacion.imagen}
                  alt={publicacion.titulo}
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
                
                {/* Date badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#CBA135]/90 text-white text-xs font-semibold font-montserrat rounded-full backdrop-blur-sm">
                  {publicacion.fecha}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-3 group-hover:text-[#CBA135] transition-colors duration-300 flex-shrink-0">
                  {truncateText(publicacion.titulo, 80)}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 font-opensans text-sm leading-relaxed mb-4 flex-grow">
                  {truncateText(publicacion.descripcion, 150)}
                </p>
                
                {/* Read more link */}
                <div 
                  className="flex items-center text-[#CBA135] font-semibold font-montserrat text-sm hover:text-[#B8941F] transition-colors duration-300 mt-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(publicacion.url, '_blank');
                  }}
                >
                  <span>Leer más</span>
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
              
              {/* Bottom border with accent color */}
              <div className="h-1 bg-gradient-to-r from-[#CBA135] to-red-600"></div>
            </motion.article>
          ))}
        </div>
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
