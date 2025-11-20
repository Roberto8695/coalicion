const express = require('express');
const UsuariosController = require('../controllers/UsuariosController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const usuariosController = new UsuariosController();

// Rutas públicas
router.post('/login', usuariosController.login.bind(usuariosController));

// Rutas protegidas - requieren autenticación
router.use(authenticateToken);

// Perfil del usuario autenticado
router.get('/profile', usuariosController.getProfile.bind(usuariosController));

// Cambiar contraseña del usuario autenticado
router.put('/change-password/:id', usuariosController.changePassword.bind(usuariosController));

// Rutas que requieren rol de administrador
router.use(authorizeRoles(['administrador']));

// CRUD de usuarios (solo administradores)
router.get('/', usuariosController.getAll.bind(usuariosController));
router.get('/stats', usuariosController.getStats.bind(usuariosController));
router.get('/:id', usuariosController.getById.bind(usuariosController));
router.post('/', usuariosController.create.bind(usuariosController));
router.put('/:id', usuariosController.update.bind(usuariosController));
router.delete('/:id', usuariosController.delete.bind(usuariosController));
router.patch('/:id/toggle-active', usuariosController.toggleActive.bind(usuariosController));

module.exports = router;