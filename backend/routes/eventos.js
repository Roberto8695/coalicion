const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { EventosController } = require('../controllers');

const router = express.Router();
const controller = new EventosController();

// Ruta de debugging para ver qué datos llegan
router.post('/debug', (req, res) => {
    console.log('=== DEBUG EVENTOS ===');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', req.query);
    console.log('Params:', req.params);
    console.log('====================');
    
    res.json({
        success: true,
        message: 'Debug completado - revisa los logs del servidor',
        received: req.body
    });
});

// Aplicar rutas base CRUD
router.use('/', createBaseRoutes(EventosController));

// Rutas específicas adicionales para eventos

// GET /api/eventos/status/:status - Obtener eventos por status
router.get('/status/:status', (req, res) => controller.getByStatus(req, res));

// GET /api/eventos/upcoming - Obtener eventos próximos
router.get('/upcoming', (req, res) => controller.getUpcoming(req, res));

// GET /api/eventos/type/:type - Obtener eventos por tipo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

module.exports = router;