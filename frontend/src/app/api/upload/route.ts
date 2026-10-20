import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({
      success: false,
      error: 'La subida local del frontend fue desactivada. Usa el backend para almacenar archivos en el VPS.'
    }, { status: 410 });

  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al procesar la subida'
    }, { status: 500 });
  }
}
