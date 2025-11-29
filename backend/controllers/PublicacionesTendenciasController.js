const BaseController = require('./BaseController');
const { PublicacionesTendenciasRepository } = require('../repositories');

class PublicacionesTendenciasController extends BaseController {
    constructor() {
        super(new PublicacionesTendenciasRepository());
    }

    // Obtener todas las publicaciones con filtros y paginación
    async getAllWithFilters(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            
            const cleanFilters = Object.keys(filters).reduce((acc, key) => {
                if (filters[key] && filters[key] !== '') {
                    acc[key] = filters[key];
                }
                return acc;
            }, {});

            const result = await this.repository.findAllWithFilters(
                parseInt(page), 
                parseInt(limit), 
                cleanFilters
            );

            res.status(200).json({
                success: true,
                message: 'Publicaciones de tendencias obtenidas exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getAllWithFilters:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener publicaciones recientes
    async getRecent(req, res) {
        try {
            const { limit = 5 } = req.query;
            const publicaciones = await this.repository.findRecent(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Publicaciones recientes obtenidas exitosamente',
                data: publicaciones
            });
        } catch (error) {
            console.error('Error en getRecent:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener publicaciones recientes',
                error: error.message
            });
        }
    }

    // Búsqueda de publicaciones
    async searchPublications(req, res) {
        try {
            const { q: searchTerm, page = 1, limit = 10 } = req.query;
            
            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'Término de búsqueda requerido'
                });
            }

            const result = await this.repository.search(
                searchTerm,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Búsqueda completada',
                ...result
            });
        } catch (error) {
            console.error('Error en searchPublications:', error);
            res.status(500).json({
                success: false,
                message: 'Error en la búsqueda',
                error: error.message
            });
        }
    }

    // Obtener publicaciones por autor
    async getByAuthor(req, res) {
        try {
            const { autor } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!autor) {
                return res.status(400).json({
                    success: false,
                    message: 'Autor requerido'
                });
            }

            const result = await this.repository.findByAuthor(
                autor,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Publicaciones del autor ${autor} obtenidas exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByAuthor:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener publicaciones por autor',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear publicación de tendencia
    async create(req, res) {
        try {
            const data = req.body;
            
            // Validaciones específicas
            if (!data.titulo) {
                return res.status(400).json({
                    success: false,
                    message: 'El título es requerido'
                });
            }

            if (!data.descripcion) {
                return res.status(400).json({
                    success: false,
                    message: 'La descripción es requerida'
                });
            }

            // Validar URL si se proporciona
            if (data.url) {
                try {
                    new URL(data.url);
                } catch {
                    return res.status(400).json({
                        success: false,
                        message: 'URL inválida'
                    });
                }
            }

            // Llamar al método padre
            await super.create(req, res);
        } catch (error) {
            console.error('Error en create publicación de tendencia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear la publicación de tendencia',
                error: error.message
            });
        }
    }

    // Actualizar publicación de tendencia
    async update(req, res) {
        try {
            // Usar directamente el método del BaseController sin validaciones adicionales
            // Las validaciones básicas las maneja BaseController
            await super.update(req, res);
        } catch (error) {
            console.error('Error en update publicación de tendencia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar la publicación de tendencia',
                error: error.message
            });
        }
    }
}

module.exports = PublicacionesTendenciasController;