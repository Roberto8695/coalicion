import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard'];
  
  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar si hay un token de sesión en las cookies
    const sessionToken = request.cookies.get('coalicion_session_token');
    const isLoggedIn = request.cookies.get('isLoggedIn');

    // Si no hay token de sesión válido, redirigir al login
    if (!sessionToken || !isLoggedIn || isLoggedIn.value !== 'true') {
      // Crear URL de redirección al login con mensaje de error
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      loginUrl.searchParams.set('message', 'Debes iniciar sesión para acceder al dashboard');
      
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
     * - archivos estáticos en public
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)$',
  ],
};
