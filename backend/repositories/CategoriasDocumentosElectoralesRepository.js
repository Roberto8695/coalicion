const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class CategoriasDocumentosElectoralesRepository extends BaseRepository {
    constructor() {
        super('categorias_documentos_electorales');
    }

    async findActive() {
        const result = await pool.query(`
            SELECT *
            FROM ${this.tableName}
            WHERE is_active = TRUE
            ORDER BY name ASC
        `);
        return result.rows;
    }

    async existsActiveSlug(slug, excludeId = null) {
        const values = [slug];
        let query = `SELECT 1 FROM ${this.tableName} WHERE slug = $1 AND is_active = TRUE`;
        if (excludeId !== null) {
            values.push(excludeId);
            query += ' AND id <> $2';
        }
        const result = await pool.query(query, values);
        return result.rowCount > 0;
    }
}

module.exports = CategoriasDocumentosElectoralesRepository;
