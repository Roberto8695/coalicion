const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class PublicacionesCoalicionRepository extends BaseRepository {
    constructor() {
        super('publicaciones_coalicion');
    }

    // Obtener publicaciones de coalición con paginación y filtros
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
                        // Búsqueda en título y descripción
                        whereConditions.push(`(titulo ILIKE $${values.length + 1} OR descripcion ILIKE $${values.length + 1})`);
                        values.push(`%${filters[key]}%`);
                    } else if (key === 'fecha_desde') {
                        whereConditions.push(`fecha_publi >= $${values.length + 1}`);
                        values.push(filters[key]);
                    } else if (key === 'fecha_hasta') {
                        whereConditions.push(`fecha_publi <= $${values.length + 1}`);
                        values.push(filters[key]);
                    } else {
                        whereConditions.push(`${key} = $${values.length + 1}`);
                        values.push(filters[key]);
                    }
                }
            });

            if (whereConditions.length > 0) {
                query += ` WHERE ${whereConditions.join(' AND ')}`;
            }

            query += ` ORDER BY fecha_publi DESC, created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
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
            throw new Error(`Error al obtener publicaciones de coalición: ${error.message}`);
        }
    }

    // Obtener publicaciones recientes
    async findRecent(limit = 5) {
        try {
            const query = `
                SELECT * FROM ${this.tableName}
                ORDER BY fecha_publi DESC, created_at DESC
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
                WHERE titulo ILIKE $1 OR descripcion ILIKE $1
                ORDER BY fecha_publi DESC, created_at DESC
                LIMIT $2 OFFSET $3
            `;
            const values = [`%${searchTerm}%`, limit, offset];
            const result = await pool.query(query, values);

            // Obtener total para la búsqueda
            const countQuery = `
                SELECT COUNT(*) FROM ${this.tableName}
                WHERE titulo ILIKE $1 OR descripcion ILIKE $1
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
            throw new Error(`Error en búsqueda de publicaciones de coalición: ${error.message}`);
        }
    }

    // Obtener por rango de fechas
    async findByDateRange(fechaDesde, fechaHasta, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE fecha_publi BETWEEN $1 AND $2
                ORDER BY fecha_publi DESC, created_at DESC
                LIMIT $3 OFFSET $4
            `;
            const values = [fechaDesde, fechaHasta, limit, offset];
            const result = await pool.query(query, values);

            // Obtener total para el rango de fechas
            const countQuery = `
                SELECT COUNT(*) FROM ${this.tableName}
                WHERE fecha_publi BETWEEN $1 AND $2
            `;
            const countResult = await pool.query(countQuery, [fechaDesde, fechaHasta]);
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
            throw new Error(`Error al obtener publicaciones por rango de fechas: ${error.message}`);
        }
    }

    // Obtener publicaciones por año
    async findByYear(year, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT * FROM ${this.tableName}
                WHERE EXTRACT(YEAR FROM fecha_publi) = $1
                ORDER BY fecha_publi DESC, created_at DESC
                LIMIT $2 OFFSET $3
            `;
            const values = [year, limit, offset];
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
            throw new Error(`Error al obtener publicaciones por año: ${error.message}`);
        }
    }

    // Obtener estadísticas
    async getStats() {
        try {
            const totalQuery = `SELECT COUNT(*) as total FROM ${this.tableName}`;
            const recentQuery = `
                SELECT COUNT(*) as recent FROM ${this.tableName} 
                WHERE created_at >= NOW() - INTERVAL '30 days'
            `;
            const withImageQuery = `SELECT COUNT(*) as with_image FROM ${this.tableName} WHERE imagen IS NOT NULL AND imagen != ''`;
            const withUrlQuery = `SELECT COUNT(*) as with_url FROM ${this.tableName} WHERE url IS NOT NULL AND url != ''`;

            const [totalResult, recentResult, withImageResult, withUrlResult] = await Promise.all([
                pool.query(totalQuery),
                pool.query(recentQuery),
                pool.query(withImageQuery),
                pool.query(withUrlQuery)
            ]);

            return {
                total: parseInt(totalResult.rows[0].total),
                recent: parseInt(recentResult.rows[0].recent),
                withImage: parseInt(withImageResult.rows[0].with_image),
                withUrl: parseInt(withUrlResult.rows[0].with_url)
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

module.exports = PublicacionesCoalicionRepository;