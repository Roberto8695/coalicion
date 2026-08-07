const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
<<<<<<< HEAD
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
=======
const mime = require('mime-types');
const { fileTypeFromBuffer } = require('file-type');
>>>>>>> 7c7bd56b8ef2567b3236e7125c622232f454da73

class UploadsController {
  constructor() {
    this.uploadsPath = path.join(__dirname, '../uploads');
    this.setupMulter();
  }

  setupMulter() {
<<<<<<< HEAD
    // Configuración de multer para diferentes tipos
    this.uploadConfigs = {
      infografia: getCloudinaryStorage('infografia'),
      video: getCloudinaryStorage('video'), 
      arte: getCloudinaryStorage('arte'),
      presentacion: getCloudinaryStorage('presentacion'),
      general: getCloudinaryStorage('general'),
      logos: getCloudinaryStorage('logos')
    };
=======
    // Configuración de multer para subida de archivos
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          // El tipo se obtiene después del procesamiento de multer
          // Por ahora usamos 'general' y luego moveremos el archivo si es necesario
          let destPath = path.join(this.uploadsPath, 'temp');
          
          // Crear directorio temporal si no existe
          await fs.mkdir(destPath, { recursive: true });
          
          cb(null, destPath);
        } catch (error) {
          cb(error);
        }
      },
      filename: (req, file, cb) => {
        // Generar nombre único para el archivo
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        cb(null, `${name}-${timestamp}${ext}`);
      }
    });
>>>>>>> 7c7bd56b8ef2567b3236e7125c622232f454da73

    // Filtros de archivos más permisivos inicialmente
    const fileFilter = (req, file, cb) => {
      // Permitir todos los archivos inicialmente, validaremos después
      cb(null, true);
    };

    this.upload = multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024 // 100MB máximo
      }
    });
  }

  // Subir archivo principal
  uploadFile = async (req, res) => {
    try {
      // Multer middleware para manejar la subida
      this.upload.single('file')(req, res, async (err) => {
        if (err) {
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
          const { type } = req.body;
          
<<<<<<< HEAD
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
=======
          // Validar que se proporcionó el tipo
          if (!type) {
            // Eliminar archivo temporal
            await fs.unlink(req.file.path);
            return res.status(400).json({
              success: false,
              message: 'Debe especificar el tipo de multimedia'
>>>>>>> 7c7bd56b8ef2567b3236e7125c622232f454da73
            });
          }

          // Validar tipo de archivo según categoría
          const allowedTypes = {
            'infografia': ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'application/pdf'],
            'video': ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'],
            'arte': ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/gif'],
<<<<<<< HEAD
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
=======
            'presentacion': ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']
          };

          if (!allowedTypes[type] || !allowedTypes[type].includes(req.file.mimetype)) {
            // Eliminar archivo temporal
            await fs.unlink(req.file.path);
>>>>>>> 7c7bd56b8ef2567b3236e7125c622232f454da73
            return res.status(400).json({
              success: false,
              message: `Tipo de archivo no permitido para ${type}. Archivo: ${req.file.mimetype}. Tipos permitidos: ${allowedTypes[type]?.join(', ') || 'ninguno'}`
            });
          }

<<<<<<< HEAD
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
=======
          // Determinar carpeta final y mover archivo
          const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '');
          const finalDir = path.join(this.uploadsPath, type, ext);
          await fs.mkdir(finalDir, { recursive: true });
          
          const finalPath = path.join(finalDir, req.file.filename);
          await fs.rename(req.file.path, finalPath);
>>>>>>> 7c7bd56b8ef2567b3236e7125c622232f454da73

          // Obtener información del archivo
          const fileInfo = await this.getFileInfo(finalPath);
          
          // Construir URL del archivo
          const relativePath = path.relative(this.uploadsPath, finalPath);
          const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

          res.json({
            success: true,
            data: {
              filename: req.file.filename,
              originalName: req.file.originalname,
              url: fileUrl,
              path: relativePath,
              size: fileInfo.size,
              format: fileInfo.format,
              mimetype: req.file.mimetype,
              duration: fileInfo.duration || null
            }
          });
        } catch (error) {
          // Si hay error, eliminar el archivo
          try {
            if (req.file?.path) {
              await fs.unlink(req.file.path);
            }
          } catch (unlinkError) {
            console.error('Error eliminando archivo:', unlinkError);
          }
          
          res.status(500).json({
            success: false,
            message: 'Error procesando el archivo',
            error: error.message
          });
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

<<<<<<< HEAD
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
=======
  // Subir miniatura o vista previa
  uploadThumbnail = async (req, res) => {
    try {
      const thumbnailStorage = multer.diskStorage({
        destination: async (req, file, cb) => {
          const { type } = req.body; // 'thumbnail' o 'preview'
          const destPath = path.join(this.uploadsPath, type === 'preview' ? 'previews' : 'thumbnails');
          await fs.mkdir(destPath, { recursive: true });
          cb(null, destPath);
        },
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = path.extname(file.originalname);
          const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          cb(null, `${name}-${timestamp}${ext}`);
        }
      });

      const thumbnailUpload = multer({
        storage: thumbnailStorage,
        fileFilter: (req, file, cb) => {
          const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
          if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('Solo se permiten imágenes para miniaturas y vistas previas'));
          }
        },
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB para imágenes
      });

      thumbnailUpload.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'Error en la subida de la imagen',
            error: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: 'No se recibió ninguna imagen'
          });
        }

        const relativePath = path.relative(this.uploadsPath, req.file.path);
        const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

        res.json({
          success: true,
          data: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: fileUrl,
            path: relativePath,
            size: this.formatFileSize(req.file.size),
            mimetype: req.file.mimetype
          }
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  };

  // Listar archivos disponibles
  listFiles = async (req, res) => {
    try {
      const { type, category } = req.query;
      
      let searchPath = this.uploadsPath;
      if (type) {
        searchPath = path.join(searchPath, type);
      }

      const files = await this.scanDirectory(searchPath, type);
      
      res.json({
        success: true,
        data: files
>>>>>>> 7c7bd56b8ef2567b3236e7125c622232f454da73
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error listando archivos',
        error: error.message
      });
    }
  };

