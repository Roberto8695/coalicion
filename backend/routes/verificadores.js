const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { VerificadoresController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new VerificadoresController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Rutas específicas públicas
// GET /api/verificadores/active - Obtener verificadores activos
router.get('/active', (req, res) => controller.getActive(req, res));

// GET /api/verificadores/type/:type - Obtener verificadores por tipo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(VerificadoresController));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/verificadores/dashboard - Crear nuevo verificador (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/verificadores/dashboard/:id - Actualizar verificador (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/verificadores/dashboard/:id - Eliminar verificador (solo administradores)
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