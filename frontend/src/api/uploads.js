import { api } from './config';

export const uploadsService = {
  // Subir archivo principal
  uploadFile: async (file, type) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${api.baseURL}/uploads/file`, {
        method: 'POST',
        body: formData
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Error subiendo archivo: ${error.message}`);
    }
  },

  // Subir miniatura o vista previa
  uploadThumbnail: async (file, type = 'thumbnail') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${api.baseURL}/uploads/thumbnail`, {
        method: 'POST',
        body: formData
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Error subiendo ${type}: ${error.message}`);
    }
  },

  // Listar archivos disponibles
  listFiles: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);

      const response = await fetch(`${api.baseURL}/uploads/files?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Error obteniendo lista de archivos: ${error.message}`);
    }
  },

  // Eliminar archivo
  deleteFile: async (filepath) => {
    try {
      const response = await fetch(`${api.baseURL}/uploads/files/${encodeURIComponent(filepath)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Error eliminando archivo: ${error.message}`);
    }
  },

  // Obtener URL completa del archivo
  getFileUrl: (relativePath) => {
    return `${api.baseURL}/${relativePath}`;
  },

  // Validar tipo de archivo
  validateFileType: (file, allowedTypes) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`);
    }
    return true;
  },

  // Formatear tamaño de archivo
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Obtener extensión de archivo
  getFileExtension: (filename) => {
    return filename.split('.').pop().toLowerCase();
  },

  // Generar slug automático
  generateSlug: (filename) => {
    const nameWithoutExt = filename.split('.').slice(0, -1).join('.');
    return nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
};