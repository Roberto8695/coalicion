"use client";

import React from "react";
import { motion } from "motion/react";
import { IconChartBar, IconShieldCheck, IconUsersGroup } from "@tabler/icons-react";

export function IndicadoresSection() {
  return (
    <motion.section 
      id="quienes-somos" 
      className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Enhanced decorative background elements */}
      <motion.div 
        className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-[#CBA135]/15 to-red-400/15 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        viewport={{ once: true }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-52 h-52 bg-gradient-to-br from-red-400/12 to-[#CBA135]/12 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
        viewport={{ once: true }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-slate-100/30 to-gray-100/30 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.6 }}
        viewport={{ once: true }}
      />
      
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-bold text-[#222426] mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            ¿Quiénes <span className="text-[#CBA135] font-semibold">Somos</span>?
          </motion.h2>
        </motion.div>
        
        {/* Red underline with gradient */}
        <motion.div 
          className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-12 shadow-sm"
          initial={{ width: 0 }}
          whileInView={{ width: 128 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        />
        
        {/* Content Card with enhanced styling */}
        <motion.div 
          className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 lg:p-12 border border-white/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] group"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Card decorative elements */}
          <motion.div 
            className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-[#CBA135]/20 to-red-400/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          />
          <motion.div 
            className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-tr from-red-400/20 to-[#CBA135]/20 rounded-full blur-md group-hover:scale-110 transition-transform duration-500"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          />
          
          <div className="relative text-justify z-10">
            <motion.p 
              className="text-xl sm:text-2xl lg:text-2xl text-gray-700 leading-relaxed font-opensans mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              Somos una <span className="font-semibold text-[#CBA135] px-1 rounded">Coalición Nacional</span> formada por organizaciones de la 
              sociedad civil, medios de comunicación, instituciones académicas 
              y organismos internacionales, unidos en la lucha contra la 
              desinformación electoral en Bolivia.
            </motion.p>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Feature 1 */}
              <motion.div
                className="bg-gradient-to-r from-[#CBA135]/10 to-[#B8941F]/10 rounded-2xl p-6 border border-[#CBA135]/20 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-montserrat font-semibold text-[#222426] mb-2">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#CBA135]/15 text-[#B8941F]">
                    <IconUsersGroup className="h-6 w-6" stroke={1.8} />
                  </span>
                  <span className="block">Trabajo Colaborativo</span>
                </h3>
                <p className="text-gray-600 font-opensans">
                  Unión estratégica de múltiples sectores de la sociedad boliviana
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                className="bg-gradient-to-r from-red-500/10 to-rose-500/10 rounded-2xl p-6 border border-red-300/20 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-montserrat font-semibold text-[#222426] mb-2">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-700">
                    <IconShieldCheck className="h-6 w-6" stroke={1.8} />
                  </span>
                  <span className="block">Protección Electoral</span>
                </h3>
                <p className="text-gray-600 font-opensans">
                  Salvaguardando la integridad de los procesos democráticos
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-300/20 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-xl font-montserrat font-semibold text-[#222426] mb-2">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700">
                    <IconChartBar className="h-6 w-6" stroke={1.8} />
                  </span>
                  <span className="block">Transparencia Total</span>
                </h3>
                <p className="text-gray-600 font-opensans">
                  Promoviendo información veraz y verificable para todos
                </p>
              </motion.div>
            </div>
          </div>
          
          {/* Bottom subtle border */}
          <motion.div 
            className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.9 }}
            viewport={{ once: true }}
          />
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
        />
        <motion.div 
          className="absolute top-3/4 right-1/4 w-1 h-1 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.4 }}
          viewport={{ once: true }}
        />
        <motion.div 
          className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-[#CBA135] rounded-full"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1.6 }}
          viewport={{ once: true }}
        />
      </div>
    </motion.section>
  );
}
