'use client';

import { useEffect } from 'react';

export function GlobalHydrationSuppressor() {
  useEffect(() => {
    // Solo en desarrollo y en el cliente
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Patrones de regex más agresivos para capturar TODOS los casos
    const suppressPatterns = [
      /hydration/i,
      /bis_skin_checked/i,
      /bis_size/i, 
      /bis_id/i,
      /bis_register/i,
      /trafficlight/i,
      /bitdefender/i,
      /server rendered html/i,
      /ssr-ed client component/i,
      /browser extension/i,
      /tree hydrated/i,
      /didn't match/i,
      /client properties/i,
      /won't be patched/i,
      /messes with the html/i,
      /__processed_/i
    ];
    
    const shouldSuppress = (message: string) => {
      return suppressPatterns.some(pattern => pattern.test(message));
    };
    
    // Override console.error
    console.error = (...args: unknown[]) => {
      const message = String(args[0] || '');
      if (shouldSuppress(message)) {
        return; // Suprimir completamente
      }
      originalError.apply(console, args);
    };
    
    // Override console.warn
    console.warn = (...args: unknown[]) => {
      const message = String(args[0] || '');
      if (shouldSuppress(message)) {
        return; // Suprimir completamente
      }
      originalWarn.apply(console, args);
    };

    // Cleanup function
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return null; // No renderiza nada
}