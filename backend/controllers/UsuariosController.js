const BaseController = require('./BaseController');
const UsuariosRepository = require('../repositories/UsuariosRepository');
const jwt = require('jsonwebtoken');

class UsuariosController extends BaseController {
  constructor() {
    const usuariosRepository = new UsuariosRepository();
    super(usuariosRepository);
    this.usuariosRepository = usuariosRepository;
  }

  // Obtener todos los usuarios con filtros
  async getAll(req, res) {
    try {
      const filters = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        rol: req.query.rol,
        activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined,
        search: req.query.search
      };

      const result = await this.usuariosRepository.getAll(filters);
      
      return this.success(res, result, 'Usuarios obtenidos exitosamente');
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return this.error(res, 'Error al obtener usuarios', 500);
    }
  }

  // Obtener usuario por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return this.error(res, 'ID de usuario inválido', 400);
      }

      const usuario = await this.usuariosRepository.findById(parseInt(id));
      
      if (!usuario) {
        return this.error(res, 'Usuario no encontrado', 404);
      }

      return this.success(res, usuario, 'Usuario obtenido exitosamente');
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return this.error(res, 'Error al obtener usuario', 500);
    }
  }

  // Crear nuevo usuario
  async create(req, res) {
    try {
      const { nombre, correo, password, rol } = req.body;

      // Validaciones
      if (!nombre || !correo || !password) {
        return this.error(res, 'Nombre, correo y contraseña son requeridos', 400);
      }

      if (!['administrador', 'editor', 'lector'].includes(rol)) {
        return this.error(res, 'Rol inválido. Debe ser: administrador, editor o lector', 400);
      }

      // Validar formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        return this.error(res, 'Formato de correo inválido', 400);
      }

      // Validar que la contraseña tenga al menos 6 caracteres
      if (password.length < 6) {
        return this.error(res, 'La contraseña debe tener al menos 6 caracteres', 400);
      }

      // Verificar si el correo ya existe
      const emailExists = await this.usuariosRepository.emailExists(correo);
      if (emailExists) {
        return this.error(res, 'El correo electrónico ya está registrado', 400);
      }

      const nuevoUsuario = await this.usuariosRepository.create({
        nombre: nombre.trim(),
        correo: correo.toLowerCase().trim(),
        password,
        rol
      });

      return this.success(res, nuevoUsuario, 'Usuario creado exitosamente', 201);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return this.error(res, 'Error al crear usuario', 500);
    }
  }

  // Actualizar usuario
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, correo, password, rol, activo } = req.body;

      if (!id || isNaN(id)) {
        return this.error(res, 'ID de usuario inválido', 400);
      }

      // Verificar que el usuario existe
      const usuarioExistente = await this.usuariosRepository.findById(parseInt(id));
      if (!usuarioExistente) {
        return this.error(res, 'Usuario no encontrado', 404);
      }

      // Validaciones
      if (correo) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
          return this.error(res, 'Formato de correo inválido', 400);
        }

        // Verificar si el correo ya existe (excluyendo el usuario actual)
        const emailExists = await this.usuariosRepository.emailExists(correo, parseInt(id));
        if (emailExists) {
          return this.error(res, 'El correo electrónico ya está registrado', 400);
        }
      }

      if (password && password.length < 6) {
        return this.error(res, 'La contraseña debe tener al menos 6 caracteres', 400);
      }

      if (rol && !['administrador', 'editor', 'lector'].includes(rol)) {
        return this.error(res, 'Rol inválido. Debe ser: administrador, editor o lector', 400);
      }

      const updateData = {};
      if (nombre !== undefined) updateData.nombre = nombre.trim();
      if (correo !== undefined) updateData.correo = correo.toLowerCase().trim();
      if (password !== undefined) updateData.password = password;
      if (rol !== undefined) updateData.rol = rol;
      if (activo !== undefined) updateData.activo = activo;

      const usuarioActualizado = await this.usuariosRepository.update(parseInt(id), updateData);

      return this.success(res, usuarioActualizado, 'Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return this.error(res, 'Error al actualizar usuario', 500);
    }
  }

  // Eliminar usuario (soft delete)
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return this.error(res, 'ID de usuario inválido', 400);
      }

      const usuario = await this.usuariosRepository.findById(parseInt(id));
      if (!usuario) {
        return this.error(res, 'Usuario no encontrado', 404);
      }

      await this.usuariosRepository.softDelete(parseInt(id));

      return this.success(res, null, 'Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return this.error(res, 'Error al eliminar usuario', 500);
    }
  }

  // Activar/Desactivar usuario
  async toggleActive(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return this.error(res, 'ID de usuario inválido', 400);
      }

      const usuario = await this.usuariosRepository.findById(parseInt(id));
      if (!usuario) {
        return this.error(res, 'Usuario no encontrado', 404);
      }

      const usuarioActualizado = await this.usuariosRepository.toggleActive(parseInt(id));

      const mensaje = usuarioActualizado.activo ? 'Usuario activado' : 'Usuario desactivado';
      return this.success(res, usuarioActualizado, mensaje);
    } catch (error) {
      console.error('Error al cambiar estado del usuario:', error);
      return this.error(res, 'Error al cambiar estado del usuario', 500);
    }
  }

  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!id || isNaN(id)) {
        return this.error(res, 'ID de usuario inválido', 400);
      }

      if (!currentPassword || !newPassword) {
        return this.error(res, 'Contraseña actual y nueva contraseña son requeridas', 400);
      }

      if (newPassword.length < 6) {
        return this.error(res, 'La nueva contraseña debe tener al menos 6 caracteres', 400);
      }

      // Obtener usuario con contraseña para verificar
      const usuario = await this.usuariosRepository.findByEmail(
        (await this.usuariosRepository.findById(parseInt(id))).correo
      );

      if (!usuario) {
        return this.error(res, 'Usuario no encontrado', 404);
      }

      // Verificar contraseña actual
      const passwordValida = await this.usuariosRepository.verifyPassword(currentPassword, usuario.password);
      if (!passwordValida) {
        return this.error(res, 'Contraseña actual incorrecta', 400);
      }

      const usuarioActualizado = await this.usuariosRepository.changePassword(parseInt(id), newPassword);

      return this.success(res, usuarioActualizado, 'Contraseña cambiada exitosamente');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return this.error(res, 'Error al cambiar contraseña', 500);
    }
  }

  // Obtener estadísticas de usuarios
  async getStats(req, res) {
    try {
      const stats = await this.usuariosRepository.getStats();
      return this.success(res, stats, 'Estadísticas obtenidas exitosamente');
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return this.error(res, 'Error al obtener estadísticas', 500);
    }
  }

  // Login de usuario
  async login(req, res) {
    try {
      const { correo, password } = req.body;

      if (!correo || !password) {
        return this.error(res, 'Correo y contraseña son requeridos', 400);
      }

      // Buscar usuario por correo
      const usuario = await this.usuariosRepository.findByEmail(correo.toLowerCase().trim());
      if (!usuario) {
        return this.error(res, 'Credenciales inválidas', 401);
      }

      // Verificar contraseña
      const passwordValida = await this.usuariosRepository.verifyPassword(password, usuario.password);
      if (!passwordValida) {
        return this.error(res, 'Credenciales inválidas', 401);
      }

      // Generar JWT token
      const token = jwt.sign(
        { 
          id: usuario.id, 
          correo: usuario.correo, 
          rol: usuario.rol 
        },
        process.env.JWT_SECRET || 'coalicion_secret_key',
        { expiresIn: '24h' }
      );

      // Eliminar password de la respuesta
      const { password: _, ...usuarioSinPassword } = usuario;

      return this.success(res, {
        usuario: usuarioSinPassword,
        token
      }, 'Login exitoso');
    } catch (error) {
      console.error('Error en login:', error);
      return this.error(res, 'Error en login', 500);
    }
  }

  // Obtener perfil del usuario autenticado
  async getProfile(req, res) {
    try {
      const usuario = await this.usuariosRepository.findById(req.user.id);
      if (!usuario) {
        return this.error(res, 'Usuario no encontrado', 404);
      }

      return this.success(res, usuario, 'Perfil obtenido exitosamente');
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return this.error(res, 'Error al obtener perfil', 500);
    }
  }
}

module.exports = UsuariosController;