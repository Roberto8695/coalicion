const BaseRepository = require('./BaseRepository');

class CategoriasRepository extends BaseRepository {
    constructor() {
        super('categorias');
    }

    // Obtener categorías activas
    async findActive() {
        return await this.findAll(1, 100, { isActive: true });
    }

    // Búsqueda en categorías
    async searchCategorias(searchTerm, page = 1, limit = 10) {
        return await this.search(searchTerm, ['name', 'description'], page, limit);
    }
}

module.exports = CategoriasRepository;