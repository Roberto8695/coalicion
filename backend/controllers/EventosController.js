const BaseController = require('./BaseController');
const { EventosRepository } = require('../repositories');

class EventosController extends BaseController {
    constructor() {
        super(new EventosRepository());
    }

    // Función para limpiar datos de eventos antes de operaciones
    cleanEventData(data) {
        const validFields = [
            'title', 'description', 'type', 'date', 'time', 'location',
            'duration', 'capacity', 'registrationUrl', 'slug', 
            'organizer', 'status', 'image', 'requirements'
        ];

        const cleanData = {};
        
        // Solo incluir campos válidos
        validFields.forEach(field => {
            if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
                cleanData[field] = data[field];
            }
        });

        // Mapear campos del esquema anterior si existen
        if (data.startDate && !cleanData.date) {
            cleanData.date = data.startDate;
        }
        if (data.endDate && !cleanData.duration && data.startDate) {
            // Calcular duración si tenemos ambas fechas
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            const diffMs = end - start;
            const diffHrs = Math.round(diffMs / (1000 * 60 * 60));
            cleanData.duration = `${diffHrs} horas`;
        }
        if (data.imageUrl && !cleanData.image) {
            cleanData.image = data.imageUrl;
        }
        if (data.maxParticipants && !cleanData.capacity) {
            cleanData.capacity = data.maxParticipants;
        }

        return cleanData;
    }

    // Override create con limpieza de datos
    async create(req, res) {
        try {
            const originalData = req.body;
            const cleanData = this.cleanEventData(originalData);
            
            console.log('EventosController.create - Datos originales:', originalData);
            console.log('EventosController.create - Datos limpiados:', cleanData);
            
            // Temporalmente modificar req.body
            req.body = cleanData;
            
            // Llamar al método padre
            return await super.create(req, res);
        } catch (error) {
            console.error('Error en EventosController.create:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear evento',
                error: error.message
            });
        }
    }

    // Override update con limpieza de datos
    async update(req, res) {
        try {
            const originalData = req.body;
            const cleanData = this.cleanEventData(originalData);
            
            console.log('EventosController.update - Datos originales:', originalData);
            console.log('EventosController.update - Datos limpiados:', cleanData);
            
            // Temporalmente modificar req.body
            req.body = cleanData;
            
            // Llamar al método padre
            return await super.update(req, res);
        } catch (error) {
            console.error('Error en EventosController.update:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar evento',
                error: error.message
            });
        }
    }

    // Obtener eventos por status
    async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['upcoming', 'ongoing', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status inválido. Debe ser: upcoming, ongoing, completed, cancelled'
                });
            }

            const result = await this.repository.findByStatus(
                status,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Eventos con status ${status} obtenidos exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener eventos por status',
                error: error.message
            });
        }
    }

    // Obtener eventos próximos
    async getUpcoming(req, res) {
        try {
            const { limit = 10 } = req.query;
            const eventos = await this.repository.findUpcoming(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Eventos próximos obtenidos exitosamente',
                data: eventos
            });
        } catch (error) {
            console.error('Error en getUpcoming:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener eventos próximos',
                error: error.message
            });
        }
    }

    // Obtener eventos por tipo
    async getByType(req, res) {
        try {
            const { type } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['taller', 'capacitacion', 'foro', 'debate'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: taller, capacitacion, foro, debate'
                });
            }

            const result = await this.repository.findByType(
                type,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Eventos tipo ${type} obtenidos exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByType:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener eventos por tipo',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear evento
    async create(req, res) {
        try {
            const data = req.body;
            
            if (!data.title) {
                return res.status(400).json({
                    success: false,
                    message: 'El título es requerido'
                });
            }

            if (!data.type) {
                return res.status(400).json({
                    success: false,
                    message: 'El tipo es requerido'
                });
            }

            if (!['taller', 'capacitacion', 'foro', 'debate'].includes(data.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: taller, capacitacion, foro, debate'
                });
            }

            await super.create(req, res);
        } catch (error) {
            console.error('Error en create evento:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear evento',
                error: error.message
            });
        }
    }
}

module.exports = EventosController;