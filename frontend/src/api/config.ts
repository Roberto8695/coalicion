import axios from 'axios';

// Configuración base de URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', ''); // Remover /api para URLs de assets

// Debug de URLs en el navegador
if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration Debug:');
  console.log('API_BASE_URL:', API_BASE_URL);
  console.log('BACKEND_BASE_URL:', BACKEND_BASE_URL);
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
}

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
    const fullUrl = `${BACKEND_BASE_URL}${relativePath}`;
    console.log('🖼️ Asset URL built:', relativePath, '->', fullUrl);
    return fullUrl;
  }
  
  // Si no empieza con /, agregarlo
  if (!relativePath.startsWith('/')) {
    relativePath = '/' + relativePath;
  }
  
  const fullUrl = `${BACKEND_BASE_URL}/uploads${relativePath}`;
  console.log('🖼️ Asset URL built (with /uploads):', relativePath, '->', fullUrl);
  return fullUrl;
};

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Debug de request
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    
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
    console.log('✅ API Response:', response.status, response.statusText);
    return response.data;
  },
  (error) => {
    // Manejo global de errores
    console.error('❌ API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    
    const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;