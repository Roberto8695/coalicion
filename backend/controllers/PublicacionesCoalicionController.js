const BaseController = require('./BaseController');
const PublicacionesCoalicionRepository = require('../repositories/PublicacionesCoalicionRepository');
const {
    deleteFromCloudinary,
    extractPublicIdFromUrl,
    buildPublicFileUrl,
    isLocalStorage
} = require('../utils/cloudinary');

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
            console.log('🔄 Starting create process...');
            console.log('📝 Request body:', req.body);
            console.log('📷 Request file:', req.file ? req.file.filename : 'No file');
            
            const publicacionData = { ...req.body };

            // Validar datos
            const errors = this.validatePublicacionData(publicacionData);
            if (errors.length > 0) {
                console.log('❌ Errores de validación:', errors);
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors
                });
            }
            console.log('✅ Datos validados correctamente');

            // Manejar imagen si se proporciona (Cloudinary)
            if (req.file) {
                const imageUrl = buildPublicFileUrl(req.file);
                console.log(`📷 Imagen subida a ${isLocalStorage ? 'storage local' : 'Cloudinary'}:`, imageUrl);
                publicacionData.imagen = imageUrl;
            }

            // Crear la publicación
            console.log('💾 Creando en base de datos...');
            const nuevaPublicacion = await this.repository.create(publicacionData);
            console.log('✅ Publicación creada exitosamente');

            res.status(201).json({
                success: true,
                message: 'Publicación de coalición creada exitosamente',
                data: nuevaPublicacion
            });
        } catch (error) {
            console.error('❌ Error al crear publicación de coalición:', error);
            console.error('❌ Stack trace:', error.stack);
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
            console.log('🔄 Starting update process for ID:', req.params.id);
            console.log('📝 Request body:', req.body);
            console.log('📷 Request file:', req.file ? req.file.filename : 'No file');
            
            const { id } = req.params;
            const updateData = { ...req.body };

            // Verificar que existe la publicación
            const existingPublicacion = await this.repository.findById(id);
            if (!existingPublicacion) {
                console.log('❌ Publicación no encontrada para ID:', id);
                return res.status(404).json({
                    success: false,
                    message: 'Publicación de coalición no encontrada'
                });
            }
            console.log('✅ Publicación encontrada:', existingPublicacion.titulo);
            console.log('🖼️ Imagen actual:', existingPublicacion.imagen);

            // Validar datos
            const errors = this.validatePublicacionData(updateData);
            if (errors.length > 0) {
                console.log('❌ Errores de validación:', errors);
                return res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors
                });
            }
            console.log('✅ Datos validados correctamente');

            // Manejar nueva imagen (Cloudinary)
            if (req.file) {
                const imageUrl = buildPublicFileUrl(req.file);
                console.log(`📷 Procesando nueva imagen en ${isLocalStorage ? 'storage local' : 'Cloudinary'}:`, imageUrl);
                
                // Eliminar imagen anterior si existe
                if (existingPublicacion.imagen) {
                    try {
                        console.log('🗑️ Intentando eliminar imagen anterior:', existingPublicacion.imagen);
                        const identifier = extractPublicIdFromUrl(existingPublicacion.imagen) || existingPublicacion.imagen;
                        const deleteResult = await deleteFromCloudinary(identifier);
                        console.log('✅ Imagen anterior eliminada:', deleteResult);
                    } catch (err) {
                        console.error('⚠️ Error al eliminar imagen anterior:', err);
                        // No fallar por esto, continuar con la actualización
                    }
                } else {
                    console.log('ℹ️ No hay imagen anterior para eliminar');
                }
                
                updateData.imagen = imageUrl;
                console.log('✅ Nueva imagen configurada:', updateData.imagen);
            } else {
                console.log('ℹ️ No se proporcionó nueva imagen');
            }

            // Actualizar la publicación
            console.log('💾 Actualizando en base de datos con datos:', updateData);
            const publicacionActualizada = await this.repository.update(id, updateData);
            console.log('✅ Publicación actualizada exitosamente');

            res.json({
                success: true,
                message: 'Publicación de coalición actualizada exitosamente',
                data: publicacionActualizada
            });
        } catch (error) {
            console.error('❌ Error completo en update:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            
            // Enviar respuesta de error más específica
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor',
                details: process.env.NODE_ENV === 'development' ? {
                    stack: error.stack,
                    name: error.name
                } : undefined
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

            // Eliminar imagen previa si existe
            if (existingPublicacion.imagen) {
                try {
                    const identifier = extractPublicIdFromUrl(existingPublicacion.imagen) || existingPublicacion.imagen;
                    await deleteFromCloudinary(identifier);
                    console.log('🗑️ Imagen eliminada');
                } catch (err) {
                    console.log('⚠️ No se pudo eliminar la imagen:', err.message);
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