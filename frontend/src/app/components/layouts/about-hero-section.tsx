"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";


// Predefined positions to avoid hydration mismatch
const particlePositions = [
  { left: 10, top: 20 },
  { left: 85, top: 15 },
  { left: 25, top: 75 },
  { left: 70, top: 80 },
  { left: 45, top: 30 },
  { left: 15, top: 60 },
  { left: 90, top: 45 },
  { left: 35, top: 10 },
  { left: 65, top: 65 },
  { left: 20, top: 40 },
  { left: 80, top: 25 },
  { left: 55, top: 85 },
  { left: 30, top: 55 },
  { left: 75, top: 35 },
  { left: 40, top: 70 },
  { left: 60, top: 20 },
  { left: 5, top: 50 },
  { left: 95, top: 60 },
  { left: 50, top: 5 },
  { left: 75, top: 90 }
];

export function AboutHeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.section
      className="relative min-h-screen pt-20 lg:pt-28 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-[#CBA135]/20 to-red-500/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-red-500/15 to-[#CBA135]/15 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
      />
      
      {/* Floating particles - Only render after mount to avoid hydration issues */}
      {mounted && (
        <div className="absolute inset-0">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#CBA135]/30 rounded-full"
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-montserrat font-bold mb-6">
            <span className="text-white">Conoce</span>{" "}
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Nuestra
            </span>
            <br />
            <span className="text-white">Coalición</span>
          </h1>
          
          <motion.div
            className="w-40 h-1 bg-gradient-to-r from-red-800 to-rose-600 rounded-full mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 160 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-opensans"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Unidos por la transparencia electoral y el fortalecimiento de la democracia en Bolivia.
          Descubre quiénes somos, nuestra misión y nuestros objetivos.
        </motion.p>

        {/* Stats Cards */}
        

        
      </div>
    </motion.section>
  );
}
