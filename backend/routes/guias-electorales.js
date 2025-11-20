const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { GuiasElectoralesController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new GuiasElectoralesController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Rutas específicas públicas
// GET /api/guias-electorales/category/:category - Obtener guías por categoría
router.get('/category/:category', (req, res) => controller.getByCategory(req, res));

// GET /api/guias-electorales/type/:type - Obtener guías por tipo de archivo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

// GET /api/guias-electorales/recent - Obtener guías más recientes
router.get('/recent', (req, res) => controller.getRecent(req, res));

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(GuiasElectoralesController));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/guias-electorales/dashboard - Crear nueva guía (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/guias-electorales/dashboard/:id - Actualizar guía (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/guias-electorales/dashboard/:id - Eliminar guía (solo administradores)
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