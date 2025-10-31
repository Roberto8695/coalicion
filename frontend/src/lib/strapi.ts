/**
 * Servicio para conectar con Strapi CMS
 * Configuración y funciones para obtener datos de las colecciones
 */

// URL base de tu instancia de Strapi
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Configuración base para las peticiones
const strapiConfig = {
  headers: {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` })
  }
};

// Función helper para construir URLs con populate
function buildStrapiUrl(endpoint: string, populate?: string[], filters?: Record<string, string>, sort?: string) {
  const url = new URL(`/api/${endpoint}`, STRAPI_URL);
  
  if (populate && populate.length > 0) {
    url.searchParams.append('populate', populate.join(','));
  }
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(`filters[${key}][$eq]`, value);
      }
    });
  }
  
  if (sort) {
    url.searchParams.append('sort', sort);
  }
  
  return url.toString();
}

// Función helper para obtener la URL completa de un archivo de Strapi
export function getStrapiMediaUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

/**
 * Obtener publicaciones desde Strapi
 */
export async function getPublicaciones(featured?: boolean, limit?: number) {
  try {
    const filters: Record<string, string> = {};
    if (featured !== undefined) {
      filters.featured = featured.toString();
    }
    
    const url = buildStrapiUrl(
      'publicaciones', 
      [],
      filters,
      'date:desc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching publicaciones: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        description: item.description,
        type: item.type,
        category: item.category,
        date: item.date,
        author: item.author,
        pages: item.pages,
        downloadUrl: item.downloadUrl,
        downloadFile: item.downloadFile,
        featured: item.featured,
        tags: item.tags || [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching publicaciones:', error);
    return [];
  }
}

/**
 * Obtener noticias desde Strapi
 */
export async function getNoticias(status?: string, limit?: number) {
  try {
    const filters: Record<string, string> = {};
    if (status) {
      filters.status = status;
    }
    
    const url = buildStrapiUrl(
      'noticias', 
      [],
      filters,
      'date:desc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching noticias: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        description: item.description,
        type: item.type,
        date: item.date,
        location: item.location,
        organizer: item.organizer,
        participants: item.participants,
        url: item.url,
        status: item.status,
        featured: item.featured,
        image: item.image,
        imageFile: item.imageFile,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return [];
  }
}

/**
 * Obtener guías electorales desde Strapi
 */
export async function getGuiasElectorales(category?: string, limit?: number) {
  try {
    const filters: Record<string, string> = {};
    if (category) {
      filters.category = category;
    }
    
    const url = buildStrapiUrl(
      'guias-electorales', 
      ['*'], // populate todas las relaciones
      filters,
      'date:desc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching guias-electorales: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        description: item.description,
        type: item.type,
        size: item.size,
        downloadUrl: item.downloadUrl,
        downloadFile: item.downloadFile,
        previewUrl: item.previewUrl,
        date: item.date,
        category: item.category,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching guias-electorales:', error);
    return [];
  }
}

/**
 * Obtener recursos multimedia desde Strapi
 */
export async function getMultimedia(category?: string, type?: string, limit?: number) {
  try {
    const filters: Record<string, string> = {};
    if (category) {
      filters.category = category;
    }
    if (type) {
      filters.type = type;
    }
    
    const url = buildStrapiUrl(
      'multimedias', 
      ['*'],  // Populate all relations including thumbnail
      filters,
      'createdAt:desc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching multimedias: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        description: item.description,
        type: item.type,
        category: item.category,
        thumbnail: item.thumbnail,
        thumbnailFile: item.thumbnailFile,
        downloadUrl: item.downloadUrl,
        downloadFile: item.downloadFile,
        previewUrl: item.previewUrl,
        duration: item.duration,
        format: item.format || "Desconocido",
        size: item.size || "N/A",
        tags: item.tags || [],
        featured: item.featured || false,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching multimedias:', error);
    return [];
  }
}

/**
 * Obtener eventos/agenda desde Strapi
 */
export async function getEventos(type?: string, limit?: number) {
  try {
    const filters: Record<string, string> = {};
    if (type) {
      filters.type = type;
    }
    
    const url = buildStrapiUrl(
      'eventos', 
      ['*'], // populate todas las relaciones (imágenes, archivos, etc.)
      filters,
      'date:asc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching eventos: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        type: item.type,
        date: item.date,
        time: item.time,
        location: item.location,
        description: item.description,
        duration: item.duration,
        capacity: item.capacity,
        registrationUrl: item.registrationUrl,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching eventos:', error);
    return [];
  }
}

/**
 * Obtener verificadores desde Strapi
 */
export async function getVerificadores(isActive?: boolean, limit?: number) {
  try {
    const filters: Record<string, string> = {};
    if (isActive !== undefined) {
      filters.isActive = isActive.toString();
    }
    
    const url = buildStrapiUrl(
      'verificadores', 
      [],
      filters,
      'name:asc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching verificadores: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
        description: item.description,
        type: item.type,
        url: item.url,
        logo: item.logo,
        logoFile: item.logoFile,
        features: item.features || [],
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching verificadores:', error);
    return [];
  }
}

// Cache simple para evitar requests duplicados
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();
  
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return Promise.resolve(cached.data);
  }
  
  return fetcher().then(data => {
    cache.set(key, { data, timestamp: now });
    return data;
  });
}