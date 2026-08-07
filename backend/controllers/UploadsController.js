const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  getCloudinaryStorage,
  deleteFromCloudinary,
  buildPublicFileUrl,
  uploadsRoot,
  isLocalStorage,
  resolveStorageType
} = require('../utils/cloudinary');

class UploadsController {
  constructor() {
    this.setupMulter();
  }

  setupMulter() {
    // Configuración de multer para diferentes tipos
    this.uploadConfigs = {
      infografia: getCloudinaryStorage('infografia'),
      video: getCloudinaryStorage('video'), 
      arte: getCloudinaryStorage('arte'),
      presentacion: getCloudinaryStorage('presentacion'),
      general: getCloudinaryStorage('general'),
      logos: getCloudinaryStorage('logos')
    };

    // Filtro de archivos más permisivo - validaremos después
    const fileFilter = (req, file, cb) => {
      // Permitir todos los archivos inicialmente, validaremos después
      cb(null, true);
    };

    // Setup multer configs para cada tipo
    Object.keys(this.uploadConfigs).forEach(type => {
      this[`upload_${type}`] = multer({
        storage: this.uploadConfigs[type],
        fileFilter,
        limits: {
          fileSize: 100 * 1024 * 1024 // 100MB máximo
        }
      });
    });
  }

  // Subir archivo principal
  uploadFile = async (req, res) => {
    try {
      // Primero necesitamos determinar el tipo desde el query o form data
      // Para esto usaremos multer general inicialmente
      const uploadMiddleware = this.upload_general.single('file');
      
      uploadMiddleware(req, res, async (err) => {
        if (err) {
          console.error('❌ Error en multer:', err);
          return res.status(400).json({
            success: false,
            message: 'Error en la subida del archivo',
            error: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No se recibió ningún archivo'
          });
        }

        try {
          // Ahora podemos acceder a req.body
          const { type = 'general' } = req.body;
          
          console.log('📁 Subiendo archivo tipo:', type);
          console.log('📄 Archivo recibido:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
          });
          
          // Validar tipo
          if (!['infografia', 'video', 'arte', 'presentacion', 'general', 'logos', 'thumbnail', 'thumbnails', 'preview', 'previews'].includes(type)) {
            // Eliminar archivo si el tipo es inválido
              if (req.file?.filename) {
                await deleteFromCloudinary(req.file.path || req.file.filename);
              }
            return res.status(400).json({
              success: false,
              message: 'Tipo de multimedia inválido. Tipos permitidos: infografia, video, arte, presentacion, general, logos, thumbnail, preview'
            });
          }

          // Validar tipo de archivo según categoría
          const allowedTypes = {
            'infografia': ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/pdf'],
            'video': ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'],
            'arte': ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/gif'],
            'presentacion': ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            'general': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'], // Para logos y thumbnails
            'logos': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'], // Para logos de verificadores
            'thumbnail': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
            'thumbnails': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
            'preview': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
            'previews': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
          };

          if (!allowedTypes[type] || !allowedTypes[type].includes(req.file.mimetype)) {
            // Eliminar archivo si el tipo no es permitido
            if (req.file?.filename) {
              await deleteFromCloudinary(req.file.path || req.file.filename);
            }
            return res.status(400).json({
              success: false,
              message: `Tipo de archivo no permitido para ${type}. Archivo: ${req.file.mimetype}. Tipos permitidos: ${allowedTypes[type]?.join(', ') || 'ninguno'}`
            });
          }

          const fileUrl = buildPublicFileUrl(req.file);
          const fileInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: fileUrl,
            size: req.file.size,
            mimetype: req.file.mimetype,
            type: type,
            cloudinaryPublicId: isLocalStorage ? null : req.file.filename,
            url: fileUrl,
            storage: isLocalStorage ? 'local' : 'cloudinary'
          };

          console.log(`✅ Archivo subido a ${isLocalStorage ? 'storage local' : 'Cloudinary'}:`, {
            filename: fileInfo.filename,
            type: fileInfo.type,
            size: this.formatFileSize(fileInfo.size),
            url: fileInfo.url
          });

          res.status(200).json({
            success: true,
            message: 'Archivo subido exitosamente',
            data: fileInfo
          });

        } catch (error) {
          console.error('❌ Error al procesar archivo:', error);
          
          // Si hay error, intentar eliminar el archivo subido
          if (req.file?.filename) {
            try {
              await deleteFromCloudinary(req.file.path || req.file.filename);
              console.log('🗑️ Archivo eliminado tras error');
            } catch (deleteError) {
              console.error('❌ Error al eliminar archivo tras error:', deleteError);
            }
          }

          res.status(500).json({
            success: false,
            message: 'Error al procesar el archivo',
            error: error.message
          });
        }
      });

    } catch (error) {
      console.error('❌ Error en uploadFile:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Listar archivos locales o indicar que se usa almacenamiento externo
  listFiles = async (req, res) => {
    try {
      if (!isLocalStorage) {
        res.json({
          success: true,
          message: 'Los archivos están almacenados en Cloudinary. Use el dashboard de Cloudinary para gestionarlos.',
          data: []
        });
        return;
      }

      const requestedType = resolveStorageType(req.query.type || 'general');
      const baseDir = path.join(uploadsRoot, requestedType);
      const items = [];

      if (fs.existsSync(baseDir)) {
        const formats = fs.readdirSync(baseDir, { withFileTypes: true })
          .filter((entry) => entry.isDirectory());

        for (const formatDir of formats) {
          const formatPath = path.join(baseDir, formatDir.name);
          const files = fs.readdirSync(formatPath, { withFileTypes: true }).filter((entry) => entry.isFile());

          items.push({
            name: formatDir.name,
            type: 'directory',
            path: `${requestedType}/${formatDir.name}`,
            children: files.map((file) => {
              const filePath = `${requestedType}/${formatDir.name}/${file.name}`;
              return {
                name: file.name,
                type: 'file',
                path: filePath,
                url: `/uploads/${filePath}`,
                format: formatDir.name.toUpperCase(),
                size: this.formatFileSize(fs.statSync(path.join(formatPath, file.name)).size)
              };
            })
          });
        }
      }

      res.json({
        success: true,
        message: 'Archivos locales obtenidos exitosamente',
        data: items
      });
    } catch (error) {
      console.error('❌ Error en listFiles:', error);
      res.status(500).json({
        success: false,
        message: 'Error listando archivos',
        error: error.message
      });
    }
  };

  // Eliminar archivo local o de Cloudinary
  deleteFile = async (req, res) => {
    try {
      const { filepath } = req.params;
      const identifier = decodeURIComponent(filepath);

      console.log('🗑️ Eliminando archivo:', { identifier, storage: isLocalStorage ? 'local' : 'cloudinary' });

      const result = await deleteFromCloudinary(identifier);
      
      res.json({
        success: true,
        message: 'Archivo eliminado correctamente',
        data: result
      });

    } catch (error) {
      console.error('❌ Error eliminando archivo de Cloudinary:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando archivo',
        error: error.message
      });
    }
  };

  // Función auxiliar para formatear tamaños
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = UploadsController;