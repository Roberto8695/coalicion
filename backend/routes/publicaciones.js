const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { PublicacionesController } = require('../controllers');

const router = express.Router();
const controller = new PublicacionesController();

// Aplicar rutas base CRUD
router.use('/', createBaseRoutes(PublicacionesController));

// Rutas específicas adicionales para publicaciones

// GET /api/publicaciones/with-category - Obtener publicaciones con información de categoría
router.get('/with-category', (req, res) => controller.getAllWithCategory(req, res));

// GET /api/publicaciones/featured - Obtener publicaciones destacadas
router.get('/featured', (req, res) => controller.getFeatured(req, res));

// GET /api/publicaciones/search-advanced - Búsqueda avanzada
router.get('/search-advanced', (req, res) => controller.searchAdvanced(req, res));

module.exports = router;