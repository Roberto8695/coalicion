"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userEmail = localStorage.getItem('userEmail');
      
      // Verificar también las cookies
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const hasValidSession = isLoggedIn === 'true' && 
                             userEmail && 
                             cookies.isLoggedIn === 'true' && 
                             cookies.coalicion_session_token;

      if (!hasValidSession) {
        // Redirigir al login con mensaje de error
        router.push('/login?error=unauthorized&message=' + 
          encodeURIComponent('Tu sesión ha expirado o no tienes permisos para acceder a esta página'));
        return;
      }

      setIsAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  // Mostrar loading mientras verifica
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135] mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}
