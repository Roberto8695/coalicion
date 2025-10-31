import api from './config';

// Tipos de datos
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Clase base para servicios CRUD
export class BaseService<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Obtener todos los registros
  async getAll(params?: PaginationParams & Record<string, unknown>): Promise<ApiResponse<T[]>> {
    return await api.get(this.endpoint, { params });
  }

  // Obtener por ID
  async getById(id: number | string): Promise<ApiResponse<T>> {
    return await api.get(`${this.endpoint}/${id}`);
  }

  // Crear nuevo registro
  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    return await api.post(this.endpoint, data);
  }

  // Actualizar registro
  async update(id: number | string, data: Partial<T>): Promise<ApiResponse<T>> {
    return await api.put(`${this.endpoint}/${id}`, data);
  }

  // Eliminar registro
  async delete(id: number | string): Promise<ApiResponse<T>> {
    return await api.delete(`${this.endpoint}/${id}`);
  }

  // Búsqueda
  async search(query: string, params?: Record<string, unknown>): Promise<ApiResponse<T[]>> {
    return await api.get(`${this.endpoint}/search`, { 
      params: { q: query, ...params } 
    });
  }
}