const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const NoticiasController = require('../controllers/NoticiasController');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new NoticiasController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(NoticiasController));

// Rutas específicas públicas
// GET /api/noticias/status/:status - Obtener noticias por status
router.get('/status/:status', (req, res) => controller.getByStatus(req, res));

// GET /api/noticias/upcoming - Obtener eventos próximos
router.get('/upcoming', (req, res) => controller.getUpcoming(req, res));

// GET /api/noticias/date-range - Obtener eventos por rango de fechas
router.get('/date-range', (req, res) => controller.getByDateRange(req, res));

// GET /api/noticias/featured - Obtener noticias destacadas
router.get('/featured', (req, res) => controller.getFeatured(req, res));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/noticias/dashboard - Crear nueva noticia (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/noticias/dashboard/:id - Actualizar noticia (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/noticias/dashboard/:id - Eliminar noticia (solo administradores)
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