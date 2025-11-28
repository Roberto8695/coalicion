'use client';

import { useEffect } from 'react';

export default function HydrationWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Supresión completa de warnings de hydration causados por extensiones
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Lista completa de patrones de Bitdefender y otras extensiones
    const extensionPatterns = [
      'bis_skin_checked',
      'bis_size', 
      'bis_id',
      'bis_register',
      'TrafficLight',
      'Hydration failed',
      'A tree hydrated but some attributes',
      'SSR-ed Client Component',
      'server rendered HTML didn\'t match',
      'browser extension',
      'Extension',
      'Bitdefender',
      '__processed_',
      'data-bis-',
      'adblock'
    ];
    
    const shouldSuppress = (message: string) => {
      return extensionPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      );
    };
    
    console.error = (...args: unknown[]) => {
      const message = typeof args[0] === 'string' ? args[0] : String(args[0]);
      if (shouldSuppress(message)) {
        return;
      }
      originalError.call(console, ...args);
    };
    
    console.warn = (...args: unknown[]) => {
      const message = typeof args[0] === 'string' ? args[0] : String(args[0]);
      if (shouldSuppress(message)) {
        return;
      }
      originalWarn.call(console, ...args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return <>{children}</>;
}