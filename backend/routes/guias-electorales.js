const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { GuiasElectoralesController } = require('../controllers');

const router = express.Router();
const controller = new GuiasElectoralesController();

// Aplicar rutas base CRUD
router.use('/', createBaseRoutes(GuiasElectoralesController));

// Rutas específicas adicionales para guías electorales

// GET /api/guias-electorales/category/:category - Obtener guías por categoría
router.get('/category/:category', (req, res) => controller.getByCategory(req, res));

// GET /api/guias-electorales/type/:type - Obtener guías por tipo de archivo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

// GET /api/guias-electorales/recent - Obtener guías más recientes
router.get('/recent', (req, res) => controller.getRecent(req, res));

module.exports = router;