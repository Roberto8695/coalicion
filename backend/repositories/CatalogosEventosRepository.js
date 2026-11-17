const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class CatalogosEventosRepository extends BaseRepository {
    constructor(tableName) {
        super(tableName);
    }

    async findActive() {
        const result = await pool.query(
            `SELECT id, name, slug, color, is_active, created_at, updated_at
             FROM ${this.tableName} WHERE is_active = TRUE ORDER BY name`
        );
        return result.rows;
    }

    async isActiveSlug(slug) {
        const result = await pool.query(
            `SELECT 1 FROM ${this.tableName} WHERE slug = $1 AND is_active = TRUE`,
            [slug]
        );
        return result.rowCount > 0;
    }
}

module.exports = CatalogosEventosRepository;
