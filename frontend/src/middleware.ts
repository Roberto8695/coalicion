import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
  
  // Rutas que NO requieren autenticación (rutas públicas)
  const publicRoutes = ['/', '/login', '/about-us', '/publicaciones', '/recursos', '/actua', '/institucional'];
  
  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || (route === '/' && pathname === '/')
  );
  
  // Si es una ruta pública, permitir el acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar si hay un token de autenticación
    const authToken = request.cookies.get('authToken')?.value;
    
    // Si no hay token válido, redirigir al login
    if (!authToken || authToken.trim() === '') {
      // Redirigir al login sin mensaje de error para evitar mostrar
      // mensajes cuando el usuario está haciendo logout
      const loginUrl = new URL('/login', request.url);
      
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configurar qué rutas debe interceptar el middleware
export const config = {
  matcher: [
    /*
     * Interceptar todas las rutas excepto:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - archivos estáticos en public (.png, .jpg, .css, .js, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
