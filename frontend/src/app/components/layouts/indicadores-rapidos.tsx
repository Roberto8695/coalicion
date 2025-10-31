"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { IconTrendingUp, IconShield, IconEye, IconUsers } from "@tabler/icons-react";

const metricas = [
  {
    id: 1,
    title: "Verificaciones Totales",
    value: "100",
    change: "+8%",
    trend: "up",
    color: "from-blue-600 to-blue-700",
    icon: IconShield,
    description: "Casos verificados este mes"
  },
  {
    id: 2,
    title: "Contenido Verificado",
    value: "85",
    change: "+12%",
    trend: "up",
    color: "from-green-600 to-green-700",
    icon: IconEye,
    description: "Publicaciones analizadas"
  },
  {
    id: 3,
    title: "Casos Falsos",
    value: "23",
    change: "-5%",
    trend: "down",
    color: "from-red-600 to-red-700",
    icon: IconTrendingUp,
    description: "Desinformación detectada"
  },
  {
    id: 4,
    title: "Alcance Total",
    value: "50K",
    change: "+15%",
    trend: "up",
    color: "from-purple-600 to-purple-700",
    icon: IconUsers,
    description: "Personas informadas"
  }
];

export function IndicadoresRapidos() {
  return (
    <motion.section
      className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dashboard-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboard-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-montserrat font-semibold mb-6">
            <span className="text-[#222426]">Indicadores </span>
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Rapidos
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
            Monitoreo en tiempo real de verificaciones y combate contra la desinformación
          </p>
        </motion.div>

        {/* Main Dashboard Display */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-200">
            {/* Dashboard Image */}
            <div className="relative h-[600px] lg:h-[700px]">
              <Image
                src="/page/dashboard.webp"
                alt="Panel de Control - Monitoreo de Verificaciones"
                fill
                className="object-cover object-top"
                priority
                quality={95}
              />
              
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/10"></div>
              
              {/* Live indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">En Vivo</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metricas.map((metrica, index) => {
            const IconComponent = metrica.icon;
            
            return (
              <motion.div
                key={metrica.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#CBA135]/30 group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Header with icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${metrica.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    metrica.trend === "up" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {metrica.change}
                  </div>
                </div>

                {/* Value */}
                <div className="mb-2">
                  <div className="text-3xl font-montserrat font-bold text-[#222426] group-hover:text-[#CBA135] transition-colors">
                    {metrica.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {metrica.title}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 font-opensans">
                  {metrica.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Information Banner */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
            <IconShield className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-opensans font-medium">
              Sistema de monitoreo activo las 24 horas para proteger la integridad electoral
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
