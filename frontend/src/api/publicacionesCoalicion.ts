import { api, getAssetUrl } from './config';

// Función específica para construir URLs de imágenes de publicaciones de coalición
const getPublicacionCoalicionImageUrl = (imagen: string | File | null | undefined): string | null => {
  if (!imagen) return null;
  
  // Si es un File (para casos de CMS), crear URL temporal
  if (typeof imagen !== 'string') {
    return URL.createObjectURL(imagen);
  }
  
  // Si ya es una URL completa (incluyendo Cloudinary), devolverla tal como está
  if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
    return imagen;
  }
  
  // Si ya empieza con /uploads, usar getAssetUrl normal (para imágenes legacy)
  if (imagen.startsWith('/uploads')) {
    return getAssetUrl(imagen);
  }
  
  // Si es solo un nombre de archivo, construir la ruta completa (legacy)
  return getAssetUrl(`/uploads/infografia/jpg/${imagen}`);
};

export interface PublicacionCoalicion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_publi: string;
  url?: string;
  imagen?: string | File | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePublicacionCoalicion {
  titulo: string;
  descripcion: string;
  fecha_publi: string;
  url?: string;
  imagen?: File;
}

export interface UpdatePublicacionCoalicion {
  titulo?: string;
  descripcion?: string;
  fecha_publi?: string;
  url?: string;
  imagen?: File;
}

export interface PublicacionCoalicionFilters {
  search?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
  limit?: number;
}

export interface PublicacionCoalicionStats {
  total: number;
  recent: number;
  withImage: number;
  withUrl: number;
}

class PublicacionesCoalicionService {
  private endpoint = '/publicaciones-coalicion';

  // Obtener todas las publicaciones con filtros
  async getAll(filters: PublicacionCoalicionFilters = {}) {
    const response = await api.get(this.endpoint, { params: filters });
    
    // Verificar la estructura de la respuesta
    if (!response?.data) {
      console.warn('Respuesta de API inválida:', response);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    }

    return {
      ...response,
      data: Array.isArray(response.data) 
        ? response.data.map((pub: PublicacionCoalicion) => ({
            ...pub,
            imagen: getPublicacionCoalicionImageUrl(pub.imagen)
          }))
        : []
    };
  }

  // Obtener publicaciones con filtros específicos
  async getAllWithFilters(filters: PublicacionCoalicionFilters = {}) {
    const response = await api.get(`${this.endpoint}/with-filters`, { params: filters });
    
    // Verificar la estructura de la respuesta
    if (!response?.data) {
      console.warn('Respuesta de API inválida:', response);
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    }

    return {
      ...response,
      data: Array.isArray(response.data) 
        ? response.data.map((pub: PublicacionCoalicion) => ({
            ...pub,
            imagen: getPublicacionCoalicionImageUrl(pub.imagen)
          }))
        : []
    };
  }

  // Obtener publicación por ID
  async getById(id: number) {
    const response = await api.get(`${this.endpoint}/${id}`);
    
    if (!response?.data) {
      throw new Error('Publicación no encontrada');
    }

    return {
      ...response,
      data: {
        ...response.data,
        imagen: getPublicacionCoalicionImageUrl(response.data.imagen)
      }
    };
  }

  // Obtener publicaciones recientes
  async getRecent(limit: number = 5) {
    const response = await api.get(`${this.endpoint}/recent`, { params: { limit } });
    
    if (!response?.data) {
      return {
        success: false,
        data: []
      };
    }

    return {
      ...response,
      data: Array.isArray(response.data) 
        ? response.data.map((pub: PublicacionCoalicion) => ({
            ...pub,
            imagen: getPublicacionCoalicionImageUrl(pub.imagen)
          }))
        : []
    };
  }

  // Buscar publicaciones
  async search(searchTerm: string, page: number = 1, limit: number = 10) {
    const response = await api.get(`${this.endpoint}/search`, {
      params: { q: searchTerm, page, limit }
    });
    
    if (!response?.data) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    }

