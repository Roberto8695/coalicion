"use client";

import React from "react";
import { motion } from "motion/react";
import { IconPhoto, IconNews, IconBook, IconShieldCheck } from "@tabler/icons-react";
import Image from "next/image";

export function RecursosHeroSection() {
  return (
    <motion.section
      className="relative min-h-screen py-20 sm:py-24 lg:py-32 flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-gray-800 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-10 sm:top-20 left-5 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-[#CBA135]/20 to-red-500/20 rounded-full blur-2xl sm:blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-red-500/15 to-[#CBA135]/15 rounded-full blur-2xl sm:blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-montserrat font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-white">Centro de</span>{" "}
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Recursos
            </span>
          </h1>
          
          <motion.div
            className="w-24 sm:w-32 lg:w-40 h-1 bg-gradient-to-r from-red-800 to-rose-600 rounded-full mx-auto mb-6 sm:mb-8"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-opensans px-4">
            Accede a herramientas, guías y recursos especializados para combatir la desinformación electoral
          </p>
        </motion.div>

        {/* Resource Categories Preview */}
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Category 1 - OEP */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 p-1">
              <Image 
                src="/logos/OEPg.png" 
                alt="OEP Logo" 
                width={40}
                height={40}
                className="object-contain w-full h-full"
              />
            </div>
            <h3 className="text-white font-montserrat font-semibold text-xs sm:text-sm mb-1 text-center">
              OEP
            </h3>
            <p className="text-gray-300 text-xs font-opensans text-center leading-tight">
              Órgano Electoral Plurinacional
            </p>
          </motion.div>

          {/* Category 2 - Verificaciones */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <IconShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-white font-montserrat font-semibold text-xs sm:text-sm mb-1 text-center">
              Verificaciones
            </h3>
            <p className="text-gray-300 text-xs font-opensans text-center leading-tight">
              Fact-checking electoral
            </p>
          </motion.div>

          {/* Category 3 - Noticias */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <IconNews className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-white font-montserrat font-semibold text-xs sm:text-sm mb-1 text-center">
              Noticias
            </h3>
            <p className="text-gray-300 text-xs font-opensans text-center leading-tight">
              Actualidad electoral
            </p>
          </motion.div>

          {/* Category 4 - Multimedia */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <IconPhoto className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-white font-montserrat font-semibold text-xs sm:text-sm mb-1 text-center">
              Multimedia
            </h3>
            <p className="text-gray-300 text-xs font-opensans text-center leading-tight">
              Videos e infografías
            </p>
          </motion.div>

          {/* Category 5 - Publicaciones */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center items-center"
            whileHover={{ scale: 1.02, y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <IconBook className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-white font-montserrat font-semibold text-xs sm:text-sm mb-1 text-center">
              Publicaciones
            </h3>
            <p className="text-gray-300 text-xs font-opensans text-center leading-tight">
              Documentos y guías
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
