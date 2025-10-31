const express = require('express');

// Importar todas las rutas
const publicacionesRoutes = require('./publicaciones');
const noticiasRoutes = require('./noticias');
const multimediaRoutes = require('./multimedia');
const eventosRoutes = require('./eventos');
const guiasElectoralesRoutes = require('./guias-electorales');
const verificadoresRoutes = require('./verificadores');
const categoriasRoutes = require('./categorias');
const uploadsRoutes = require('./uploads');

const router = express.Router();

// Configurar todas las rutas de la API
router.use('/publicaciones', publicacionesRoutes);
router.use('/noticias', noticiasRoutes);
router.use('/multimedia', multimediaRoutes);
router.use('/eventos', eventosRoutes);
router.use('/guias-electorales', guiasElectoralesRoutes);
router.use('/verificadores', verificadoresRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/uploads', uploadsRoutes);

// Ruta de información de la API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de Coalición - Endpoints disponibles',
        version: '1.0.0',
        endpoints: {
            publicaciones: '/api/publicaciones',
            noticias: '/api/noticias',
            multimedia: '/api/multimedia',
            eventos: '/api/eventos',
            'guias-electorales': '/api/guias-electorales',
            verificadores: '/api/verificadores',
            categorias: '/api/categorias'
        },
        documentation: {
            crud: {
                'GET /{resource}': 'Obtener todos los registros (con paginación)',
                'GET /{resource}/:id': 'Obtener registro por ID',
                'GET /{resource}/slug/:slug': 'Obtener registro por slug',
                'POST /{resource}': 'Crear nuevo registro',
                'PUT /{resource}/:id': 'Actualizar registro',
                'DELETE /{resource}/:id': 'Eliminar registro',
                'GET /{resource}/search?q=term': 'Buscar registros'
            },
            parameters: {
                page: 'Número de página (default: 1)',
                limit: 'Registros por página (default: 10)',
                q: 'Término de búsqueda'
            }
        }
    });
});

module.exports = router;