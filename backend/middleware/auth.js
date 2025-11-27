const jwt = require('jsonwebtoken');
const UsuariosRepository = require('../repositories/UsuariosRepository');

const usuariosRepository = new UsuariosRepository();

// Middleware para verificar token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acceso requerido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'coalicion_secret_key');
    
    // Verificar que el usuario aún existe y está activo
    const usuario = await usuariosRepository.findById(decoded.id);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o usuario inactivo'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      nombre: usuario.nombre
    };

    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para autorizar roles específicos
const authorizeRoles = (rolesPermitidos) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      if (!rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a este recurso'
        });
      }

      next();
    } catch (error) {
      console.error('Error en autorización:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

// Middleware para verificar permisos de administrador
const requireAdmin = authorizeRoles(['administrador']);

// Middleware para verificar permisos de editor o administrador
const requireEditor = authorizeRoles(['administrador', 'editor']);

// Middleware para verificar que es el mismo usuario o administrador
const requireOwnershipOrAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id);

    // Si es administrador, permitir acceso
    if (req.user.rol === 'administrador') {
      return next();
    }

    // Si es el mismo usuario, permitir acceso
    if (req.user.id === userId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para acceder a este recurso'
    });
  } catch (error) {
    console.error('Error en verificación de propiedad:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para operaciones CRUD en publicaciones
const requirePublicationAccess = (operation) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Solo lecturas (GET) están permitidas para todos los usuarios autenticados
      if (operation === 'read') {
        return next();
      }

      // Crear, actualizar y eliminar: permitido para editores y administradores
      if (operation === 'create' || operation === 'update' || operation === 'delete') {
        if (!['administrador', 'editor'].includes(req.user.rol)) {
          return res.status(403).json({
            success: false,
            message: 'Solo los administradores y editores pueden realizar esta operación'
          });
        }
        return next();
      }

      next();
    } catch (error) {
      console.error('Error en verificación de acceso a publicaciones:', error);
      return res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
};

// Middleware para gestión de usuarios - Solo administradores
const requireUserManagement = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    if (req.user.rol !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden gestionar usuarios'
      });
    }

    next();
  } catch (error) {
    console.error('Error en verificación de gestión de usuarios:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función para generar token JWT
const generateToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol
    },
    process.env.JWT_SECRET || 'coalicion_secret_key',
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  requireAdmin,
  requireEditor,
  requireOwnershipOrAdmin,
  requirePublicationAccess,
  requireUserManagement,
  generateToken
};