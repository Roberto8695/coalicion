// Suprime warnings de hydration causados por extensiones del navegador
export const suppressHydrationWarning = () => {
  if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Hydration failed') ||
         args[0].includes('There was an error while hydrating') ||
         args[0].includes('bis_skin_checked') ||
         args[0].includes('bis_size') ||
         args[0].includes('bis_id'))
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  }
};