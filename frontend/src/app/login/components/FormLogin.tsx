"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { IconEye, IconEyeOff, IconUser, IconLock, IconLogin } from '@tabler/icons-react';
import Image from 'next/image';
import { ModalLogin } from './ModalLogin';

interface FormData {
  email: string;
  password: string;
}

interface FormLoginProps {
  onLogin?: (email: string, password: string) => void;
}

export function FormLogin({ onLogin }: FormLoginProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');

  // Credenciales de prueba - múltiples usuarios
  const testCredentials = [
    {
      email: 'dashboard@coalicion.bo',
      password: 'dashboard2025',
      name: 'Dashboard Local'
    },
    {
      email: 'admin@coalicion.bo',
      password: 'coalicion2025',
      name: 'Admin Desinformación'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simular autenticación
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Verificar credenciales de prueba
      const validUser = testCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );
      
      if (validUser) {
        setModalType('success');
        setShowModal(true);
        
        // Llamar a la función onLogin que maneja la redirección
        if (onLogin) {
          onLogin(formData.email, formData.password);
        }
      } else {
        setErrors({
          email: 'Credenciales incorrectas',
          password: 'Credenciales incorrectas'
        });
        setModalType('error');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error en login:', error);
      setModalType('error');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo y Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex justify-center mb-6">
            <div className="relative ">
              <Image
                src="/inicial/Recurso1.webp"
                alt="Coalición Logo"
           width={150}
           height={40}
                className="object-contain"
                priority
               
              />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-gray-900 mb-2">
            Bienvenido a <span className="text-[#CBA135]">Coalición</span>
          </h1>
          
          <motion.div 
            className="w-16 h-1 bg-gradient-to-r from-red-800 to-rose-800 rounded-full mx-auto mb-4"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          <p className="text-gray-600">
            Accede al panel de administración
          </p>
        </motion.div>

        {/* Formulario */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
         

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 text-black/80 bg-gray-50 border rounded-xl placeholder:text-black/40 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200 focus:ring-red-800/20 focus:border-red-800 hover:border-gray-300'
                  }`}
                  placeholder="ejemplo@correo.com"
                />
              </div>
              {errors.email && (
                <motion.p 
                  className="mt-2 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Campo Contraseña */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 text-black/80  bg-gray-50 border rounded-xl focus:outline-none placeholder:text-black/40 focus:ring-2 transition-all duration-300 ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200 focus:ring-red-800/20 focus:border-red-800 hover:border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <IconEyeOff className="w-5 h-5" />
                  ) : (
                    <IconEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  className="mt-2 text-sm text-red-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Botón Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-900 hover:to-rose-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <IconLogin className="w-5 h-5" />
                  <span>Iniciar Sesión</span>
                </>
              )}
            </motion.button>
          </form>

          
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>© 2025 Coalición Nacional. Todos los derechos reservados.</p>
        </motion.div>
      </motion.div>

      {/* Modal de resultado */}
      <ModalLogin
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          if (modalType === 'error') {
            setErrors({});
          }
        }}
        type={modalType}
        userEmail={formData.email}
        errorMessage={modalType === 'error' ? 'Credenciales incorrectas. Verifica tu correo electrónico y contraseña.' : undefined}
        autoCloseDelay={5000}
      />
    </div>
  );
}