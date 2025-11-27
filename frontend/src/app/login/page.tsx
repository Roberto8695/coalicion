"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FormLogin } from './components/FormLogin';

// Componente que maneja los parámetros de búsqueda
function LoginContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Solo mostrar mensajes de error si vienen de intentos fallidos de login
    // NO mostrar para redirecciones automáticas desde middleware
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    const fromLogout = searchParams.get('logout');
    
    // Solo mostrar el mensaje si no es un logout y hay un error específico
    if (error === 'unauthorized' && message && !fromLogout) {
      setErrorMessage(decodeURIComponent(message));
    }
    
    // Limpiar los parámetros de la URL inmediatamente
    if (error || message || fromLogout) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  return (
    <>
      {/* Mostrar mensaje de error si existe */}
      {errorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Acceso No Autorizado</span>
          </div>
          <p className="mt-2 text-sm">{errorMessage}</p>
        </div>
      )}
      
      <FormLogin />
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
        </div>
      }>
        <LoginContent />
      </Suspense>
    </main>
  );
}