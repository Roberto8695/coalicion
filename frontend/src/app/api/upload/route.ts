import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No se recibió ningún archivo' 
      }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP, GIF' 
      }, { status: 400 });
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        success: false, 
        error: 'El archivo es demasiado grande. Máximo 5MB' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    
    // Ruta donde se guardará el archivo
    const uploadsPath = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadsPath, fileName);

    // Guardar el archivo
    await writeFile(filePath, buffer);

    // Retornar la URL relativa del archivo
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName,
      originalName: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor al subir el archivo'
    }, { status: 500 });
  }
}
