const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { EventosController } = require('../controllers');

const router = express.Router();
const controller = new EventosController();

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