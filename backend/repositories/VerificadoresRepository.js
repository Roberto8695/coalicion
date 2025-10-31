const BaseRepository = require('./BaseRepository');

class VerificadoresRepository extends BaseRepository {
    constructor() {
        super('verificadores');
    }

    // Obtener verificadores activos
    async findActive() {
        return await this.findAll(1, 100, { isActive: true });
    }

    // Obtener verificadores por tipo
    async findByType(type, page = 1, limit = 10) {
        return await this.findAll(page, limit, { type });
    }

    // Búsqueda en verificadores
    async searchVerificadores(searchTerm, page = 1, limit = 10) {
        return await this.search(searchTerm, ['name', 'description'], page, limit);
    }
}

module.exports = VerificadoresRepository;