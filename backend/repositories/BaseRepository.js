const { pool } = require('../config/db');

class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
    }

    // Obtener todos los registros con paginación opcional
    async findAll(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let query = `SELECT * FROM ${this.tableName}`;
            let values = [];
            let whereConditions = [];

            // Agregar filtros dinámicos
            Object.keys(filters).forEach((key, index) => {
                if (filters[key] !== undefined && filters[key] !== null) {
                    whereConditions.push(`${key} = $${values.length + 1}`);
                    values.push(filters[key]);
                }
            });

            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }

            query += ` ORDER BY id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            values.push(limit, offset);

            const result = await pool.query(query, values);
            
            // Obtener total de registros para paginación
            let countQuery = `SELECT COUNT(*) FROM ${this.tableName}`;
            if (whereConditions.length > 0) {
                countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
            }
            const countResult = await pool.query(countQuery, values.slice(0, -2));
            const total = parseInt(countResult.rows[0].count);

            return {
                data: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error al obtener registros de ${this.tableName}: ${error.message}`);
        }
    }

    // Obtener registro por ID
    async findById(id) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener registro por ID en ${this.tableName}: ${error.message}`);
        }
    }

    // Obtener registro por slug
    async findBySlug(slug) {
        try {
            const query = `SELECT * FROM ${this.tableName} WHERE slug = $1`;
            const result = await pool.query(query, [slug]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener registro por slug en ${this.tableName}: ${error.message}`);
        }
    }

    // Crear nuevo registro
    async create(data) {
        try {
            const columns = Object.keys(data);
            const placeholders = columns.map((_, index) => `$${index + 1}`);
            const values = Object.values(data);

            const query = `
                INSERT INTO ${this.tableName} (${columns.join(', ')})
                VALUES (${placeholders.join(', ')})
                RETURNING *
            `;

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al crear registro en ${this.tableName}: ${error.message}`);
        }
    }

    // Actualizar registro
    async update(id, data) {
        try {
            const columns = Object.keys(data);
            const setClause = columns.map((col, index) => `${col} = $${index + 2}`);
            const values = [id, ...Object.values(data)];

            const query = `
                UPDATE ${this.tableName}
                SET ${setClause.join(', ')}
                WHERE id = $1
                RETURNING *
            `;

            const result = await pool.query(query, values);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error al actualizar registro en ${this.tableName}: ${error.message}`);
        }
    }

    // Eliminar registro
    async delete(id) {
        try {
            const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        } catch (error) {
            throw new Error(`Error al eliminar registro en ${this.tableName}: ${error.message}`);
        }
    }

    // Búsqueda por texto en campos específicos
    async search(searchTerm, searchFields = ['title'], page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const searchConditions = searchFields.map((field, index) => 
                `${field} ILIKE $${index + 1}`
            );
            const searchValues = searchFields.map(() => `%${searchTerm}%`);

            const query = `
                SELECT * FROM ${this.tableName}
                WHERE ${searchConditions.join(' OR ')}
                ORDER BY id DESC
                LIMIT $${searchFields.length + 1} OFFSET $${searchFields.length + 2}
            `;

            const values = [...searchValues, limit, offset];
            const result = await pool.query(query, values);

            // Obtener total para paginación
            const countQuery = `
                SELECT COUNT(*) FROM ${this.tableName}
                WHERE ${searchConditions.join(' OR ')}
            `;
            const countResult = await pool.query(countQuery, searchValues);
            const total = parseInt(countResult.rows[0].count);

            return {
                data: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            throw new Error(`Error en búsqueda en ${this.tableName}: ${error.message}`);
        }
    }
}

module.exports = BaseRepository;