"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ChromaGrid from './components/ChromaGrid/ChromaGrid'
import SimpleNavbar from "../components/layouts/simple-navbar";
import { Footer } from "../components/layouts/footer";
import ContactoModal from "../components/ContactoModal";

export default function PublicacionesPage() {
  const [showContactoModal, setShowContactoModal] = useState(false);

  return (
    <motion.div 
      className="min-h-screen bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Navbar */}
      <SimpleNavbar onContactClick={() => setShowContactoModal(true)} />
      
      {/* Main Content */}
      <motion.main 
        className="pt-20 lg:pt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.section 
          className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 lg:py-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div 
              className="text-center mb-8 lg:mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-semibold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.5 }}
              >
                Nuestras{" "}
                <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
                  Publicaciones
                </span>
              </motion.h1>
              <motion.p 
                className="text-lg sm:text-xl text-gray-600 font-opensans max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                Descubre las últimas investigaciones, reportes y contenido educativo de la Coalición Nacional para la Transparencia Electoral.
              </motion.p>
            </motion.div>

            {/* Grid de publicaciones */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <ChromaGrid 
                radius={300}
                damping={0.45}
                fadeOut={0.6}
                ease="power3.out"
              />
            </motion.div>
          </div>

          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#CBA135]/5 to-transparent rounded-full blur-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 1.2 }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-3xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 1.4 }}
            ></motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <Footer />
        </motion.div>
      </motion.main>

      {/* Modals */}
      <ContactoModal 
        open={showContactoModal} 
        onClose={() => setShowContactoModal(false)} 
      />
    </motion.div>
  );
}