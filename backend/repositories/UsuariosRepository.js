const BaseRepository = require('./BaseRepository');
const bcrypt = require('bcryptjs');

class UsuariosRepository extends BaseRepository {
  constructor() {
    super('usuarios');
  }

  // Crear nuevo usuario
  async create(userData) {
    const { nombre, correo, password, rol = 'lector' } = userData;
    
    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO usuarios (nombre, correo, password, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, correo, rol, activo, createdat, updatedat
    `;
    
    const values = [nombre, correo, hashedPassword, rol];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  // Obtener usuario por correo (para login)
  async findByEmail(correo) {
    const query = `
      SELECT id, nombre, correo, password, rol, activo, createdat, updatedat
      FROM usuarios 
      WHERE correo = $1 AND activo = true
    `;
    
    const result = await this.db.query(query, [correo]);
    return result.rows[0];
  }

  // Obtener usuario por ID (sin password)
  async findById(id) {
    const query = `
      SELECT id, nombre, correo, rol, activo, createdat, updatedat
      FROM usuarios 
      WHERE id = $1
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0];
  }

  // Obtener todos los usuarios (sin passwords)
  async getAll(filters = {}) {
    const { page = 1, limit = 10, rol, activo, search } = filters;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT id, nombre, correo, rol, activo, createdat, updatedat
      FROM usuarios 
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 0;

    // Filtro por rol
    if (rol) {
      paramCount++;
      query += ` AND rol = $${paramCount}`;
      values.push(rol);
    }

    // Filtro por estado activo
    if (activo !== undefined) {
      paramCount++;
      query += ` AND activo = $${paramCount}`;
      values.push(activo);
    }

    // Filtro de búsqueda
    if (search) {
      paramCount++;
      query += ` AND (nombre ILIKE $${paramCount} OR correo ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }

    // Contar total de registros
    const countQuery = query.replace(
      'SELECT id, nombre, correo, rol, activo, createdat, updatedat',
      'SELECT COUNT(*)'
    );
    const countResult = await this.db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Agregar ordenamiento y paginación
    query += ` ORDER BY createdat DESC`;
    
    if (limit && limit !== -1) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(limit);
      
      paramCount++;
      query += ` OFFSET $${paramCount}`;
      values.push(offset);
    }

    const result = await this.db.query(query, values);
    
    return {
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: limit === -1 ? 1 : Math.ceil(total / limit)
      }
    };
  }

  // Actualizar usuario
  async update(id, userData) {
    const { nombre, correo, rol, activo } = userData;
    
    // Si se proporciona una nueva contraseña, hashearla
    let hashedPassword = null;
    if (userData.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    }
    
    let query = `UPDATE usuarios SET updatedat = CURRENT_TIMESTAMP`;
    const values = [];
    let paramCount = 0;

    if (nombre !== undefined) {
      paramCount++;
      query += `, nombre = $${paramCount}`;
      values.push(nombre);
    }

    if (correo !== undefined) {
      paramCount++;
      query += `, correo = $${paramCount}`;
      values.push(correo);
    }

    if (hashedPassword) {
      paramCount++;
      query += `, password = $${paramCount}`;
      values.push(hashedPassword);
    }

    if (rol !== undefined) {
      paramCount++;
      query += `, rol = $${paramCount}`;
      values.push(rol);
    }

    if (activo !== undefined) {
      paramCount++;
      query += `, activo = $${paramCount}`;
      values.push(activo);
    }

    paramCount++;
    query += ` WHERE id = $${paramCount} RETURNING id, nombre, correo, rol, activo, createdat, updatedat`;
    values.push(id);

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  // Verificar contraseña
  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Cambiar contraseña
  async changePassword(id, newPassword) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const query = `
      UPDATE usuarios 
      SET password = $1, updatedat = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING id, nombre, correo, rol, activo, updatedat
    `;
    
    const result = await this.db.query(query, [hashedPassword, id]);
    return result.rows[0];
  }

  // Activar/Desactivar usuario
  async toggleActive(id) {
    const query = `
      UPDATE usuarios 
      SET activo = NOT activo, updatedat = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING id, nombre, correo, rol, activo, updatedat
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0];
  }

  // Obtener estadísticas de usuarios
  async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE activo = true) as activos,
        COUNT(*) FILTER (WHERE rol = 'administrador') as administradores,
        COUNT(*) FILTER (WHERE rol = 'editor') as editores,
        COUNT(*) FILTER (WHERE rol = 'lector') as lectores,
        COUNT(*) FILTER (WHERE createdat >= CURRENT_DATE - INTERVAL '30 days') as nuevos_ultimo_mes
      FROM usuarios
    `;
    
    const result = await this.db.query(query);
    return result.rows[0];
  }

  // Verificar si un correo ya existe
  async emailExists(correo, excludeId = null) {
    let query = `SELECT id FROM usuarios WHERE correo = $1`;
    const values = [correo];
    
    if (excludeId) {
      query += ` AND id != $2`;
      values.push(excludeId);
    }
    
    const result = await this.db.query(query, values);
    return result.rows.length > 0;
  }

  // Soft delete (marcar como inactivo)
  async softDelete(id) {
    const query = `
      UPDATE usuarios 
      SET activo = false, updatedat = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING id, nombre, correo, rol, activo, updatedat
    `;
    
    const result = await this.db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = UsuariosRepository;