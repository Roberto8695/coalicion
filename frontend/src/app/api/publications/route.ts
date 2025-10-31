import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { Publication, publications as currentPublications } from '@/data/publications';

// Ruta del archivo publications.ts
const publicationsPath = join(process.cwd(), 'src', 'data', 'publications.ts');

// Variable en memoria para mantener las publicaciones actualizadas
let publicationsInMemory: Publication[] = [...currentPublications];

// Función para generar un ID único
function generateId(): string {
  return 'pub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Función para leer las publicaciones actuales
async function readPublications(): Promise<Publication[]> {
  return publicationsInMemory;
}

// Función para escribir las publicaciones al archivo
async function writePublications(publications: Publication[]): Promise<void> {
  // Actualizar la variable en memoria
  publicationsInMemory = [...publications];
  
  // Actualizar el archivo
  const fileContent = `export interface Publication {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  url?: string;
}

export const publications: Publication[] = ${JSON.stringify(publications, null, 2)};
`;

  await writeFile(publicationsPath, fileContent, 'utf-8');
}

// GET - Obtener todas las publicaciones
export async function GET() {
  try {
    const publications = await readPublications();
    
    return NextResponse.json({
      success: true,
      data: publications
    });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    return NextResponse.json({
      success: false,
      error: 'Error al obtener las publicaciones'
    }, { status: 500 });
  }
}

// POST - Crear nueva publicación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, title, subtitle, handle, url }: Publication = body;

    // Validaciones
    if (!title || !subtitle || !image) {
      return NextResponse.json({
        success: false,
        error: 'Los campos título, subtítulo e imagen son obligatorios'
      }, { status: 400 });
    }

    // Validar URL si se proporciona
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json({
          success: false,
          error: 'La URL proporcionada no es válida'
        }, { status: 400 });
      }
    }

    const publications = await readPublications();
    
    // Crear nueva publicación con ID único
    const newPublication: Publication = {
      id: generateId(),
      image,
      title,
      subtitle,
      handle: handle || undefined,
      url: url || undefined
    };

    publications.push(newPublication);
    await writePublications(publications);

    return NextResponse.json({
      success: true,
      data: newPublication,
      message: 'Publicación creada exitosamente'
    });

  } catch (error) {
    console.error('Error al crear publicación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar publicación existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updatedData }: { id: string } & Publication = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere el ID de la publicación para actualizar'
      }, { status: 400 });
    }

    // Validaciones
    if (!updatedData.title || !updatedData.subtitle || !updatedData.image) {
      return NextResponse.json({
        success: false,
        error: 'Los campos título, subtítulo e imagen son obligatorios'
      }, { status: 400 });
    }

    // Validar URL si se proporciona
    if (updatedData.url) {
      try {
        new URL(updatedData.url);
      } catch {
        return NextResponse.json({
          success: false,
          error: 'La URL proporcionada no es válida'
        }, { status: 400 });
      }
    }

    const publications = await readPublications();
    
    // Encontrar la publicación a actualizar por ID
    const publicationIndex = publications.findIndex(pub => pub.id === id);
    if (publicationIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Publicación no encontrada'
      }, { status: 404 });
    }

    // Actualizar la publicación manteniendo el ID original
    publications[publicationIndex] = {
      id: id, // Mantener el ID original
      image: updatedData.image,
      title: updatedData.title,
      subtitle: updatedData.subtitle,
      handle: updatedData.handle || undefined,
      url: updatedData.url || undefined
    };

    await writePublications(publications);

    return NextResponse.json({
      success: true,
      data: publications[publicationIndex],
      message: 'Publicación actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar publicación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar publicación
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Se requiere el ID de la publicación a eliminar'
      }, { status: 400 });
    }

    const publications = await readPublications();
    
    // Encontrar la publicación a eliminar por ID
    const publicationIndex = publications.findIndex(pub => pub.id === id);
    if (publicationIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Publicación no encontrada'
      }, { status: 404 });
    }

    // Eliminar la publicación
    const deletedPublication = publications.splice(publicationIndex, 1)[0];
    await writePublications(publications);

    return NextResponse.json({
      success: true,
      data: deletedPublication,
      message: 'Publicación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar publicación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}
