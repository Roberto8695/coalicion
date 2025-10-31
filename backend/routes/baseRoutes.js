const express = require('express');

// Función para crear rutas CRUD básicas para cualquier controller
function createBaseRoutes(Controller) {
    const router = express.Router();
    const controller = new Controller();

    // GET /api/{resource} - Obtener todos los registros
    router.get('/', (req, res) => controller.getAll(req, res));

    // GET /api/{resource}/search - Búsqueda
    router.get('/search', (req, res) => controller.search(req, res));

    // GET /api/{resource}/:id - Obtener por ID (solo números)
    router.get('/:id', (req, res) => {
        // Validar que el ID sea un número
        if (!/^\d+$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID debe ser un número válido'
            });
        }
        controller.getById(req, res);
    });

    // GET /api/{resource}/slug/:slug - Obtener por slug
    router.get('/slug/:slug', (req, res) => controller.getBySlug(req, res));

    // POST /api/{resource} - Crear nuevo registro
    router.post('/', (req, res) => controller.create(req, res));

    // PUT /api/{resource}/:id - Actualizar registro
    router.put('/:id', (req, res) => {
        // Validar que el ID sea un número
        if (!/^\d+$/.test(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'ID debe ser un número válido'
            });
        }
        controller.update(req, res);
    });

    // DELETE /api/{resource}/:id - Eliminar registro
    router.delete('/:id', (req, res) => {
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

module.exports = createBaseRoutes;