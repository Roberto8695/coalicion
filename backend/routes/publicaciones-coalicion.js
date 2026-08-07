const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const PublicacionesCoalicionController = require('../controllers/PublicacionesCoalicionController');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const controller = new PublicacionesCoalicionController();

// Configuración de multer con Cloudinary
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen (JPG, JPEG, PNG)'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    }
});

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// IMPORTANTE: Las rutas específicas DEBEN ir ANTES que las rutas base
// para evitar que /:id intercepte rutas como /recent

// GET /api/publicaciones-coalicion/with-filters - Obtener con filtros y paginación
router.get('/with-filters', (req, res) => controller.getAllWithFilters(req, res));

// GET /api/publicaciones-coalicion/recent - Obtener publicaciones recientes
router.get('/recent', (req, res) => controller.getRecent(req, res));

// GET /api/publicaciones-coalicion/search - Búsqueda de publicaciones
router.get('/search', (req, res) => controller.search(req, res));

// GET /api/publicaciones-coalicion/date-range - Obtener por rango de fechas
router.get('/date-range', (req, res) => controller.getByDateRange(req, res));

// GET /api/publicaciones-coalicion/stats - Obtener estadísticas
router.get('/stats', (req, res) => controller.getStats(req, res));

// Aplicar rutas base CRUD públicas (estas deben ir AL FINAL de las rutas públicas)
router.use('/', createBaseRoutes(PublicacionesCoalicionController));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// POST /api/publicaciones-coalicion/dashboard - Crear nueva publicación (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// POST /api/publicaciones-coalicion/dashboard/upload - Crear nueva publicación con imagen (solo administradores)
router.post('/dashboard/upload', authenticateToken, requirePublicationAccess('create'), upload.single('imagen'), (req, res) => controller.create(req, res));

// PUT /api/publicaciones-coalicion/dashboard/:id - Actualizar publicación (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// PUT /api/publicaciones-coalicion/dashboard/:id/upload - Actualizar publicación con imagen (solo administradores)
router.put('/dashboard/:id/upload', authenticateToken, requirePublicationAccess('update'), upload.single('imagen'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/publicaciones-coalicion/dashboard/:id - Eliminar publicación (solo administradores)
router.delete('/dashboard/:id', authenticateToken, requirePublicationAccess('delete'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.delete(req, res);
});

module.exports = router;