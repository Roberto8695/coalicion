import { BaseService } from './base';
import api from './config';

// Tipos de datos
export interface Publicacion {
  id?: number;
  title: string;
  description?: string;
  type: 'informe' | 'estudio' | 'monitoreo' | 'investigacion';
  date?: string;
  author?: string;
  pages?: number;
  downloadUrl?: string;
  previewUrl?: string;
  tags?: string[];
  featured?: boolean;
  slug?: string;
  thumbnail?: string;
  fileSize?: string;
  status?: 'published' | 'draft' | 'archived';
  categoria_id?: number;
}

export interface Categoria {
  id?: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  slug?: string;
  isActive?: boolean;
}

export interface Noticia {
  id?: number;
  title: string;
  content?: string;
  excerpt?: string;
  author?: string;
  publishDate?: string;
  featured?: boolean;
  imageUrl?: string;
  slug?: string;
  tags?: string[];
  status?: 'published' | 'draft' | 'archived';
  categoria_id?: number;
}

export interface Multimedia {
  id?: number;
  title: string;
  description?: string;
  type: 'video' | 'audio' | 'imagen' | 'documento';
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  fileSize?: string;
  uploadDate?: string;
  tags?: string[];
  categoria_id?: number;
}

export interface Evento {
  id?: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  type: 'webinar' | 'conferencia' | 'taller' | 'reunion' | 'otro';
  status: 'programado' | 'en_curso' | 'finalizado' | 'cancelado';
  maxParticipants?: number;
  registrationUrl?: string;
  imageUrl?: string;
  organizer?: string;
}

export interface GuiaElectoral {
  id?: number;
  title: string;
  description?: string;
  targetAudience: 'ciudadanos' | 'funcionarios' | 'organizaciones' | 'medios';
  type: 'guia' | 'manual' | 'protocolo' | 'instructivo';
  version?: string;
  downloadUrl?: string;
  publishDate?: string;
  lastUpdate?: string;
  tags?: string[];
  status?: 'published' | 'draft' | 'archived';
}

export interface Verificador {
  id?: number;
  name: string;
  email?: string;
  organization?: string;
  specialization?: string;
  bio?: string;
  imageUrl?: string;
  socialMedia?: Record<string, string>;
  certifications?: string[];
  isActive?: boolean;
  joinDate?: string;
}

// Servicios específicos
export class PublicacionesService extends BaseService<Publicacion> {
  constructor() {
    super('publicaciones');
  }

  // Métodos específicos para publicaciones
  async getWithCategory(params?: any) {
    return await api.get(`${this.endpoint}/with-category`, { params });
  }

  async getFeatured(limit?: number) {
    return await api.get(`${this.endpoint}/featured`, { params: { limit } });
  }

  async searchAdvanced(query: string, filters?: any) {
    return await api.get(`${this.endpoint}/search-advanced`, { 
      params: { q: query, ...filters } 
    });
  }
}

export class CategoriasService extends BaseService<Categoria> {
  constructor() {
    super('categorias');
  }
}

export class NoticiasService extends BaseService<Noticia> {
  constructor() {
    super('noticias');
  }

  async getFeatured(limit?: number) {
    return await api.get(`${this.endpoint}/featured`, { params: { limit } });
  }
}

export class MultimediaService extends BaseService<Multimedia> {
  constructor() {
    super('multimedia');
  }

  async getByType(type: string, params?: any) {
    return await api.get(`${this.endpoint}/by-type/${type}`, { params });
  }
}

export class EventosService extends BaseService<Evento> {
  constructor() {
    super('eventos');
  }

  async getUpcoming(limit?: number) {
    return await api.get(`${this.endpoint}/upcoming`, { params: { limit } });
  }

  async getByStatus(status: string, params?: any) {
    return await api.get(`${this.endpoint}/status/${status}`, { params });
  }
}

export class GuiasElectoralesService extends BaseService<GuiaElectoral> {
  constructor() {
    super('guias-electorales');
  }

  async getByAudience(audience: string, params?: any) {
    return await api.get(`${this.endpoint}/audience/${audience}`, { params });
  }
}

export class VerificadoresService extends BaseService<Verificador> {
  constructor() {
    super('verificadores');
  }

  async getActive(params?: any) {
    return await api.get(`${this.endpoint}/active`, { params });
  }
}

// Instancias de los servicios
export const publicacionesService = new PublicacionesService();
export const categoriasService = new CategoriasService();
export const noticiasService = new NoticiasService();
export const multimediaService = new MultimediaService();
export const eventosService = new EventosService();
export const guiasElectoralesService = new GuiasElectoralesService();
export const verificadoresService = new VerificadoresService();