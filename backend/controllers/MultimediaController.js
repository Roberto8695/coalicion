const BaseController = require('./BaseController');
const { MultimediaRepository } = require('../repositories');

class MultimediaController extends BaseController {
    constructor() {
        super(new MultimediaRepository());
    }

    // Obtener multimedia con categoría
    async getAllWithCategory(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            
            const cleanFilters = Object.keys(filters).reduce((acc, key) => {
                if (filters[key] && filters[key] !== '') {
                    acc[key] = filters[key];
                }
                return acc;
            }, {});

            const result = await this.repository.findAllWithCategory(
                parseInt(page), 
                parseInt(limit), 
                cleanFilters
            );

            res.status(200).json({
                success: true,
                message: 'Multimedia obtenida exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getAllWithCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener multimedia por tipo
    async getByType(req, res) {
        try {
            const { type } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['infografia', 'video', 'arte', 'presentacion'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: infografia, video, arte, presentacion'
                });
            }

            const result = await this.repository.findByType(
                type,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Multimedia tipo ${type} obtenida exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByType:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener multimedia por tipo',
                error: error.message
            });
        }
    }

    // Obtener multimedia destacada
    async getFeatured(req, res) {
        try {
            const { limit = 5 } = req.query;
            const multimedia = await this.repository.findFeatured(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Multimedia destacada obtenida exitosamente',
                data: multimedia
            });
        } catch (error) {
            console.error('Error en getFeatured:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener multimedia destacada',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear multimedia
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

            if (!['infografia', 'video', 'arte', 'presentacion'].includes(data.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: infografia, video, arte, presentacion'
                });
            }

            await super.create(req, res);
        } catch (error) {
            console.error('Error en create multimedia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear multimedia',
                error: error.message
            });
        }
    }
}

module.exports = MultimediaController;