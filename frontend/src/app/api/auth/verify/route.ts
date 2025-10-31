import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // Verificar si el token existe y es válido
    // Por ahora usamos una verificación simple, pero puedes expandir esto
    if (!token || token !== 'coalicion_session_token') {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Token válido', isAuthenticated: true },
      { status: 200 }
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Verificar autenticación desde cookies o headers
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (token !== 'coalicion_session_token') {
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { message: 'Usuario autenticado', isAuthenticated: true },
    { status: 200 }
  );
}
