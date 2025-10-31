"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { IconMail, IconLink, IconSend, IconAlertTriangle, IconUser, IconPlus, IconX } from "@tabler/icons-react";

export function ReportsSection() {
  const [formData, setFormData] = useState({
    email: '',
    enlaces: [''] // Array de enlaces, iniciamos con uno vacío
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnlaceChange = (index: number, value: string) => {
    const newEnlaces = [...formData.enlaces];
    newEnlaces[index] = value;
    setFormData(prev => ({
      ...prev,
      enlaces: newEnlaces
    }));
  };

  const addEnlace = () => {
    setFormData(prev => ({
      ...prev,
      enlaces: [...prev.enlaces, '']
    }));
  };

  const removeEnlace = (index: number) => {
    if (formData.enlaces.length > 1) {
      const newEnlaces = formData.enlaces.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        enlaces: newEnlaces
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitMessage('¡Gracias por tu reporte! Nuestro equipo verificará la información y tomará las acciones correspondientes.');
      setFormData({
        email: '',
        enlaces: ['']
      });
    } catch {
      setSubmitMessage('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="reporta-caso"
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
      />
      <motion.div
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-red-400/10 to-[#CBA135]/10 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        viewport={{ once: true }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-montserrat font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-gray-900">Reporta un</span>{" "}
            <span className="bg-gradient-to-r from-[#CBA135] to-[#B8941F] bg-clip-text text-transparent">
              Caso
            </span>
          </motion.h1>

          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          />

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-opensans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Ayúdanos a combatir la desinformación electoral. Reporta contenido falso o engañoso 
            que hayas detectado en redes sociales, medios de comunicación o cualquier plataforma digital.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Information */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Benefits Cards */}
            <div className="space-y-6">
              <motion.div
                className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-[#CBA135]/20 to-red-400/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <IconAlertTriangle className="h-6 w-6 text-[#CBA135]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-2">
                      Desinformación Electoral
                    </h3>
                    <p className="text-gray-600 font-opensans">
                      Reporta contenido falso relacionado con procesos electorales, candidatos, 
                      resultados o procedimientos de votación.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-red-400/20 to-[#CBA135]/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <IconUser className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-montserrat font-semibold text-gray-900 mb-2">
                      Contenido Engañoso
                    </h3>
                    <p className="text-gray-600 font-opensans">
                      Denuncia información manipulada, noticias falsas o contenido que distorsiona 
                      la realidad sobre temas políticos y electorales.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* What we offer */}
            <motion.div
              className="bg-gradient-to-br from-[#CBA135]/5 to-red-400/5 rounded-xl p-8 border border-[#CBA135]/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-montserrat font-semibold text-gray-900 mb-6">
                ¿Cómo ayuda tu reporte?
              </h3>
              <ul className="space-y-3 font-opensans">
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#CBA135] rounded-full"></div>
                  <span className="text-gray-700">Verificación profesional del contenido</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-700">Alertas tempranas a la ciudadanía</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#CBA135] rounded-full"></div>
                  <span className="text-gray-700">Base de datos de desinformación</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-gray-700">Fortalecimiento de la democracia</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-montserrat font-semibold text-gray-900 mb-6 text-center">
              Formulario de Reporte
            </h2>

            {submitMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-opensans">{submitMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-opensans">
                  Correo electrónico *
                </label>
                <div className="relative">
                  <IconMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent transition-all duration-200 font-opensans placeholder:text-gray-400"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Enlaces del contenido denunciado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-opensans">
                  Enlaces del contenido denunciado *
                </label>
                <div className="space-y-3">
                  {formData.enlaces.map((enlace, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <IconLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="url"
                          value={enlace}
                          onChange={(e) => handleEnlaceChange(index, e.target.value)}
                          required={index === 0}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent transition-all duration-200 font-opensans placeholder:text-gray-400"
                          placeholder={`Enlace ${index + 1}: https://ejemplo.com/contenido-falso`}
                        />
                      </div>
                      
                      {/* Botón para remover enlace (solo si hay más de uno) */}
                      {formData.enlaces.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEnlace(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Eliminar enlace"
                        >
                          <IconX className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {/* Botón para agregar más enlaces */}
                  <button
                    type="button"
                    onClick={addEnlace}
                    className="flex items-center space-x-2 text-[#CBA135] hover:text-[#B8941F] font-medium font-opensans transition-colors duration-200"
                  >
                    <IconPlus className="h-5 w-5" />
                    <span>Agregar otro enlace</span>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#CBA135] to-[#B8941F] text-white font-semibold font-montserrat py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Enviando reporte...</span>
                  </>
                ) : (
                  <>
                    <IconSend className="h-5 w-5" />
                    <span>Enviar Reporte</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Additional info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-opensans text-center">
                Tu reporte será revisado por nuestro equipo de verificación en un plazo de 24 horas.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Contact Section - Súmate a la Coalición */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-[#CBA135]/5 to-red-400/5 rounded-2xl p-8 lg:p-12 border border-[#CBA135]/20 text-center">
            
            <motion.p
              className="text-lg text-gray-600 mb-8 font-opensans max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
             
            </motion.p>

            {/* Contact Info Card */}
            <motion.div
              className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <IconUser className="h-5 w-5 text-[#CBA135]" />
                  <span className="font-montserrat font-semibold text-gray-900">
                    María Elena Rodríguez
                  </span>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <IconMail className="h-5 w-5 text-red-600" />
                  <span className="font-opensans text-gray-700">
                    coordinacion@coalicionbolivia.org
                  </span>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-[#CBA135] to-red-600 rounded-full"></div>
                  </div>
                  <span className="font-opensans text-gray-700">
                    Coalición Nacional Contra la Desinformación Electoral
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.button
              className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-semibold font-montserrat px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open('mailto:coordinacion@coalicionbolivia.org?subject=Interés en unirse a la Coalición&body=Hola, estoy interesado/a en unirme a la Coalición Nacional Contra la Desinformación Electoral. Me gustaría obtener más información sobre cómo participar.', '_blank')}
            >
              <IconUser className="h-5 w-5" />
              <span>Súmate a la Coalición</span>
            </motion.button>

            <motion.p
              className="text-sm text-gray-500 mt-4 font-opensans"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              Haz clic para enviar un correo y obtener más información
            </motion.p>
          </div>
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