    return {
      ...response,
      data: Array.isArray(response.data) 
        ? response.data.map((pub: PublicacionCoalicion) => ({
            ...pub,
            imagen: getPublicacionCoalicionImageUrl(pub.imagen)
          }))
        : []
    };
  }

  // Obtener por rango de fechas
  async getByDateRange(fechaDesde: string, fechaHasta: string, page: number = 1, limit: number = 10) {
    const response = await api.get(`${this.endpoint}/date-range`, {
      params: { fecha_desde: fechaDesde, fecha_hasta: fechaHasta, page, limit }
    });
    
    if (!response?.data) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    }

    return {
      ...response,
      data: Array.isArray(response.data) 
        ? response.data.map((pub: PublicacionCoalicion) => ({
            ...pub,
            imagen: getPublicacionCoalicionImageUrl(pub.imagen)
          }))
        : []
    };
  }

  // Obtener estadísticas
  async getStats(): Promise<{ success: boolean; data: PublicacionCoalicionStats }> {
    try {
      const response = await api.get(`${this.endpoint}/stats`);
      
      // Como el interceptor de axios ya extrae response.data, trabajamos directamente con eso
      // La respuesta ya es el objeto JSON del backend
      if (!response || !response.data) {
        return {
          success: false,
          data: {
            total: 0,
            recent: 0,
            withImage: 0,
            withUrl: 0
          }
        };
      }

      return {
        success: true, // Siempre true si llegamos aquí sin error
        data: response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        success: false,
        data: {
          total: 0,
          recent: 0,
          withImage: 0,
          withUrl: 0
        }
      };
    }
  }

  // Crear nueva publicación
  async create(publicacionData: CreatePublicacionCoalicion) {
    const formData = new FormData();
    
    // Agregar campos de texto
    formData.append('titulo', publicacionData.titulo);
    formData.append('descripcion', publicacionData.descripcion);
    formData.append('fecha_publi', publicacionData.fecha_publi);
    
    if (publicacionData.url) {
      formData.append('url', publicacionData.url);
    }
    
    // Agregar imagen si existe
    if (publicacionData.imagen) {
      formData.append('imagen', publicacionData.imagen);
    }

    const response = await api.post(`${this.endpoint}/dashboard/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response?.data) {
      throw new Error('Error al crear la publicación');
    }

    return {
      ...response,
      data: {
        ...response.data,
        imagen: getPublicacionCoalicionImageUrl(response.data.imagen)
      }
    };
  }

  // Actualizar publicación
  async update(id: number, publicacionData: UpdatePublicacionCoalicion) {
    console.log('🔧 Actualizando publicación:', id);
    console.log('📝 Datos a enviar:', {
      titulo: publicacionData.titulo,
      descripcion: publicacionData.descripcion,
      fecha_publi: publicacionData.fecha_publi,
      url: publicacionData.url,
      hasImage: !!publicacionData.imagen
    });
    
    try {
      const formData = new FormData();
      
      // Solo agregar campos que no sean undefined
      if (publicacionData.titulo !== undefined) {
        formData.append('titulo', publicacionData.titulo);
      }
      if (publicacionData.descripcion !== undefined) {
        formData.append('descripcion', publicacionData.descripcion);
      }
      if (publicacionData.fecha_publi !== undefined) {
        formData.append('fecha_publi', publicacionData.fecha_publi);
      }
      if (publicacionData.url !== undefined) {
        formData.append('url', publicacionData.url);
      }
      
      // Agregar imagen si existe y es un archivo válido
      if (publicacionData.imagen && publicacionData.imagen instanceof File) {
        console.log('📷 Agregando archivo a FormData:', {
          name: publicacionData.imagen.name,
          type: publicacionData.imagen.type,
          size: publicacionData.imagen.size
        });
        formData.append('imagen', publicacionData.imagen);
      } else if (publicacionData.imagen) {
        console.warn('⚠️ Imagen no es un archivo válido:', typeof publicacionData.imagen);
      }

      // Debug: Mostrar contenido de FormData
      console.log('📤 FormData contents:');
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`  ${pair[0]}: File(${pair[1].name}, ${pair[1].size} bytes)`);
        } else {
          console.log(`  ${pair[0]}: ${pair[1]}`);
        }
      }

      console.log('🚀 API Request: PUT', `${this.endpoint}/dashboard/${id}/upload`);
      const response = await api.put(`${this.endpoint}/dashboard/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response?.data) {
        throw new Error('Error al actualizar la publicación');
      }

      return {
        ...response,
        data: {
          ...response.data,
          imagen: getPublicacionCoalicionImageUrl(response.data.imagen)
        }
      };
    } catch (error) {
      console.error('❌ Error en update service:', error);
      throw error;
    }
  }

  // Eliminar publicación
  async delete(id: number) {
    const response = await api.delete(`${this.endpoint}/dashboard/${id}`);
    return response;
  }
}

export const publicacionesCoalicionService = new PublicacionesCoalicionService();
