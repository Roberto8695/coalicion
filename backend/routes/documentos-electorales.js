const express = require('express');
const createBaseRoutes = require('./baseRoutes');
const { DocumentosElectoralesController } = require('../controllers');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const controller = new DocumentosElectoralesController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para el sitio web público
// ===========================================

// Rutas específicas públicas
// GET /api/documentos-electorales/published - Obtener documentos publicados
router.get('/published', (req, res) => controller.getPublished(req, res));

// GET /api/documentos-electorales/recent - Obtener documentos más recientes
router.get('/recent', (req, res) => controller.getRecent(req, res));

// GET /api/documentos-electorales/category/:category - Obtener documentos por categoría
router.get('/category/:category', (req, res) => controller.getByCategory(req, res));

// GET /api/documentos-electorales/type/:type - Obtener documentos por tipo de archivo
router.get('/type/:type', (req, res) => controller.getByType(req, res));

// GET /api/documentos-electorales/search - Búsqueda de documentos
router.get('/search', (req, res) => controller.search(req, res));

// GET /api/documentos-electorales/download/:id - Forzar descarga de un documento específico
router.get('/download/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validar que el ID sea un número
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID debe ser un número válido'
            });
        }
        
        // Obtener información del documento
        const documento = await new DocumentosElectoralesController().repository.findById(parseInt(id));
        
        if (!documento) {
            return res.status(404).json({
                success: false,
                message: 'Documento no encontrado'
            });
        }
        
        if (documento.status !== 'publicado') {
            return res.status(403).json({
                success: false,
                message: 'Documento no disponible para descarga'
            });
        }
        
        // Redirigir con headers para forzar descarga
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${documento.title.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()}.${documento.type.toLowerCase()}"`
        });
        
        // Redirigir a la URL del archivo
        res.redirect(documento.fileUrl);
        
    } catch (error) {
        console.error('Error en descarga:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar descarga',
            error: error.message
        });
    }
});

// Aplicar rutas base CRUD públicas
router.use('/', createBaseRoutes(DocumentosElectoralesController));

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// GET /api/documentos-electorales/status/:status - Obtener documentos por estado (solo dashboard)
router.get('/status/:status', authenticateToken, requirePublicationAccess('read'), (req, res) => 
    controller.getByStatus(req, res)
);

// POST /api/documentos-electorales/dashboard - Crear nuevo documento (solo administradores)
router.post('/dashboard', authenticateToken, requirePublicationAccess('create'), (req, res) => controller.create(req, res));

// PUT /api/documentos-electorales/dashboard/:id - Actualizar documento (solo administradores)
router.put('/dashboard/:id', authenticateToken, requirePublicationAccess('update'), (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'ID debe ser un número válido'
        });
    }
    controller.update(req, res);
});

// DELETE /api/documentos-electorales/dashboard/:id - Eliminar documento (solo administradores)
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