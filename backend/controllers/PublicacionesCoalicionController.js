const BaseController = require('./BaseController');
const PublicacionesCoalicionRepository = require('../repositories/PublicacionesCoalicionRepository');
const path = require('path');
const fs = require('fs').promises;

class PublicacionesCoalicionController extends BaseController {
    constructor() {
        super(new PublicacionesCoalicionRepository());
        this.repository = new PublicacionesCoalicionRepository();
    }

    // Alias para compatibilidad con las rutas base
    async findAll(req, res) {
        return await this.getAll(req, res);
    }

    async findById(req, res) {
        return await this.getById(req, res);
    }

    // Validaciones específicas para publicaciones de coalición
    validatePublicacionData(data, isUpdate = false) {
        const errors = [];

        // En actualizaciones, solo validar si el campo está presente
        if (data.titulo !== undefined) {
            if (!data.titulo || data.titulo.trim().length === 0) {
                errors.push('El título no puede estar vacío');
            } else if (data.titulo.length > 255) {
                errors.push('El título no debe exceder 255 caracteres');
            }
        } else if (!isUpdate) {
            // Solo requerir en creación
            errors.push('El título es requerido');
        }

        if (data.descripcion !== undefined) {
            if (!data.descripcion || data.descripcion.trim().length === 0) {
                errors.push('La descripción no puede estar vacía');
            }
        } else if (!isUpdate) {
            // Solo requerir en creación
            errors.push('La descripción es requerida');
        }

        if (data.fecha_publi !== undefined) {
            if (!data.fecha_publi) {
                errors.push('La fecha de publicación no puede estar vacía');
            } else {
                const fecha = new Date(data.fecha_publi);
                if (isNaN(fecha.getTime())) {
                    errors.push('La fecha de publicación no es válida');
                }
            }
        } else if (!isUpdate) {
            // Solo requerir en creación
            errors.push('La fecha de publicación es requerida');
        }

        if (data.url && data.url.trim().length > 0) {
            try {
                new URL(data.url);
            } catch (e) {
                errors.push('La URL proporcionada no es válida');
            }
        }

        return errors;
    }

    // Crear nueva publicación de coalición
    async create(req, res) {
        try {
            const publicacionData = { ...req.body };

            // Validar datos
            const errors = this.validatePublicacionData(publicacionData);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors
                });
            }

            // Manejar imagen si se proporciona
            if (req.file) {
                // Guardar la ruta relativa desde /uploads
                publicacionData.imagen = `/uploads/infografia/jpg/${req.file.filename}`;
            }

            // Crear la publicación
            const nuevaPublicacion = await this.repository.create(publicacionData);

            res.status(201).json({
                success: true,
                message: 'Publicación de coalición creada exitosamente',
                data: nuevaPublicacion
            });
        } catch (error) {
            console.error('Error al crear publicación de coalición:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Actualizar publicación de coalición
    async update(req, res) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            // Verificar que existe la publicación
            const existingPublicacion = await this.repository.findById(id);
            if (!existingPublicacion) {
                return res.status(404).json({
                    success: false,
                    message: 'Publicación de coalición no encontrada'
                });
            }

            // Validar datos (pasando true para indicar que es una actualización)
            const errors = this.validatePublicacionData(updateData, true);
            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors
                });
            }

            // Manejar nueva imagen
            if (req.file) {
                // Eliminar imagen anterior si existe
                if (existingPublicacion.imagen) {
                    try {
                        // Extraer solo el nombre del archivo de la ruta completa
                        const filename = existingPublicacion.imagen.split('/').pop();
                        const oldImagePath = path.join(__dirname, '../uploads/infografia/jpg', filename);
                        await fs.unlink(oldImagePath);
                    } catch (err) {
                        console.log('No se pudo eliminar la imagen anterior:', err.message);
                    }
                }
                // Guardar la ruta relativa desde /uploads
                updateData.imagen = `/uploads/infografia/jpg/${req.file.filename}`;
            }

            // Actualizar la publicación
            const publicacionActualizada = await this.repository.update(id, updateData);

            res.json({
                success: true,
                message: 'Publicación de coalición actualizada exitosamente',
                data: publicacionActualizada
            });
        } catch (error) {
            console.error('Error al actualizar publicación de coalición:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Eliminar publicación con imagen
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar que existe la publicación
            const existingPublicacion = await this.repository.findById(id);
            if (!existingPublicacion) {
                return res.status(404).json({
                    success: false,
                    message: 'Publicación de coalición no encontrada'
                });
            }

            // Eliminar imagen si existe
            if (existingPublicacion.imagen) {
                try {
                    const imagePath = path.join(__dirname, '../uploads/infografia/jpg', existingPublicacion.imagen);
                    await fs.unlink(imagePath);
                } catch (err) {
                    console.log('No se pudo eliminar la imagen:', err.message);
                }
            }

            // Eliminar de la base de datos
            await this.repository.delete(id);

            res.json({
                success: true,
                message: 'Publicación de coalición eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar publicación de coalición:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener todas las publicaciones con filtros y paginación
    async getAllWithFilters(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                fecha_desde,
                fecha_hasta
            } = req.query;

            const filters = {};

            if (search) filters.search = search;
            if (fecha_desde) filters.fecha_desde = fecha_desde;
            if (fecha_hasta) filters.fecha_hasta = fecha_hasta;

            const result = await this.repository.findAllWithFilters(
                parseInt(page),
                parseInt(limit),
                filters
            );

            res.json({
                success: true,
                message: 'Publicaciones de coalición obtenidas exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error al obtener publicaciones de coalición:', error);
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

            res.json({
                success: true,
                message: 'Publicaciones recientes obtenidas exitosamente',
                data: publicaciones
            });
        } catch (error) {
            console.error('Error al obtener publicaciones recientes:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Búsqueda de publicaciones
    async search(req, res) {
        try {
            const { q: searchTerm, page = 1, limit = 10 } = req.query;

            if (!searchTerm) {
                return res.status(400).json({
                    success: false,
                    message: 'El término de búsqueda es requerido'
                });
            }

            const result = await this.repository.search(
                searchTerm,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                message: 'Búsqueda completada exitosamente',
                searchTerm,
                ...result
            });
        } catch (error) {
            console.error('Error en búsqueda de publicaciones:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener publicaciones por rango de fechas
    async getByDateRange(req, res) {
        try {
            const { fecha_desde, fecha_hasta, page = 1, limit = 10 } = req.query;

            if (!fecha_desde || !fecha_hasta) {
                return res.status(400).json({
                    success: false,
                    message: 'Las fechas de inicio y fin son requeridas'
                });
            }

            const result = await this.repository.findByDateRange(
                fecha_desde,
                fecha_hasta,
                parseInt(page),
                parseInt(limit)
            );

            res.json({
                success: true,
                message: 'Publicaciones por rango de fechas obtenidas exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error al obtener publicaciones por rango de fechas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener estadísticas
    async getStats(req, res) {
        try {
            const stats = await this.repository.getStats();

            res.json({
                success: true,
                message: 'Estadísticas obtenidas exitosamente',
                data: stats
            });
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = PublicacionesCoalicionController;