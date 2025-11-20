const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { PublicacionesController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new PublicacionesController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(PublicacionesController));

// Rutas específicas públicas
// GET /api/publicaciones/with-category - Obtener publicaciones con información de categoría
router.get('/with-category', (req, res) => controller.getAllWithCategory(req, res));

// GET /api/publicaciones/featured - Obtener publicaciones destacadas
router.get('/featured', (req, res) => controller.getFeatured(req, res));

// GET /api/publicaciones/search-advanced - Búsqueda avanzada
router.get('/search-advanced', (req, res) => controller.searchAdvanced(req, res));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para usuarios autenticados
// ===========================================

// GET /api/publicaciones/dashboard - Obtener todas las publicaciones para dashboard
router.get('/dashboard', authenticateToken, requirePublicationAccess('read'), (req, res) => controller.getAll(req, res));

// GET /api/publicaciones/dashboard/:id - Obtener publicación por ID para dashboard
router.get('/dashboard/:id', authenticateToken, requirePublicationAccess('read'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.getById(req, res);
});

// POST /api/publicaciones/dashboard - Crear nueva publicación (solo editores y administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/publicaciones/dashboard/:id - Actualizar publicación (solo editores y administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/publicaciones/dashboard/:id - Eliminar publicación (solo editores y administradores)
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