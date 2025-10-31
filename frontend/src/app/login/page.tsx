"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormLogin } from './components/FormLogin';

// Componente que maneja los parámetros de búsqueda
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Verificar si hay un mensaje de error en los parámetros de URL
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    
    if (error === 'unauthorized' && message) {
      setErrorMessage(decodeURIComponent(message));
      
      // Limpiar los parámetros de la URL después de mostrar el mensaje
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const handleLogin = (email: string, password: string) => {
    // Aquí puedes agregar la lógica de autenticación
    console.log('Login attempt:', { email, password });
    
    // Credenciales para diferentes dashboards
    const credentials = [
      {
        email: 'dashboard@coalicion.bo',
        password: 'dashboard2025',
        redirectTo: '/dashboard', // Dashboard interno
        userType: 'local'
      },
      {
        email: 'admin@coalicion.bo',
        password: 'coalicion2025',
        redirectTo: 'https://dashboard-disinfo-production.up.railway.app/',
        userType: 'external'
      }
    ];

    // Buscar credenciales válidas
    const validUser = credentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (validUser) {
      if (validUser.userType === 'local') {
        // Para usuario local - guardar estado de autenticación
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Establecer cookies para el middleware
        document.cookie = 'isLoggedIn=true; path=/; max-age=86400'; // 24 horas
        document.cookie = 'coalicion_session_token=coalicion_session_token; path=/; max-age=86400';
        
        // Redirigir al dashboard interno después de un breve delay
        setTimeout(() => {
          router.push(validUser.redirectTo);
        }, 2000);
      } else {
        // Para usuario externo - redirigir en la misma ventana
        setTimeout(() => {
          window.location.href = validUser.redirectTo;
        }, 2000);
      }
      
      // Si las credenciales son válidas, retornar true para mostrar modal de éxito
      return true;
    } else {
      // Si las credenciales no son válidas, retornar false para mostrar modal de error
      return false;
    }
  };

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
      
      <FormLogin onLogin={handleLogin} />
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