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
function buildStrapiUrl(endpoint: string, populate?: string[], filters?: Record<string, any>, sort?: string) {
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

// Interfaces para los tipos de datos de Strapi
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: {};
}

export interface StrapiItem {
  id: number;
  attributes: any;
}

// Funciones para obtener datos de cada colección

/**
 * Obtener publicaciones desde Strapi
 */
export async function getPublicaciones(featured?: boolean, limit?: number) {
  try {
    const filters: Record<string, any> = {};
    if (featured !== undefined) {
      filters.featured = featured;
    }
    
    // Simple URL without complex populate for now
    const url = buildStrapiUrl(
      'publicaciones', 
      [], // No populate for now
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
    
    // Check if it's Strapi v5 format (direct data) or v4 format (data.attributes)
    if (data.data && Array.isArray(data.data)) {
      // Strapi v5 format or direct format
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
      // Fallback to empty array
      return [];
    }
  } catch (error) {
    console.error('Error fetching publicaciones:', error);
    return [];
  }
}

/**
 * Obtener noticias/eventos desde Strapi
 */
export async function getNoticias(status?: string, limit?: number) {
  try {
    const filters: Record<string, any> = {};
    if (status) {
      filters.status = status;
    }
    
    const url = buildStrapiUrl(
      'noticias', 
      ['image'], 
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
    
    const data: StrapiResponse<StrapiItem> = await response.json();
    
    return data.data.map(item => ({
      id: item.id,
      ...item.attributes,
      image: item.attributes.image?.data?.attributes?.url
    }));
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return [];
  }
}

/**
 * Obtener contenido multimedia desde Strapi
 */
export async function getMultimedia(type?: string, featured?: boolean, limit?: number) {
  try {
    const filters: Record<string, any> = {};
    if (type) {
      filters.type = type;
    }
    if (featured !== undefined) {
      filters.featured = featured;
    }
    
    const url = buildStrapiUrl(
      'multimedias', 
      ['thumbnail', 'mediaFile'], 
      filters,
      'createdAt:desc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching multimedia: ${response.statusText}`);
    }
    
    const data: StrapiResponse<StrapiItem> = await response.json();
    
    return data.data.map(item => ({
      id: item.id,
      ...item.attributes,
      thumbnail: item.attributes.thumbnail?.data?.attributes?.url,
      mediaFile: item.attributes.mediaFile?.data?.attributes?.url
    }));
  } catch (error) {
    console.error('Error fetching multimedia:', error);
    return [];
  }
}

/**
 * Obtener verificadores desde Strapi
 */
export async function getVerificadores(isActive?: boolean) {
  try {
    const filters: Record<string, any> = {};
    if (isActive !== undefined) {
      filters.isActive = isActive;
    }
    
    const url = buildStrapiUrl(
      'verificadores', 
      ['logo'], 
      filters,
      'name:asc'
    );
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching verificadores: ${response.statusText}`);
    }
    
    const data: StrapiResponse<StrapiItem> = await response.json();
    
    return data.data.map(item => ({
      id: item.id,
      ...item.attributes,
      logo: item.attributes.logo?.data?.attributes?.url
    }));
  } catch (error) {
    console.error('Error fetching verificadores:', error);
    return [];
  }
}

/**
 * Obtener eventos desde Strapi
 */
export async function getEventos(status?: string, limit?: number) {
  try {
    const filters: Record<string, any> = {};
    if (status) {
      filters.status = status;
    }
    
    const url = buildStrapiUrl(
      'eventos', 
      ['image'], 
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
    
    const data: StrapiResponse<StrapiItem> = await response.json();
    
    return data.data.map(item => ({
      id: item.id,
      ...item.attributes,
      image: item.attributes.image?.data?.attributes?.url
    }));
  } catch (error) {
    console.error('Error fetching eventos:', error);
    return [];
  }
}

/**
 * Obtener guías electorales desde Strapi
 */
export async function getGuiasElectorales(category?: string, limit?: number) {
  try {
    const filters: Record<string, any> = {};
    if (category) {
      filters.category = category;
    }
    
    const url = buildStrapiUrl(
      'guias-electorales', 
      ['downloadFile'], 
      filters,
      'date:desc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching guías electorales: ${response.statusText}`);
    }
    
    const data: StrapiResponse<StrapiItem> = await response.json();
    
    return data.data.map(item => ({
      id: item.id,
      ...item.attributes,
      downloadFile: item.attributes.downloadFile?.data?.attributes?.url
    }));
  } catch (error) {
    console.error('Error fetching guías electorales:', error);
    return [];
  }
}

// Función helper para obtener la URL completa de un archivo de Strapi
export function getStrapiMediaUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
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
      'multimedia', 
      [],
      filters,
      'createdAt:desc'
    );
    
    if (limit) {
      const urlObj = new URL(url);
      urlObj.searchParams.append('pagination[pageSize]', limit.toString());
    }
    
    const response = await fetch(url, strapiConfig);
    
    if (!response.ok) {
      throw new Error(`Error fetching multimedia: ${response.statusText}`);
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
        format: item.format,
        size: item.size,
        tags: item.tags || [],
        featured: item.featured,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching multimedia:', error);
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
      [],
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