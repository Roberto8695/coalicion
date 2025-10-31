const BaseController = require('./BaseController');
const { PublicacionesRepository } = require('../repositories');

class PublicacionesController extends BaseController {
    constructor() {
        super(new PublicacionesRepository());
    }

    // Obtener publicaciones con categoría
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
                message: 'Publicaciones obtenidas exitosamente',
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

    // Obtener publicaciones destacadas
    async getFeatured(req, res) {
        try {
            const { limit = 5 } = req.query;
            const publicaciones = await this.repository.findFeatured(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Publicaciones destacadas obtenidas exitosamente',
                data: publicaciones
            });
        } catch (error) {
            console.error('Error en getFeatured:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener publicaciones destacadas',
                error: error.message
            });
        }
    }

    // Búsqueda avanzada
    async searchAdvanced(req, res) {
        try {
            const { q: searchTerm, page = 1, limit = 10, ...filters } = req.query;
            
            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Término de búsqueda requerido'
                });
            }

            const cleanFilters = Object.keys(filters).reduce((acc, key) => {
                if (filters[key] && filters[key] !== '') {
                    acc[key] = filters[key];
                }
                return acc;
            }, {});

            const result = await this.repository.searchAdvanced(
                searchTerm,
                cleanFilters,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Búsqueda avanzada completada',
                ...result
            });
        } catch (error) {
            console.error('Error en searchAdvanced:', error);
            res.status(500).json({
                success: false,
                message: 'Error en la búsqueda avanzada',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear publicación
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

            if (!['informe', 'estudio', 'monitoreo', 'investigacion'].includes(data.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: informe, estudio, monitoreo, investigacion'
                });
            }

            // Llamar al método padre
            await super.create(req, res);
        } catch (error) {
            console.error('Error en create publicación:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear la publicación',
                error: error.message
            });
        }
    }
}

module.exports = PublicacionesController;