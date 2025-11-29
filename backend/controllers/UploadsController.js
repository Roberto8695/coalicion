const multer = require('multer');
const { getCloudinaryStorage, deleteFromCloudinary } = require('../utils/cloudinary');

class UploadsController {
  constructor() {
    this.setupMulter();
  }

  setupMulter() {
    // Configuración de multer con Cloudinary para diferentes tipos
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
          if (!['infografia', 'video', 'arte', 'presentacion', 'general', 'logos'].includes(type)) {
            // Eliminar archivo si el tipo es inválido
            if (req.file?.filename) {
              await deleteFromCloudinary(req.file.filename, 'general');
            }
            return res.status(400).json({
              success: false,
              message: 'Tipo de multimedia inválido. Tipos permitidos: infografia, video, arte, presentacion, general, logos'
            });
          }

          // Validar tipo de archivo según categoría
          const allowedTypes = {
            'infografia': ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/pdf'],
            'video': ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'],
            'arte': ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/gif'],
            'presentacion': ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
            'general': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'], // Para logos y thumbnails
            'logos': ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'] // Para logos de verificadores
          };

          if (!allowedTypes[type] || !allowedTypes[type].includes(req.file.mimetype)) {
            // Eliminar archivo si el tipo no es permitido
            if (req.file?.filename) {
              await deleteFromCloudinary(req.file.filename, 'general');
            }
            return res.status(400).json({
              success: false,
              message: `Tipo de archivo no permitido para ${type}. Archivo: ${req.file.mimetype}. Tipos permitidos: ${allowedTypes[type]?.join(', ') || 'ninguno'}`
            });
          }

          // El archivo ya fue subido a Cloudinary por multer-storage-cloudinary
          const fileInfo = {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path, // URL de Cloudinary
            size: req.file.size,
            mimetype: req.file.mimetype,
            type: type,
            cloudinaryPublicId: req.file.filename, // El public_id en Cloudinary
            url: req.file.path
          };

          console.log('✅ Archivo subido a Cloudinary:', {
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
          
          // Si hay error, intentar eliminar de Cloudinary
          if (req.file?.filename) {
            try {
              await deleteFromCloudinary(req.file.filename, 'general');
              console.log('🗑️ Archivo eliminado de Cloudinary tras error');
            } catch (deleteError) {
              console.error('❌ Error al eliminar archivo de Cloudinary:', deleteError);
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

  // Listar archivos (nota: con Cloudinary esto requiere API calls)
  listFiles = async (req, res) => {
    try {
      // Con Cloudinary, esto requiere llamadas a la API
      // Por simplicidad, devolvemos mensaje informativo
      res.json({
        success: true,
        message: 'Los archivos están almacenados en Cloudinary. Use el dashboard de Cloudinary para gestionar archivos.',
        data: []
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

  // Eliminar archivo de Cloudinary
  deleteFile = async (req, res) => {
    try {
      const { filepath } = req.params;
      
      // El filepath contiene el public_id de Cloudinary
      const publicId = decodeURIComponent(filepath);
      
      // Determinar el tipo basado en el public_id
      let type = 'general';
      if (publicId.includes('infografia/')) type = 'infografia';
      else if (publicId.includes('video/')) type = 'video';
      else if (publicId.includes('arte/')) type = 'arte';
      else if (publicId.includes('presentacion/')) type = 'presentacion';
      
      console.log('🗑️ Eliminando archivo de Cloudinary:', { publicId, type });
      
      const result = await deleteFromCloudinary(publicId, type);
      
      res.json({
        success: true,
        message: 'Archivo eliminado correctamente de Cloudinary',
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