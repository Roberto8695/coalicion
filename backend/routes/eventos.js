const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { EventosController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new EventosController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(EventosController));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/eventos/dashboard - Crear nuevo evento (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/eventos/dashboard/:id - Actualizar evento (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/eventos/dashboard/:id - Eliminar evento (solo administradores)
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