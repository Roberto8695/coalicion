import { motion, AnimatePresence } from "motion/react";
import { IconX, IconShield, IconWorld, IconNews, IconUser, IconMail, IconArrowRight } from "@tabler/icons-react";

interface ContactoModalProps {
  open: boolean;
  onClose: () => void;
}

const contactOptions = [
  {
    icon: IconShield,
    title: "Adhesiones a la Coalición",
    description: "Si tu organización está interesada en formar parte de nuestra coalición, contáctanos para conocer los requisitos y procesos de adhesión.",
    bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-700",
    borderColor: "border-red-200"
  },
  {
    icon: IconWorld,
    title: "Organizaciones Internacionales",
    description: "Intercambio de experiencias y buenas prácticas en la lucha contra la desinformación electoral.",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    iconBg: "bg-red-100",
    iconColor: "text-red-800",
    borderColor: "border-red-300"
  },
  {
    icon: IconNews,
    title: "Medios de Comunicación",
    description: "Consultas sobre nuestras actividades, declaraciones o solicitudes de entrevistas.",
    bgColor: "bg-gradient-to-br from-rose-50 to-red-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-700",
    borderColor: "border-rose-200"
  },
  {
    icon: IconUser,
    title: "Ciudadanía",
    description: "Información sobre nuestras actividades, recursos educativos y herramientas disponibles.",
    bgColor: "bg-gradient-to-br from-red-100 to-rose-100",
    iconBg: "bg-red-200",
    iconColor: "text-red-900",
    borderColor: "border-red-300"
  }
];

export default function ContactoModal({ open, onClose }: ContactoModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-white/20"
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-br from-red-400/10 to-rose-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-full blur-3xl"></div>
            
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="text-center mb-8 sm:mb-12">
                <button 
                  onClick={onClose} 
                  className="absolute right-3 top-3 sm:right-6 sm:top-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                >
                  <IconX size={16} className="sm:hidden" />
                  <IconX size={20} className="hidden sm:block" />
                </button>
                
                <motion.h2 
                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-regular mb-4 sm:mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-gray-900">¿Cómo </span>
                  <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                    Contactarnos
                  </span>
                  <span className="text-gray-900">?</span>
                </motion.h2>
                
                <motion.div 
                  className="w-16 sm:w-24 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full mx-auto mb-3 sm:mb-4"
                  initial={{ width: 0 }}
                  animate={{ width: 96 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
                
                <motion.p 
                  className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Estamos aquí para responder tus consultas y fortalecer nuestra red contra la desinformación
                </motion.p>
              </div>

              {/* Contact Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
                {contactOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className={`${option.bgColor} ${option.borderColor} border rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] relative overflow-hidden`}>
                      {/* Card background decoration */}
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full blur-xl transform translate-x-4 sm:translate-x-6 -translate-y-4 sm:-translate-y-6"></div>
                      
                      <div className="relative">
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className={`${option.iconBg} ${option.iconColor} w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                            <option.icon size={20} className="sm:hidden" />
                            <option.icon size={24} className="hidden sm:block" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-300">
                              {option.title}
                            </h3>
                          </div>
                          <IconArrowRight className="text-gray-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all duration-300" size={18} />
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact CTA Section */}
              <motion.div 
                className="bg-gradient-to-r from-red-700 to-red-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center text-white relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl transform -translate-x-6 sm:-translate-x-8 -translate-y-6 sm:-translate-y-8"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-xl transform translate-x-4 sm:translate-x-6 translate-y-4 sm:translate-y-6"></div>
                
                <div className="relative">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                    ¡Conectemos y Trabajemos Juntos!
                  </h3>
                  
                  <p className="text-red-100 mb-4 sm:mb-6 text-base sm:text-lg max-w-2xl mx-auto">
                    Tu participación es fundamental para fortalecer la democracia boliviana
                  </p>
                  
                  <motion.a
                    href="mailto:contacto@facto.bo"
                    className="inline-flex items-center gap-2 sm:gap-3 bg-white text-red-800 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-105 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconMail size={20} className="sm:hidden" />
                    <IconMail size={24} className="hidden sm:block" />
                    <span className="text-lg sm:text-xl">contacto@facto.bo</span>
                    <IconArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}