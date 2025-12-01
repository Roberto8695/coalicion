const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { PublicacionesTendenciasController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new PublicacionesTendenciasController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// IMPORTANTE: Las rutas específicas DEBEN ir ANTES que las rutas base
// para evitar que /:id intercepte rutas como /recent

// GET /api/publicaciones-tendencias/with-filters - Obtener con filtros y paginación
router.get('/with-filters', (req, res) => controller.getAllWithFilters(req, res));

// GET /api/publicaciones-tendencias/recent - Obtener publicaciones recientes
router.get('/recent', (req, res) => controller.getRecent(req, res));

// GET /api/publicaciones-tendencias/search - Búsqueda de publicaciones
router.get('/search', (req, res) => controller.searchPublications(req, res));

// GET /api/publicaciones-tendencias/author/:autor - Obtener por autor
router.get('/author/:autor', (req, res) => controller.getByAuthor(req, res));

// Aplicar rutas base CRUD públicas (estas deben ir AL FINAL)
router.use('/', createBaseRoutes(PublicacionesTendenciasController));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/publicaciones-tendencias/dashboard - Crear nueva publicación (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/publicaciones-tendencias/dashboard/:id - Actualizar publicación (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/publicaciones-tendencias/dashboard/:id - Eliminar publicación (solo administradores)
router.delete('/dashboard/:id', authenticateToken, requirePublicationAccess('delete'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.delete(req, res);
});

module.exports = router;