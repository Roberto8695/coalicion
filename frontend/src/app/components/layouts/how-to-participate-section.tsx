"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";

export function HowToParticipateSection() {
  return (
    <motion.section 
      id="how-to-participate" 
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Decorative background elements */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-[#CBA135]/10 to-red-400/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
      ></motion.div>
      <motion.div 
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-red-400/10 to-[#CBA135]/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
      ></motion.div>
      
      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        {/* Header */}
        <motion.h2 
          className="text-4xl sm:text-5xl font-montserrat font-semibold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Cómo participar de la <span className="text-[#CBA135] font-semibold">Coalición</span>
        </motion.h2>
        
        {/* Red underline with gradient */}
        <motion.div 
          className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-12 shadow-sm"
          initial={{ width: 0 }}
          whileInView={{ width: 128 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        ></motion.div>
        
        {/* Content Card with enhanced styling */}
        <motion.div 
          className="relative bg-white/100  rounded-2xl p-8 lg:p-12 transition-all duration-500 hover:scale-[1.02] group"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Card decorative elements */}
          <motion.div 
            className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          ></motion.div>
          <motion.div 
            className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-tr rounded-full blur-md group-hover:scale-110 transition-transform duration-500"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          ></motion.div>
          
          {/* Image Content */}
          <div className="relative z-10 flex justify-center">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <Image
                  src="/inicial/Recurso1.webp"
                  alt="Cómo participar de la red - Coalición Nacional"
                  width={500}
                  height={650}
                  className="relative rounded-xl shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+") {
                      target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuMzVlbSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+";
                    }
                  }}
                />
              </div>
            </motion.div>
          </div>
          
          {/* Bottom subtle border */}
          <motion.div 
            className="mt-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.9 }}
            viewport={{ once: true }}
          ></motion.div>
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
