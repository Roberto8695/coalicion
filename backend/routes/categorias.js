const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { CategoriasController } = require('../controllers');

const router = express.Router();
const controller = new CategoriasController();

// Aplicar rutas base CRUD
router.use('/', createBaseRoutes(CategoriasController));

// Rutas específicas adicionales para categorías

// GET /api/categorias/active - Obtener categorías activas
router.get('/active', (req, res) => controller.getActive(req, res));

module.exports = router;