"use client";

import React from "react";
import { motion } from "motion/react";
import { IconExternalLink, IconShield } from "@tabler/icons-react";
import Image from "next/image";

interface VerificadorTool {
  id: number;
  name: string;
  description: string;
  type: "website" | "bot" | "api" | "tool";
  url: string;
  logo?: string;
  features: string[];
  isActive: boolean;
}

const verificadores: VerificadorTool[] = [
  {
    id: 1,
    name: "Chequea Bolivia",
    description: "Plataforma especializada en verificación de hechos y noticias en Bolivia.",
    type: "website",
    url: "https://chequeabolivia.bo/",
    logo: "/logos/logo-chequea.webp",
    features: ["Verificación en tiempo real", "Base de datos de noticias falsas", "Reportes semanales"],
    isActive: true
  },
  {
    id: 2,
    name: "CheckiBot",
    description: "Bot de verificación automática para WhatsApp y Telegram.",
    type: "bot",
    url: "https://chekibot.chequeabolivia.bo/",
    logo: "/logos/cheki.jpg",
    features: ["Verificación por WhatsApp", "Respuestas automáticas", "Enlaces a fuentes oficiales"],
    isActive: true
  },
  {
    id: 3,
    name: "Chequea Tu Voto",
    description: "Información oficial del Órgano Electoral Plurinacional de Bolivia.",
    type: "website",
    url: "https://chequeatuvoto.chequeabolivia.bo/",
    logo: "/logos/chequeatuvoto.webp",
    features: ["Datos oficiales", "Resultados electorales", "Normativa actualizada"],
    isActive: true
  },
  {
    id: 4,
    name: "Bolivia Verifica",
    description: "Herramienta de monitoreo y análisis de procesos electorales.",
    type: "website",
    url: "https://boliviaverifica.bo/",
    logo: "/logos/LOGO-bolivia.png",
    features: ["Monitoreo en vivo", "Análisis estadístico", "Alertas tempranas"],
    isActive: true
  },
  {
    id: 5,
    name: "Olivia Verifica",
    description: "Bot especializado en detección automática de contenido falso.",
    type: "bot",
    url: "https://api.whatsapp.com/send?phone=59162352290&text=%C2%A1Hola%20Olivia!%20Necesito%20tu%20ayuda",
    logo: "/logos/olivia.webp",
    features: ["Análisis de imágenes", "Verificación de videos", "Reportes instantáneos"],
    isActive: true
  },
  {
    id: 6,
    name: "Órgano Electoral Plurinacional",
    description: "Interfaz de programación para desarrolladores y medios de comunicación.",
    type: "website",
    url: "https://www.oep.org.bo/",
    logo: "/logos/OEPg.png",
    features: ["Integración fácil", "Documentación completa", "Acceso gratuito"],
    isActive: true
  }
];



const getTypeColor = (type: string) => {
  switch (type) {
    case "website": return "from-blue-600 to-blue-700";
    case "bot": return "from-green-600 to-green-700";
    case "api": return "from-purple-600 to-purple-700";
    case "tool": return "from-orange-600 to-orange-700";
    default: return "from-gray-600 to-gray-700";
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case "website": return "Sitio Web";
    case "bot": return "Bot";
    case "api": return "API";
    case "tool": return "Herramienta";
    default: return "Recurso";
  }
};

export function VerificacionHechosSection() {
  const handleVisit = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.section
      id="verificacion-hechos"
      className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-[#CBA135]/10 to-red-400/10 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        viewport={{ once: true }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-52 h-52 bg-gradient-to-br from-red-400/8 to-[#CBA135]/8 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        viewport={{ once: true }}
      />
      
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
            <span className="text-[#222426]">Verificación de </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Hechos
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
            Herramientas especializadas, verificadores automáticos y recursos para combatir la desinformación
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {verificadores.map((verificador, index) => {
            return (
              <motion.div
                key={verificador.id}
                className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Logo en la esquina superior derecha */}
                {verificador.logo && (
                  <div className="absolute top-4 right-4 w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <Image
                      src={verificador.logo}
                      alt={`${verificador.name} logo`}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-4 pr-20">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTypeColor(verificador.type)}`}>
                      {getTypeLabel(verificador.type)}
                    </span>
                    {verificador.isActive && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-xl font-montserrat font-bold text-[#222426] mb-3 group-hover:text-[#CBA135] transition-colors">
                    {verificador.name}
                  </h3>
                  <p className="text-gray-600 font-opensans leading-relaxed mb-4">
                    {verificador.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2">
                    {verificador.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 bg-[#CBA135] rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  onClick={() => handleVisit(verificador.url)}
                  className="w-full bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-[#B8941F] hover:to-[#CBA135] transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconExternalLink className="h-4 w-4" />
                  {verificador.type === "bot" ? "Usar Bot" : 
                   verificador.type === "api" ? "Ver API" : "Visitar"}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
            <IconShield className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-opensans font-medium">
              Todas las herramientas son verificadas y actualizadas regularmente
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
