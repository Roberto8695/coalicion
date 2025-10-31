const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { MultimediaController } = require('../controllers');

const router = express.Router();
const controller = new MultimediaController();

// Aplicar rutas base CRUD
router.use('/', createBaseRoutes(MultimediaController));

// Rutas específicas adicionales para multimedia

// GET /api/multimedia/with-category - Obtener multimedia con información de categoría
router.get('/with-category', (req, res) => controller.getAllWithCategory(req, res));

// GET /api/multimedia/type/:type - Obtener multimedia por tipo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

// GET /api/multimedia/featured - Obtener multimedia destacada
router.get('/featured', (req, res) => controller.getFeatured(req, res));

module.exports = router;