<<<<<<< HEAD
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
=======
  // Eliminar archivo
  deleteFile = async (req, res) => {
    try {
      const { filepath } = req.params;
      const fullPath = path.join(this.uploadsPath, filepath);
      
      // Verificar que el archivo existe y está dentro del directorio uploads
      if (!fullPath.startsWith(this.uploadsPath)) {
        return res.status(403).json({
          success: false,
          message: 'Acceso denegado'
        });
      }

      await fs.unlink(fullPath);
      
      res.json({
        success: true,
        message: 'Archivo eliminado correctamente'
>>>>>>> 7c7bd56b8ef2567b3236e7125c622232f454da73
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error eliminando archivo',
        error: error.message
      });
    }
  };

  // Funciones auxiliares
  async getFileInfo(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      
      return {
        size: this.formatFileSize(stats.size),
        format: ext.toUpperCase(),
        sizeBytes: stats.size,
        // Para videos, se podría implementar detección de duración con ffprobe
        duration: null
      };
    } catch (error) {
      throw new Error(`Error obteniendo información del archivo: ${error.message}`);
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async scanDirectory(dirPath, type = null) {
    try {
      const items = [];
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          // Si es directorio, escanear recursivamente
          const subItems = await this.scanDirectory(fullPath, type);
          items.push({
            name: entry.name,
            type: 'directory',
            path: path.relative(this.uploadsPath, fullPath),
            children: subItems
          });
        } else {
          // Si es archivo, obtener información
          const stats = await fs.stat(fullPath);
          const relativePath = path.relative(this.uploadsPath, fullPath);
          
          items.push({
            name: entry.name,
            type: 'file',
            path: relativePath,
            url: `/uploads/${relativePath.replace(/\\/g, '/')}`,
            size: this.formatFileSize(stats.size),
            sizeBytes: stats.size,
            format: path.extname(entry.name).toLowerCase().replace('.', '').toUpperCase(),
            modified: stats.mtime
          });
        }
      }
      
      return items;
    } catch (error) {
      console.error(`Error escaneando directorio ${dirPath}:`, error);
      return [];
    }
  }
}

module.exports = UploadsController;