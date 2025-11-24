const BaseRepository = require('./BaseRepository');
const { pool } = require('../config/db');

class EventosRepository extends BaseRepository {
    constructor() {
        super('eventos');
        
        // Definir campos válidos para eventos
        this.validFields = [
            'title', 'description', 'type', 'date', 'time', 'location',
            'duration', 'capacity', 'registrationUrl', 'slug', 
            'organizer', 'status', 'image', 'requirements'
        ];
    }

    // Función para limpiar datos antes de operaciones
    cleanEventData(data) {
        const cleanData = {};
        
        // Solo incluir campos válidos
        this.validFields.forEach(field => {
            if (data[field] !== undefined) {
                cleanData[field] = data[field];
            }
        });

        // Mapear campos del esquema anterior si existen
        if (data.startDate && !cleanData.date) {
            cleanData.date = data.startDate;
        }
        if (data.imageUrl && !cleanData.image) {
            cleanData.image = data.imageUrl;
        }
        if (data.maxParticipants && !cleanData.capacity) {
            cleanData.capacity = data.maxParticipants;
        }

        return cleanData;
    }

    // Override del método create para limpiar datos
    async create(data) {
        const cleanData = this.cleanEventData(data);
        console.log('EventosRepository.create - Datos originales:', data);
        console.log('EventosRepository.create - Datos limpiados:', cleanData);
        return await super.create(cleanData);
    }

    // Override del método update para limpiar datos
    async update(id, data) {
        const cleanData = this.cleanEventData(data);
        console.log('EventosRepository.update - Datos originales:', data);
        console.log('EventosRepository.update - Datos limpiados:', cleanData);
        return await super.update(id, cleanData);
    }

    // Obtener eventos por status
    async findByStatus(status, page = 1, limit = 10) {
        return await this.findAll(page, limit, { status });
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

    // Obtener eventos por tipo
    async findByType(type, page = 1, limit = 10) {
        return await this.findAll(page, limit, { type });
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
}

module.exports = EventosRepository;