const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class NoticiasRepository extends BaseRepository {
    constructor() {
        super('noticias');
    }

    // Obtener noticias por status
    async findByStatus(status, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE status = $1
                ORDER BY date DESC
                LIMIT $2 OFFSET $3
            `;
            const result = await pool.query(query, [status, limit, offset]);

            // Obtener total
            const countQuery = `SELECT COUNT(*) FROM ${this.tableName} WHERE status = $1`;
            const countResult = await pool.query(countQuery, [status]);
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
            throw new Error(`Error al obtener noticias por status: ${error.message}`);
        }
    }

    // Obtener eventos próximos
    async findUpcoming(limit = 10) {
        try {
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE status = 'upcoming' AND date > NOW()
                ORDER BY date ASC
                LIMIT $1
            `;
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener eventos próximos: ${error.message}`);
        }
    }

    // Obtener eventos por rango de fechas
    async findByDateRange(startDate, endDate, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE date BETWEEN $1 AND $2
                ORDER BY date ASC
                LIMIT $3 OFFSET $4
            `;
            const result = await pool.query(query, [startDate, endDate, limit, offset]);

            // Obtener total
            const countQuery = `
                SELECT COUNT(*) FROM ${this.tableName}
                WHERE date BETWEEN $1 AND $2
            `;
            const countResult = await pool.query(countQuery, [startDate, endDate]);
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
            throw new Error(`Error al obtener eventos por rango de fechas: ${error.message}`);
        }
    }

    // Obtener noticias destacadas
    async findFeatured(limit = 5) {
        try {
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE featured = true
                ORDER BY date DESC
                LIMIT $1
            `;
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener noticias destacadas: ${error.message}`);
        }
    }
}

module.exports = NoticiasRepository;