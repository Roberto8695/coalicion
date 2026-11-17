// Configuración y tipos base
export { default as api, getAssetUrl } from './config';
export * from './base';

// Servicios y tipos
export * from './services';

// Re-exportaciones para facilitar el uso
export {
  publicacionesService,
  publicacionesTendenciasService,
  publicacionesCoalicionService,
  categoriasService,
  tiposPublicacionService,
  noticiasService,
  tiposNoticiaService,
  tiposMultimediaService,
  tiposEventoService,
  estadosEventoService,
  multimediaService,
  eventosService,
  guiasElectoralesService,
  documentosElectoralesService,
  categoriasDocumentosElectoralesService,
  verificadoresService,
  uploadsService
} from './services';