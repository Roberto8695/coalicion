const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { MultimediaController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new MultimediaController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(MultimediaController));

// Rutas específicas públicas
// GET /api/multimedia/with-category - Obtener multimedia con información de categoría
router.get('/with-category', (req, res) => controller.getAllWithCategory(req, res));

// GET /api/multimedia/type/:type - Obtener multimedia por tipo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

// GET /api/multimedia/featured - Obtener multimedia destacada
router.get('/featured', (req, res) => controller.getFeatured(req, res));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/multimedia/dashboard - Crear nuevo multimedia (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/multimedia/dashboard/:id - Actualizar multimedia (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/multimedia/dashboard/:id - Eliminar multimedia (solo administradores)
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