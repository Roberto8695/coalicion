const BaseController = require('./BaseController');
const { EventosRepository } = require('../repositories');

class EventosController extends BaseController {
    constructor() {
        super(new EventosRepository());
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