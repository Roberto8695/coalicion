const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class PublicacionesRepository extends BaseRepository {
    constructor() {
        super('publicaciones');
    }

    // Obtener publicaciones con categoría
    async findAllWithCategory(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let query = `
                SELECT p.*, c.name as categoria_name, c.color as categoria_color 
                FROM ${this.tableName} p
                LEFT JOIN categorias c ON p.categoria_id = c.id
            `;
            let values = [];
            let whereConditions = [];

            // Agregar filtros
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== undefined && filters[key] !== null) {
                    if (key === 'categoria') {
                        whereConditions.push(`c.slug = $${values.length + 1}`);
                    } else {
                        whereConditions.push(`p.${key} = $${values.length + 1}`);
                    }
                    values.push(filters[key]);
                }
            });

            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }

            query += ` ORDER BY p.id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            values.push(limit, offset);

            const result = await pool.query(query, values);

            // Obtener total
            let countQuery = `
                SELECT COUNT(*) FROM ${this.tableName} p
                LEFT JOIN categorias c ON p.categoria_id = c.id
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
            throw new Error(`Error al obtener publicaciones con categoría: ${error.message}`);
        }
    }

    // Obtener publicaciones destacadas
    async findFeatured(limit = 5) {
        try {
            const query = `
                SELECT p.*, c.name as categoria_name, c.color as categoria_color 
                FROM ${this.tableName} p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE p.featured = true AND p.status = 'published'
                ORDER BY p.date DESC
                LIMIT $1
            `;
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener publicaciones destacadas: ${error.message}`);
        }
    }

    // Búsqueda avanzada en publicaciones
    async searchAdvanced(searchTerm, filters = {}, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            let query = `
                SELECT p.*, c.name as categoria_name, c.color as categoria_color 
                FROM ${this.tableName} p
                LEFT JOIN categorias c ON p.categoria_id = c.id
                WHERE (p.title ILIKE $1 OR p.description ILIKE $1 OR p.author ILIKE $1)
            `;
            let values = [`%${searchTerm}%`];

            // Agregar filtros adicionales
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== undefined && filters[key] !== null) {
                    if (key === 'categoria') {
                        query += ` AND c.slug = $${values.length + 1}`;
                    } else {
                        query += ` AND p.${key} = $${values.length + 1}`;
                    }
                    values.push(filters[key]);
                }
            });

            query += ` ORDER BY p.date DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            values.push(limit, offset);

            const result = await pool.query(query, values);
            return {
                data: result.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: result.rows.length
                }
            };
        } catch (error) {
            throw new Error(`Error en búsqueda avanzada de publicaciones: ${error.message}`);
        }
    }
}

module.exports = PublicacionesRepository;