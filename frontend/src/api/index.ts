// Configuración y tipos base
export { default as api } from './config';
export * from './base';

// Servicios y tipos
export * from './services';

// Re-exportaciones para facilitar el uso
export {
  publicacionesService,
  categoriasService,
  noticiasService,
  multimediaService,
  eventosService,
  guiasElectoralesService,
  verificadoresService,
  uploadsService
} from './services';