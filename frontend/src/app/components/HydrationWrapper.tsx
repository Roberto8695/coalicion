'use client';

import { useEffect } from 'react';

export default function HydrationWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suprimir warnings de hydration causados por extensiones del navegador
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Hydration failed') ||
         args[0].includes('A tree hydrated but some attributes') ||
         args[0].includes('bis_skin_checked') ||
         args[0].includes('bis_size') ||
         args[0].includes('bis_id') ||
         args[0].includes('bis_register') ||
         args[0].includes('__processed_'))
      ) {
        return;
      }
      originalError.call(console, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return <>{children}</>;
}