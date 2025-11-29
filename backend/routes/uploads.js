const express = require('express');
const path = require('path');
const fs = require('fs');
const UploadsController = require('../controllers/UploadsController');
const { authenticateToken, requirePublicationAccess } = require('../middleware/auth');

const router = express.Router();
const uploadsController = new UploadsController();

// ===========================================
// RUTAS PÚBLICAS (SIN AUTENTICACIÓN)
// Para descargas del sitio web público
// ===========================================

// Ruta para descarga forzada (pública)
router.get('/download/:type/:format/:filename', (req, res) => {
    try {
        // Obtener parámetros de la ruta
        const { type, format, filename } = req.params;
        const filePath = `${type}/${format}/${filename}`;
        const fullPath = path.join(__dirname, '../uploads', filePath);
        
        // Verificar que el archivo existe
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ success: false, message: 'Archivo no encontrado' });
        }
        
        // Obtener información del archivo
        const stats = fs.statSync(fullPath);
        
        // Configurar headers para forzar descarga
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // Enviar el archivo
        const fileStream = fs.createReadStream(fullPath);
        fileStream.pipe(res);
        
    } catch (error) {
        console.error('Error en descarga:', error);
        res.status(500).json({ success: false, message: 'Error al descargar archivo' });
    }
});

// ===========================================
// RUTAS PROTEGIDAS DEL DASHBOARD
// Solo para administradores
// ===========================================

// Subir archivo principal (solo administradores)
router.post('/dashboard/file', authenticateToken, requirePublicationAccess('create'), uploadsController.uploadFile);

// Subir miniatura o vista previa (solo administradores) - usa el mismo método uploadFile
router.post('/dashboard/thumbnail', authenticateToken, requirePublicationAccess('create'), uploadsController.uploadFile);

// Listar archivos disponibles (solo administradores)
router.get('/dashboard/files', authenticateToken, requirePublicationAccess('read'), uploadsController.listFiles);

// Eliminar archivo (solo administradores)
router.delete('/dashboard/files/:filepath', authenticateToken, requirePublicationAccess('delete'), uploadsController.deleteFile);

module.exports = router;