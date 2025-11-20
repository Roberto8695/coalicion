const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { CategoriasController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new CategoriasController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Rutas específicas públicas
// GET /api/categorias/active - Obtener categorías activas
router.get('/active', (req, res) => controller.getActive(req, res));

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(CategoriasController));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/categorias/dashboard - Crear nueva categoría (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/categorias/dashboard/:id - Actualizar categoría (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/categorias/dashboard/:id - Eliminar categoría (solo administradores)
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