const BaseController = require('./BaseController');
const { NoticiasRepository } = require('../repositories');

class NoticiasController extends BaseController {
    constructor() {
        super(new NoticiasRepository());
    }

    // Obtener noticias por status
    async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['upcoming', 'ongoing', 'completed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Status inválido. Debe ser: upcoming, ongoing, completed'
                });
            }

            const result = await this.repository.findByStatus(
                status,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Noticias con status ${status} obtenidas exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener noticias por status',
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

    // Obtener eventos por rango de fechas
    async getByDateRange(req, res) {
        try {
            const { startDate, endDate, page = 1, limit = 10 } = req.query;

            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'Fechas de inicio y fin son requeridas'
                });
            }

            const result = await this.repository.findByDateRange(
                startDate,
                endDate,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Eventos por rango de fechas obtenidos exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getByDateRange:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener eventos por rango de fechas',
                error: error.message
            });
        }
    }

    // Obtener noticias destacadas
    async getFeatured(req, res) {
        try {
            const { limit = 5 } = req.query;
            const noticias = await this.repository.findFeatured(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Noticias destacadas obtenidas exitosamente',
                data: noticias
            });
        } catch (error) {
            console.error('Error en getFeatured:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener noticias destacadas',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear noticia
    async create(req, res) {
        try {
            const data = req.body;
            
            // Validaciones específicas
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

            if (!['actividad', 'taller', 'comunicado', 'evento'].includes(data.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: actividad, taller, comunicado, evento'
                });
            }

            // Llamar al método padre
            await super.create(req, res);
        } catch (error) {
            console.error('Error en create noticia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear la noticia',
                error: error.message
            });
        }
    }
}

module.exports = NoticiasController;