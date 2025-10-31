const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { VerificadoresController } = require('../controllers');

const router = express.Router();
const controller = new VerificadoresController();

// Aplicar rutas base CRUD
router.use('/', createBaseRoutes(VerificadoresController));

// Rutas específicas adicionales para verificadores

// GET /api/verificadores/active - Obtener verificadores activos
router.get('/active', (req, res) => controller.getActive(req, res));

// GET /api/verificadores/type/:type - Obtener verificadores por tipo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

module.exports = router;