import axios from 'axios';

// Configuración base de URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', ''); // Remover /api para URLs de assets

// Configuración base de Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para construir URLs completas de assets/imágenes
export const getAssetUrl = (relativePath: string): string => {
  if (!relativePath) return '';
  
  // Si ya es una URL completa, devolverla tal como está
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Si empieza con /uploads, construir URL completa del backend
  if (relativePath.startsWith('/uploads')) {
    return `${BACKEND_BASE_URL}${relativePath}`;
  }
  
  // Si no empieza con /, agregarlo
  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath;
  }
  
  return `${BACKEND_BASE_URL}/uploads${relativePath}`;
};

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Manejo global de errores
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;