const cloudinarySdk = require('cloudinary');
const cloudinary = cloudinarySdk.v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storageProvider = (process.env.STORAGE_PROVIDER || 'local').toLowerCase();
const isLocalStorage = ['local', 'filesystem', 'disk'].includes(storageProvider);

const uploadsRoot = path.resolve(
  __dirname,
  '..',
  process.env.UPLOADS_DIR || 'uploads'
);

const aliasMap = {
  thumbnail: 'general',
  thumbnails: 'general',
  preview: 'general'
  ,previews: 'general'
};

const ensureDirectory = (directoryPath) => {
  fs.mkdirSync(directoryPath, { recursive: true });
  return directoryPath;
};

const resolveStorageType = (folder = 'uploads') => {
  const normalized = String(folder || 'uploads').toLowerCase();
  return aliasMap[normalized] || normalized;
};

const getFileFormat = (file) => {
  const extension = path.extname(file.originalname || '').replace('.', '').toLowerCase();
  return extension || 'bin';
};

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getLocalStorage = (folder = 'uploads') => multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const resolvedType = resolveStorageType(req.body?.type || folder);
      const format = getFileFormat(file);
      const destination = ensureDirectory(path.join(uploadsRoot, resolvedType, format));
      cb(null, destination);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

// Función para obtener la configuración de storage según el tipo de archivo
const getCloudinaryStorage = (folder = 'uploads') => {
  if (isLocalStorage) {
    return getLocalStorage(folder);
  }

  const resolvedType = resolveStorageType(folder);

  return new CloudinaryStorage({
    cloudinary: cloudinarySdk,
    params: {
      folder: `coalicion/${resolvedType}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'pdf', 'mp4', 'avi', 'mov', 'mkv', 'ppt', 'pptx'],
      resource_type: 'auto',
      public_id: (req, file) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        return `${file.fieldname}-${uniqueSuffix}`;
      },
    },
  });
};

const buildLocalFileUrl = (file) => {
  if (!file) {
    return null;
  }

  const destination = file.destination || path.dirname(file.path || '');
  const relativeDirectory = path.relative(uploadsRoot, destination).split(path.sep).filter(Boolean).join('/');
  const fileName = file.filename || path.basename(file.path || '');
  const relativePath = relativeDirectory ? `${relativeDirectory}/${fileName}` : fileName;

  return `/uploads/${relativePath}`;
};

const buildPublicFileUrl = (file) => {
  if (!file) {
    return null;
  }

  if (isLocalStorage) {
    return buildLocalFileUrl(file);
  }

  return file.path || null;
};

const resolveLocalFilePath = (identifier) => {
  if (!identifier) {
    return null;
  }

  if (path.isAbsolute(identifier)) {
    return identifier;
  }

  try {
    if (/^https?:\/\//i.test(identifier)) {
      const parsedUrl = new URL(identifier);
      const uploadsIndex = parsedUrl.pathname.indexOf('/uploads/');

      if (uploadsIndex !== -1) {
        return path.join(uploadsRoot, parsedUrl.pathname.slice(uploadsIndex + '/uploads/'.length));
      }
    }
  } catch (error) {
    // Si no es una URL válida, seguimos con el resto de resoluciones.
  }

  if (identifier.startsWith('/uploads/')) {
    return path.join(uploadsRoot, identifier.slice('/uploads/'.length));
  }

  if (identifier.startsWith('uploads/')) {
    return path.join(uploadsRoot, identifier.slice('uploads/'.length));
  }

  return path.join(uploadsRoot, identifier);
};

const deleteLocalFile = async (identifier) => {
  const filePath = resolveLocalFilePath(identifier);

  if (!filePath || !fs.existsSync(filePath)) {
    return { result: 'not_found', path: filePath || null };
  }

  fs.unlinkSync(filePath);
  return { result: 'ok', path: filePath };
};

// Función para eliminar un archivo de almacenamiento
const deleteFromCloudinary = async (identifier) => {
  try {
    if (isLocalStorage) {
      console.log(`🗑️ Eliminando archivo local: ${identifier}`);
      const result = await deleteLocalFile(identifier);
      console.log('✅ Archivo local eliminado:', result);
      return result;
    }

    const publicId = extractPublicIdFromUrl(identifier) || identifier;
    console.log(`🗑️ Eliminando archivo de Cloudinary: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Archivo eliminado de Cloudinary:`, result);
    return result;
  } catch (error) {
    console.error('❌ Error al eliminar archivo:', error);
    throw error;
  }
};

// Función para extraer el public_id de una URL de Cloudinary
const extractPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }
  
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      return null;
    }
    
    let publicIdParts = parts.slice(uploadIndex + 1);
    
    if (publicIdParts[0] && publicIdParts[0].startsWith('v') && /^\d+$/.test(publicIdParts[0].substring(1))) {
      publicIdParts = publicIdParts.slice(1);
    }
    
    return publicIdParts.join('/').replace(/\.[^/.]+$/, '');
  } catch (error) {
    console.error('❌ Error al extraer public_id:', error);
    return null;
  }
};

// Configuraciones específicas para diferentes tipos de archivos
const storageConfigs = {
  publicacionesCoalicion: getCloudinaryStorage('infografia'),
  multimedia: getCloudinaryStorage('multimedia'),
  arte: getCloudinaryStorage('arte'),
  presentaciones: getCloudinaryStorage('presentaciones'),
  videos: getCloudinaryStorage('videos'),
  general: getCloudinaryStorage('general')
};

module.exports = {
  cloudinarySdk,
  cloudinary,
  uploadsRoot,
  isLocalStorage,
  resolveStorageType,
  getCloudinaryStorage,
  buildPublicFileUrl,
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  storageConfigs
};