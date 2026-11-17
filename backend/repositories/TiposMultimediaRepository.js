const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class TiposMultimediaRepository extends BaseRepository {
    constructor() {
        super('tipos_multimedia');
    }

    async findActive() {
        const result = await pool.query(
            'SELECT id, name, slug, color, is_active, created_at, updated_at FROM tipos_multimedia WHERE is_active = TRUE ORDER BY name'
        );
        return result.rows;
    }

    async isActiveSlug(slug) {
        const result = await pool.query(
            'SELECT 1 FROM tipos_multimedia WHERE slug = $1 AND is_active = TRUE',
            [slug]
        );
        return result.rowCount > 0;
    }
}

module.exports = TiposMultimediaRepository;
