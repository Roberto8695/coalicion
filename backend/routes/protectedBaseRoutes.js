const express = require('express');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

// Función para crear rutas CRUD básicas protegidas para cualquier controller
function createProtectedBaseRoutes(Controller) {
    const router = express.Router();
    const controller = new Controller();

    // GET /api/{resource} - Obtener todos los registros (requiere autenticación)
    router.get('/', authenticateToken, requirePublicationAccess('read'), (req, res) => controller.getAll(req, res));

    // GET /api/{resource}/search - Búsqueda (requiere autenticación)
    router.get('/search', authenticateToken, requirePublicationAccess('read'), (req, res) => controller.search(req, res));

    // GET /api/{resource}/:id - Obtener por ID (solo números) (requiere autenticación)
    router.get('/:id', authenticateToken, requirePublicationAccess('read'), (req, res) => {
        // Validar que el ID sea un número
        if (!/^\d+$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID debe ser un número válido'
            });
        }
        controller.getById(req, res);
    });

    // GET /api/{resource}/slug/:slug - Obtener por slug (requiere autenticación)
    router.get('/slug/:slug', authenticateToken, requirePublicationAccess('read'), (req, res) => controller.getBySlug(req, res));

    // POST /api/{resource} - Crear nuevo registro (solo administradores)
    router.post('/', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

    // PUT /api/{resource}/:id - Actualizar registro (solo administradores)
    router.put('/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
        // Validar que el ID sea un número
        if (!/^\d+$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID debe ser un número válido'
            });
        }
        controller.update(req, res);
    });

    // DELETE /api/{resource}/:id - Eliminar registro (solo administradores)
    router.delete('/:id', authenticateToken, requirePublicationAccess('delete'), (req, res) => {
        // Validar que el ID sea un número
        if (!/^\d+$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID debe ser un número válido'
            });
        }
        controller.delete(req, res);
    });

    return router;
}

module.exports = createProtectedBaseRoutes;