"use client";

import React from "react";
import { motion } from "motion/react";
import { IconDownload, IconFileText, IconVideo, IconBook } from "@tabler/icons-react";

export function MaterialDescargableSection() {
  const handleDownloadClick = () => {
    // Aquí puedes agregar la lógica para descargar o redirigir a los materiales
    console.log("Iniciando descarga de materiales...");
    // Ejemplo: window.open('/downloads/material-coalicion.zip', '_blank');
  };

  return (
    <motion.section
      className="py-20 bg-gradient-to-br from-[#CBA135]/5 via-white to-red-400/5 relative overflow-hidden"
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
      />
      <motion.div
        className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-red-400/10 to-[#CBA135]/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
      />

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        {/* Header */}
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-montserrat font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <span className="text-gray-900">Material</span>{" "}
          <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
            Descargable
          </span>
        </motion.h2>

        <motion.div
          className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-8"
          initial={{ width: 0 }}
          whileInView={{ width: 128 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        />

        <motion.p
          className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-opensans mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          Accede a guías, manuales y recursos educativos para fortalecer tu conocimiento 
          sobre verificación de hechos y lucha contra la desinformación electoral.
        </motion.p>

        {/* Material Types Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#CBA135]/20 to-red-400/20 p-4 rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconFileText className="h-8 w-8 text-[#CBA135]" />
            </div>
            <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-2">
              Guías y Manuales
            </h3>
            <p className="text-gray-600 font-opensans">
              Documentos PDF con metodologías de verificación y mejores prácticas.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-red-400/20 to-[#CBA135]/20 p-4 rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconVideo className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-2">
              Videos Educativos
            </h3>
            <p className="text-gray-600 font-opensans">
              Contenido audiovisual para capacitaciones y talleres formativos.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-[#CBA135]/20 to-red-400/20 p-4 rounded-lg w-fit mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconBook className="h-8 w-8 text-[#CBA135]" />
            </div>
            <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-2">
              Material de Referencia
            </h3>
            <p className="text-gray-600 font-opensans">
              Recursos académicos y bibliografía especializada en fact-checking.
            </p>
          </motion.div>
        </div>

        {/* Download Button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleDownloadClick}
            className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] hover:from-[#B8941F] hover:to-[#CBA135] text-white font-semibold font-montserrat px-12 py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconDownload className="h-6 w-6" />
            <span>Material Descargable</span>
          </motion.button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-600 font-opensans">
            <strong className="text-gray-800">Incluye:</strong> Manuales de verificación de hechos, 
            guías para identificar desinformación, plantillas para reportes, videos tutoriales y 
            material de capacitación para organizaciones.
          </p>
        </motion.div>
      </div>

      {/* Additional background pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-1/3 left-1/3 w-2 h-2 bg-[#CBA135] rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.0 }}
          viewport={{ once: true }}
        />
        <motion.div
          className="absolute top-2/3 right-1/3 w-1 h-1 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.2 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.section>
  );
}
