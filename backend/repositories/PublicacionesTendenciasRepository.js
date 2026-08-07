const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class PublicacionesTendenciasRepository extends BaseRepository {
    constructor() {
        super('publicaciones_tendencias');
    }

    // Obtener publicaciones de tendencias con paginación y filtros
    async findAllWithFilters(page = 1, limit = 10, filters = {}) {
        try {
            const offset = (page - 1) * limit;
            let query = `SELECT * FROM ${this.tableName}`;
            let values = [];
            let whereConditions = [];

            // Agregar filtros
            Object.keys(filters).forEach((key) => {
                if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                    if (key === 'search') {
                        // Búsqueda en título, descripción y autor
                        whereConditions.push(`(titulo ILIKE $${values.length + 1} OR descripcion ILIKE $${values.length + 1} OR autor ILIKE $${values.length + 1})`);
                        values.push(`%${filters[key]}%`);
                    } else {
                        whereConditions.push(`${key} = $${values.length + 1}`);
                        values.push(filters[key]);
                    }
                }
            });

            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }

            query += ` ORDER BY createdat DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
            values.push(limit, offset);

            const result = await pool.query(query, values);

            // Obtener total
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
            throw new Error(`Error al obtener publicaciones de tendencias: ${error.message}`);
        }
    }

    // Obtener publicaciones recientes
    async findRecent(limit = 5) {
        try {
            const query = `
                SELECT * FROM ${this.tableName}
                ORDER BY createdat DESC
                LIMIT $1
            `;
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener publicaciones recientes: ${error.message}`);
        }
    }

    // Búsqueda por término
    async search(searchTerm, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE titulo ILIKE $1 OR descripcion ILIKE $1 OR autor ILIKE $1
                ORDER BY createdat DESC
                LIMIT $2 OFFSET $3
            `;
            const values = [`%${searchTerm}%`, limit, offset];
            const result = await pool.query(query, values);

            // Obtener total para la búsqueda
            const countQuery = `
                SELECT COUNT(*) FROM ${this.tableName}
                WHERE titulo ILIKE $1 OR descripcion ILIKE $1 OR autor ILIKE $1
            `;
            const countResult = await pool.query(countQuery, [`%${searchTerm}%`]);
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
            throw new Error(`Error en búsqueda de publicaciones de tendencias: ${error.message}`);
        }
    }

    // Obtener por autor
    async findByAuthor(autor, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE autor ILIKE $1
                ORDER BY createdat DESC
                LIMIT $2 OFFSET $3
            `;
            const values = [`%${autor}%`, limit, offset];
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
            throw new Error(`Error al obtener publicaciones por autor: ${error.message}`);
        }
    }
}

module.exports = PublicacionesTendenciasRepository;