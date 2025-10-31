const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class MultimediaRepository extends BaseRepository {
    constructor() {
        super('multimedia');
    }

    // Obtener multimedia con categoría
    async findAllWithCategory(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let query = `
                SELECT m.*, c.name as categoria_name, c.color as categoria_color 
                FROM ${this.tableName} m
                LEFT JOIN categorias c ON m.categoria_id = c.id
            `;
            let values = [];
            let whereConditions = [];

            // Agregar filtros
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== undefined && filters[key] !== null) {
                    if (key === 'categoria') {
                        whereConditions.push(`c.slug = $${values.length + 1}`);
                    } else {
                        whereConditions.push(`m.${key} = $${values.length + 1}`);
                    }
                    values.push(filters[key]);
                }
            });

            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }

            query += ` ORDER BY m.id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            values.push(limit, offset);

            const result = await pool.query(query, values);

            // Obtener total
            let countQuery = `
                SELECT COUNT(*) FROM ${this.tableName} m
                LEFT JOIN categorias c ON m.categoria_id = c.id
            `;
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
            throw new Error(`Error al obtener multimedia con categoría: ${error.message}`);
        }
    }

    // Obtener multimedia por tipo
    async findByType(type, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT m.*, c.name as categoria_name, c.color as categoria_color 
                FROM ${this.tableName} m
                LEFT JOIN categorias c ON m.categoria_id = c.id
                WHERE m.type = $1
                ORDER BY m.id DESC
                LIMIT $2 OFFSET $3
            `;
            const result = await pool.query(query, [type, limit, offset]);

            // Obtener total
            const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE type = $1`;
            const countResult = await pool.query(countQuery, [type]);
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
            throw new Error(`Error al obtener multimedia por tipo: ${error.message}`);
        }
    }

    // Obtener multimedia destacada
    async findFeatured(limit = 5) {
        try {
            const query = `
                SELECT m.*, c.name as categoria_name, c.color as categoria_color 
                FROM ${this.tableName} m
                LEFT JOIN categorias c ON m.categoria_id = c.id
                WHERE m.featured = true
                ORDER BY m.id DESC
                LIMIT $1
            `;
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener multimedia destacada: ${error.message}`);
        }
    }
}

module.exports = MultimediaRepository;