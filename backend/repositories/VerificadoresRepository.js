const BaseRepository = require('./BaseRepository');

class VerificadoresRepository extends BaseRepository {
    constructor() {
        super('verificadores');
        // Definir campos válidos para verificadores
        this.validFields = [
            'name', 'description', 'type', 'url', 'logo', 
            'features', 'isactive', 'slug', 'contact', 'socialmedia'
        ];
    }

    // Filtrar solo campos válidos para evitar errores de columnas inexistentes
    filterValidFields(data) {
        const filtered = {};
        Object.keys(data).forEach(key => {
            if (this.validFields.includes(key)) {
                filtered[key] = data[key];
            }
        });
        return filtered;
    }

    // Override del método update para filtrar campos
    async update(id, data) {
        const filteredData = this.filterValidFields(data);
        // Agregar timestamps
        filteredData.updated_at = new Date();
        return await super.update(id, filteredData);
    }

    // Override del método create para filtrar campos
    async create(data) {
        const filteredData = this.filterValidFields(data);
        // Agregar timestamps
        filteredData.created_at = new Date();
        filteredData.updated_at = new Date();
        return await super.create(filteredData);
    }

    // Obtener verificadores activos
    async findActive() {
        return await this.findAll(1, 100, { isactive: true });
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