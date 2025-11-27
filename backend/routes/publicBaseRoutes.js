const express = require('express');

// Función para crear rutas CRUD públicas (solo lectura) para cualquier controller
function createPublicBaseRoutes(Controller) {
    const router = express.Router();
    const controller = new Controller();

    // GET /api/{resource} - Obtener todos los registros (público)
    router.get('/', (req, res) => controller.getAll(req, res));

    // GET /api/{resource}/search - Búsqueda (público)
    router.get('/search', (req, res) => controller.search(req, res));

    // GET /api/{resource}/:id - Obtener por ID (solo números) (público)
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

    // GET /api/{resource}/slug/:slug - Obtener por slug (público)
    router.get('/slug/:slug', (req, res) => controller.getBySlug(req, res));

    return router;
}

module.exports = createPublicBaseRoutes;