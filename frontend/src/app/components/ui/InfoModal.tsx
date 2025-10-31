"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconX } from "@tabler/icons-react";

interface ModalInfo {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalInfo: ModalInfo | null;
}

export function InfoModal({ isOpen, onClose, modalInfo }: InfoModalProps) {
  if (!modalInfo) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header con gradiente según el color del botón */}
              <div className={`px-8 py-6 ${modalInfo.color} relative overflow-hidden`}>
                {/* Elementos decorativos */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="text-4xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {modalInfo.icon}
                    </motion.div>
                    <motion.h2 
                      className="text-2xl lg:text-3xl font-montserrat font-bold text-white"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {modalInfo.title}
                    </motion.h2>
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <IconX className="h-6 w-6 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <motion.div 
                className="px-8 py-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <p className="text-lg text-gray-700 leading-relaxed font-opensans">
                  {modalInfo.description}
                </p>

                {/* Bottom decorative border */}
                <motion.div 
                  className="mt-8 h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.6 }}
                />

                {/* Action Button */}
                <motion.div 
                  className="mt-6 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <button
                    onClick={onClose}
                    className={`px-8 py-3 ${modalInfo.color} text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-montserrat`}
                  >
                    Entendido
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
