"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconCheck, IconX, IconClock, IconAlertCircle } from '@tabler/icons-react';
import Image from 'next/image';

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  userEmail?: string;
  errorMessage?: string;
  autoCloseDelay?: number;
}

export function ModalLogin({ 
  isOpen, 
  onClose, 
  type = 'success',
  userEmail = 'admin@coalicion.bo',
  errorMessage = 'Credenciales incorrectas',
  autoCloseDelay = 5000 
}: ModalLoginProps) {
  const [progress, setProgress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(Math.floor(autoCloseDelay / 1000));

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      setTimeLeft(Math.floor(autoCloseDelay / 1000));
      return;
    }

    // Solo auto-cerrar en caso de éxito
    if (type === 'success') {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (autoCloseDelay / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
        
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            // Usar setTimeout para evitar actualizar estado durante renderizado
            setTimeout(() => onClose(), 0);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, onClose, autoCloseDelay, type]);

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              duration: 0.5 
            }}
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header dinámico */}
              <div className={`relative px-8 pt-8 pb-6 ${
                isSuccess 
                  ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50' 
                  : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50'
              }`}>
                {/* Círculos decorativos animados */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className={`absolute -top-4 -right-4 w-24 h-24 rounded-full ${
                      isSuccess 
                        ? 'bg-gradient-to-br from-green-200/30 to-emerald-300/30' 
                        : 'bg-gradient-to-br from-red-200/30 to-rose-300/30'
                    }`}
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className={`absolute -bottom-2 -left-2 w-16 h-16 rounded-full ${
                      isSuccess 
                        ? 'bg-gradient-to-br from-teal-200/30 to-green-300/30' 
                        : 'bg-gradient-to-br from-pink-200/30 to-red-300/30'
                    }`}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [360, 180, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  />
                </div>

                {/* Botón cerrar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10"
                >
                  <IconX className="w-4 h-4 text-gray-600" />
                </button>

                {/* Ícono dinámico animado */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                  }}
                >
                  <div className="relative">
                    <motion.div
                      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                        isSuccess 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-br from-red-500 to-rose-600'
                      }`}
                      animate={{ 
                        boxShadow: isSuccess 
                          ? [
                              "0 10px 25px rgba(34, 197, 94, 0.3)",
                              "0 15px 35px rgba(34, 197, 94, 0.4)",
                              "0 10px 25px rgba(34, 197, 94, 0.3)"
                            ]
                          : [
                              "0 10px 25px rgba(239, 68, 68, 0.3)",
                              "0 15px 35px rgba(239, 68, 68, 0.4)",
                              "0 10px 25px rgba(239, 68, 68, 0.3)"
                            ]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                      >
                        {isSuccess ? (
                          <IconCheck className="w-10 h-10 text-white" strokeWidth={3} />
                        ) : (
                          <IconAlertCircle className="w-10 h-10 text-white" strokeWidth={3} />
                        )}
                      </motion.div>
                    </motion.div>
                    
                    {/* Anillo animado */}
                    <motion.div
                      className={`absolute inset-0 border-4 rounded-full ${
                        isSuccess ? 'border-green-300' : 'border-red-300'
                      }`}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.3, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </motion.div>

                {/* Título dinámico */}
                <motion.h2
                  className="text-2xl font-montserrat font-bold text-center text-gray-900 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  {isSuccess ? '¡Inicio de sesión exitoso!' : '¡Error de autenticación!'}
                </motion.h2>

                {/* Línea decorativa */}
                <motion.div
                  className={`w-16 h-1 rounded-full mx-auto ${
                    isSuccess 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-r from-red-500 to-rose-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>

              {/* Contenido principal */}
              <div className="px-8 py-6">
                {isSuccess ? (
                  <>
                    {/* Mensaje de éxito con contador */}
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p className="text-gray-600 mb-4">
                        Bienvenido <span className="font-semibold text-[#CBA135]">{userEmail}</span>. 
                        Tu sesión se ha iniciado correctamente.
                      </p>
                      
                      {/* Tiempo restante con progreso */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-2 mb-3">
                          <IconClock className="w-5 h-5 text-blue-600" />
                          <span className="text-blue-800 font-medium">
                            Redirigiendo al panel en {timeLeft}s
                          </span>
                        </div>
                        
                        {/* Barra de progreso */}
                        <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                          />
                        </div>
                        <p className="text-blue-700 text-xs mt-2 text-center">
                          Serás redirigido automáticamente al dashboard...
                        </p>
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <>
                    {/* Mensaje de error */}
                    <motion.div
                      className="text-center mb-6"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p className="text-gray-700 mb-3 font-medium">
                        {errorMessage}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Por favor, verifica tu correo electrónico y contraseña, 
                        luego intenta nuevamente.
                      </p>
                    </motion.div>

                    {/* Botón para cerrar en caso de error */}
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-900 hover:to-rose-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Intentar nuevamente
                      </button>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Footer con logo */}
              <motion.div
                className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/inicial/Recurso1.webp"
                      alt="Coalición Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-[#CBA135]">Coalición Nacional</span>
                    </p>
                    <p className="text-xs text-gray-500">Panel de Administración</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
