"use client";

import React from "react";
import { motion } from "motion/react";
import { IconChevronUp } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";



export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-white text-white overflow-hidden min-h-fit">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

    

      <div className="relative max-w-7xl mx-auto">
        {/* Main Footer Content - Logos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="pt-5 pb-8 bg-white/95 backdrop-blur-sm border-gray-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 px-4 sm:px-6 lg:px-8 xl:px-18">
            
            {/* Columna Izquierda - En colaboración con */}
            <div className="order-1 space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600 mb-4 sm:mb-6 text-center lg:text-left leading-tight">
                En colaboración con:
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
                {/* Logo PNUD */}
                <div className="flex items-center justify-center bg-white/50 rounded-lg p-2 sm:p-3 shadow-sm">
                  <Image
                    src="/pnud-logo.svg"
                    alt="PNUD"
                    width={180}
                    height={80}
                    className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
                  />
                </div>
                
                {/* Logo OEP */}
                <div className="flex items-center justify-center bg-white/50 rounded-lg p-2 sm:p-3 shadow-sm">
                  <Image
                    src="/logos/OEP.png"
                    alt="Órgano Electoral Plurinacional"
                    width={180}
                    height={120}
                    className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha - Iniciativa financiada por */}
            <div className="order-2 space-y-4">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-600 mb-4 sm:mb-6 text-center lg:text-right leading-tight">
                Iniciativa financiada por:
              </h3>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4">
                {/* Logo Unión Europea */}
                <div className="flex items-center justify-center bg-white/50 rounded-lg p-2 sm:p-3 shadow-sm">
                  <Image
                    src="/logos/union.png"
                    alt="Unión Europea"
                    width={180}
                    height={50}
                    className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
                  />
                </div>
                
                {/* Logo Cooperación Española */}
                <div className="flex items-center justify-center bg-white/50 rounded-lg p-2 sm:p-3 shadow-sm">
                  <Image
                    src="/logos/española.png"
                    alt="Cooperación Española"
                    width={180}
                    height={50}
                    className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
                  />
                </div>
                
                {/* Logo Canadá */}
                <div className="flex items-center justify-center bg-white/50 rounded-lg p-2 sm:p-3 shadow-sm">
                  <Image
                    src="/logos/canada.png"
                    alt="Gobierno de Canadá"
                    width={180}
                    height={50}
                    className="h-8 sm:h-10 lg:h-12 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
            <div className="text-gray-500 text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
              © 2025 Coalición Nacional. Todos los derechos reservados.
            </div>
            
            <div className="flex items-center justify-center gap-4 sm:gap-6 order-1 sm:order-2">
              <Link 
                href="#privacy" 
                className="text-gray-500 hover:text-red-600 text-xs sm:text-sm transition-colors duration-200"
              >
                Privacidad
              </Link>
              <Link 
                href="#terms" 
                className="text-gray-500 hover:text-red-600 text-xs sm:text-sm transition-colors duration-200"
              >
                Términos
              </Link>
              
              {/* Back to top button */}
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 sm:w-9 sm:h-9 bg-red-800/10 hover:bg-red-800/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-red-600 hover:text-red-800 transition-all duration-300 border border-red-200/50"
                aria-label="Volver arriba"
              >
                <IconChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
