const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { NoticiasController } = require('../controllers');

const router = express.Router();
const controller = new NoticiasController();

// Aplicar rutas base CRUD
router.use('/', createBaseRoutes(NoticiasController));

// Rutas específicas adicionales para noticias

// GET /api/noticias/status/:status - Obtener noticias por status
router.get('/status/:status', (req, res) => controller.getByStatus(req, res));

// GET /api/noticias/upcoming - Obtener eventos próximos
router.get('/upcoming', (req, res) => controller.getUpcoming(req, res));

// GET /api/noticias/date-range - Obtener eventos por rango de fechas
router.get('/date-range', (req, res) => controller.getByDateRange(req, res));

// GET /api/noticias/featured - Obtener noticias destacadas
router.get('/featured', (req, res) => controller.getFeatured(req, res));

module.exports = router;