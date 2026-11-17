const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class TiposNoticiaRepository extends BaseRepository {
    constructor() {
        super('tipos_noticia');
    }

    async findActive() {
        const result = await pool.query(
            'SELECT id, name, slug, color, is_active, created_at, updated_at FROM tipos_noticia WHERE is_active = TRUE ORDER BY name'
        );
        return result.rows;
    }

    async isActiveSlug(slug) {
        const result = await pool.query(
            'SELECT 1 FROM tipos_noticia WHERE slug = $1 AND is_active = TRUE',
            [slug]
        );
        return result.rowCount > 0;
    }
}

module.exports = TiposNoticiaRepository;
