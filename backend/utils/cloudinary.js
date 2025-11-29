const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para obtener la configuración de storage según el tipo de archivo
const getCloudinaryStorage = (folder = 'uploads') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `coalicion/${folder}`, // Organizamos por carpetas
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'pdf', 'mp4', 'avi', 'mov', 'mkv', 'ppt', 'pptx'],
      resource_type: 'auto', // Detecta automáticamente si es imagen, video, etc.
      public_id: (req, file) => {
        // Generar un ID único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = file.originalname.split('.').pop();
        return `${file.fieldname}-${uniqueSuffix}`;
      },
    },
  });
};

// Función para eliminar un archivo de Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    console.log(`🗑️ Eliminando archivo de Cloudinary: ${publicId}`);
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✅ Archivo eliminado de Cloudinary:`, result);
    return result;
  } catch (error) {
    console.error('❌ Error al eliminar archivo de Cloudinary:', error);
    throw error;
  }
};

// Función para extraer el public_id de una URL de Cloudinary
const extractPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) {
    console.log('🔍 URL no es de Cloudinary:', url);
    return null;
  }
  
  try {
    // Extraer el public_id de la URL de Cloudinary
    // Ejemplo: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/coalicion/infografia/imagen-123456789.jpg
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      console.log('🔍 No se encontró "upload" en la URL:', url);
      return null;
    }
    
    // El public_id está después de 'upload/v{version}/' o 'upload/'
    let publicIdParts = parts.slice(uploadIndex + 1);
    
    // Si hay versión, omitirla
    if (publicIdParts[0] && publicIdParts[0].startsWith('v') && /^\d+$/.test(publicIdParts[0].substring(1))) {
      publicIdParts = publicIdParts.slice(1);
    }
    
    // Unir las partes y remover la extensión
    const publicId = publicIdParts.join('/').replace(/\.[^/.]+$/, '');
    
    console.log(`🔍 Public ID extraído: ${publicId} de URL: ${url}`);
    return publicId;
  } catch (error) {
    console.error('❌ Error al extraer public_id:', error);
    return null;
  }
};

// Configuraciones específicas para diferentes tipos de archivos
const storageConfigs = {
  // Imágenes para publicaciones de coalición
  publicacionesCoalicion: getCloudinaryStorage('infografia'),
  
  // Imágenes para publicaciones de tendencias
  publicacionesTendencias: getCloudinaryStorage('publicaciones-tendencias'),
  
  // Multimedia general
  multimedia: getCloudinaryStorage('multimedia'),
  
  // Arte
  arte: getCloudinaryStorage('arte'),
  
  // Presentaciones
  presentaciones: getCloudinaryStorage('presentaciones'),
  
  // Videos
  videos: getCloudinaryStorage('videos'),
  
  // General
  general: getCloudinaryStorage('general')
};

// Configuraciones específicas para cada tipo de contenido
const cloudinaryStoragePublicacionesCoalicion = getCloudinaryStorage('infografia');
const cloudinaryStoragePublicacionesTendencias = getCloudinaryStorage('publicaciones-tendencias');
const cloudinaryStorageMultimedia = getCloudinaryStorage('multimedia');

module.exports = {
  cloudinary,
  getCloudinaryStorage,
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  storageConfigs,
  cloudinaryStoragePublicacionesCoalicion,
  cloudinaryStoragePublicacionesTendencias,
  cloudinaryStorageMultimedia
};