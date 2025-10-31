const express = require('express');
const path = require('path');
const fs = require('fs');
const UploadsController = require('../controllers/UploadsController');

const router = express.Router();
const uploadsController = new UploadsController();

// Ruta para descarga forzada
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

// Subir archivo principal
router.post('/file', uploadsController.uploadFile);

// Subir miniatura o vista previa
router.post('/thumbnail', uploadsController.uploadThumbnail);

// Listar archivos disponibles
router.get('/files', uploadsController.listFiles);

// Eliminar archivo
router.delete('/files/:filepath', uploadsController.deleteFile);

module.exports = router;