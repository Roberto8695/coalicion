const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class GuiasElectoralesRepository extends BaseRepository {
    constructor() {
        super('guias_electorales');
    }

    // Obtener guías por categoría
    async findByCategory(category, page = 1, limit = 10) {
        return await this.findAll(page, limit, { category });
    }

    // Obtener guías por tipo de archivo
    async findByType(type, page = 1, limit = 10) {
        return await this.findAll(page, limit, { type });
    }

    // Obtener guías más recientes
    async findRecent(limit = 10) {
        try {
            const query = `
                SELECT * FROM ${this.tableName}
                ORDER BY date DESC
                LIMIT $1
            `;
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw new Error(`Error al obtener guías recientes: ${error.message}`);
        }
    }

    // Búsqueda en guías
    async searchGuias(searchTerm, page = 1, limit = 10) {
        return await this.search(searchTerm, ['title', 'description'], page, limit);
    }
}

module.exports = GuiasElectoralesRepository;