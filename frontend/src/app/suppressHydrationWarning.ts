// Supresión global y agresiva de warnings de hydration
export const suppressHydrationWarning = () => {
  if (typeof window !== 'undefined') {
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalLog = console.log;
    
    // Patrones más extensos para capturar todo tipo de warnings de extensiones
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
      /extension/i,
      /__processed_/i,
      /data-bis-/i,
      /adblock/i,
      /tree hydrated/i,
      /didn't match/i
    ];
    
    const shouldSuppress = (args: unknown[]) => {
      const message = String(args[0] || '');
      return suppressPatterns.some(pattern => pattern.test(message));
    };
    
    console.error = (...args: unknown[]) => {
      if (!shouldSuppress(args)) {
        originalError(...args);
      }
    };
    
    console.warn = (...args: unknown[]) => {
      if (!shouldSuppress(args)) {
        originalWarn(...args);
      }
    };
    
    console.log = (...args: unknown[]) => {
      if (!shouldSuppress(args)) {
        originalLog(...args);
      }
    };
    
    // Restaurar en cleanup
    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      console.log = originalLog;
    };
  }
};