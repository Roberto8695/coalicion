"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface Logo {
  src: string;
  alt: string;
  name: string;
  url: string;
}

const logos: Logo[] = [
  { src: '/logos/ONU-mujeres.avif', alt: 'ONU Mujeres', name: 'ONU Mujeres', url: 'https://www.unwomen.org/es' },
  { src: '/logos/logo-periodistas.webp', alt: 'Periodistas', name: 'Periodistas', url: 'https://anp-bolivia.com/' },
  { src: '/logos/LOGO-MUY-WASO.webp', alt: 'Muy Waso', name: 'Muy Waso', url: 'https://muywaso.com/' },
  { src: '/logos/logo-ipicom.webp', alt: 'IPICOM', name: 'IPICOM', url: 'https://ipicom.umsa.bo/' },
  { src: '/logos/logo-guardiana.webp', alt: 'Guardiana', name: 'Guardiana', url: 'https://guardiana.com.bo/' },
  { src: '/logos/Logo-fespng.webp', alt: 'FES', name: 'FES', url: 'https://www.fes.de/' },
  { src: '/logos/logo-coordinadora-de-la-mujer.jpg', alt: 'Coordinadora de la Mujer', name: 'Coordinadora de la Mujer', url: 'https://coordinadoradelamujer.org.bo/' },
  { src: '/logos/logo-cibeEr.webp', alt: 'CiberEr', name: 'CiberEr', url: 'https://ciberwarmis.org/' },
  { src: '/logos/logo-chequea.webp', alt: 'Chequea', name: 'Chequea', url: 'https://chequeabolivia.bo/' },
  { src: '/logos/LOGO-bolivia.png', alt: 'Bolivia Verifica', name: 'Bolivia Verifica', url: 'https://boliviaverifica.bo/' },
  { src: '/logos/ibf.webp', alt: 'IBF', name: 'IBF', url: 'https://www.internetbolivia.org/' },
  { src: '/logos/fundacion-construir.webp', alt: 'Fundación Construir', name: 'Fundación Construir', url: 'https://fundacionconstruir.org/' },
  { src: '/logos/DW-Academie.jpg', alt: 'DW Academie', name: 'DW Academie', url: 'https://www.dw.com/es/actualidad/s-30684' },
  { src: '/logos/aru.webp', alt: 'ARU', name: 'ARU', url: 'https://www.aru.org.bo/' },
  { src: '/logos/aboic.png', alt: 'ABOIC', name: 'ABOIC', url: 'https://aboic.org/' }
];

export function SliderLogos() {
  const [translateX, setTranslateX] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setTranslateX((prev) => prev - 1); // Movimiento muy suave, 1px por vez
    }, 50); // Cada 50ms para movimiento fluido

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handleLogoClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const moveLeft = () => {
    setTranslateX((prev) => prev + 300); // Mueve 300px a la izquierda
    setIsAutoPlay(false); // Pausa auto-scroll

    // Reanuda auto-scroll después de 4 segundos de inactividad
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 4000);
  };

  const moveRight = () => {
    setTranslateX((prev) => prev - 300); // Mueve 300px a la derecha
    setIsAutoPlay(false); // Pausa auto-scroll

    // Reanuda auto-scroll después de 4 segundos de inactividad
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 4000);
  };

  // Touch handlers para móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlay(false); // Pausa auto-scroll al tocar
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      moveRight(); // Deslizar izquierda mueve el carousel hacia la derecha
    }
    if (isRightSwipe) {
      moveLeft(); // Deslizar derecha mueve el carousel hacia la izquierda
    }

    // Reanuda auto-scroll después del swipe
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 4000);
  };

  return (
    <motion.div
      id="organizations"
      className="w-full py-16 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Miembros
          
          </motion.h2>
          {/* Red underline with gradient */}
                  <motion.div 
                    className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-12  shadow-sm"
                    initial={{ width: 0 }}
                    whileInView={{ width: 128 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    viewport={{ once: true }}
                  ></motion.div>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Organizaciones comprometidas con la integridad electoral en Bolivia
          </motion.p>
          {/* Indicador para móviles */}
          <motion.p
            className="text-sm text-gray-500 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          ></motion.p>
        </div>

        {/* Botones de navegación fuera del carousel - Solo en desktop */}
        <div className="relative flex items-center justify-center">
          {/* Botón Izquierdo - Más alejado - Solo en desktop */}
          <motion.button
            onClick={moveLeft}
            className="absolute -left-16 sm:-left-20 lg:-left-24 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white hover:border-[#CBA135]/30 hover:shadow-xl transition-all duration-300 items-center justify-center group hidden md:flex"
            aria-label="Mover slider a la izquierda"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-[#CBA135] transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          {/* Botón Derecho - Más alejado - Solo en desktop */}
          <motion.button
            onClick={moveRight}
            className="absolute -right-16 sm:-right-20 lg:-right-24 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 hover:bg-white hover:border-[#CBA135]/30 hover:shadow-xl transition-all duration-300 items-center justify-center group hidden md:flex"
            aria-label="Mover slider a la derecha"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-[#CBA135] transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>

          {/* Contenedor del carousel con touch events */}
          <motion.div
            className="relative w-full touch-pan-y"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >       
            {/* Gradientes laterales para fade effect */}
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

            <motion.div
              className="logos-track"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div
                className="logos-slider-infinite"
                style={{ transform: `translateX(${translateX}px)` }}
              >
                {/* Triplicamos los logos para un efecto seamless perfecto */}
                {[...logos, ...logos, ...logos].map((logo, index) => (
                  <motion.div
                    key={`${logo.name}-${index}`}
                    className="logo-item"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: (index % logos.length) * 0.05,
                    }}
                    viewport={{ once: true }}
                  >
                    <div
                      className="logo-container group cursor-pointer"
                      onClick={() => handleLogoClick(logo.url)}
                      title={`Visitar ${logo.name}`}
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto">
                        <Image
                          src={logo.src}
                          alt={logo.alt}
                          fill
                          className="object-contain transition-all duration-500 ease-in-out filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                          sizes="(max-width: 768px) 80px, (max-width: 1024px) 100px, 128px"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
