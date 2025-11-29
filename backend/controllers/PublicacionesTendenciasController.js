const BaseController = require('./BaseController');
const { PublicacionesTendenciasRepository } = require('../repositories');
const { deleteFromCloudinary, extractPublicIdFromUrl } = require('../utils/cloudinary');

class PublicacionesTendenciasController extends BaseController {
    constructor() {
        super(new PublicacionesTendenciasRepository());
        this.repository = new PublicacionesTendenciasRepository();
    }

    // Alias para compatibilidad con las rutas base
    async findAll(req, res) {
        return await this.getAll(req, res);
    }

    async findById(req, res) {
        return await this.getById(req, res);
    }

    // Validaciones específicas para publicaciones de tendencias
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

        // Validar URL si se proporciona
        if (data.url && data.url.trim().length > 0) {
            try {
                new URL(data.url);
            } catch (e) {
                errors.push('La URL proporcionada no es válida');
            }
        }

        return errors;
    }

    // Crear nueva publicación de tendencias
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
                console.log('📷 Imagen subida a Cloudinary:', req.file.path);
                // Con Cloudinary, req.file.path contiene la URL completa
                publicacionData.imagen = req.file.path;
            }

            // Crear la publicación
            console.log('💾 Creando en base de datos...');
            const nuevaPublicacion = await this.repository.create(publicacionData);
            console.log('✅ Publicación creada exitosamente');

            res.status(201).json({
                success: true,
                message: 'Publicación de tendencias creada exitosamente',
                data: nuevaPublicacion
            });
        } catch (error) {
            console.error('❌ Error al crear publicación de tendencias:', error);
            console.error('❌ Stack trace:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Actualizar publicación de tendencias
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
                    message: 'Publicación de tendencias no encontrada'
                });
            }
            console.log('✅ Publicación encontrada:', existingPublicacion.titulo);
            console.log('🖼️ Imagen actual:', existingPublicacion.imagen);

            // Validar datos
            const errors = this.validatePublicacionData(updateData, true);
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
                console.log('📷 Procesando nueva imagen en Cloudinary:', req.file.path);
                
                // Eliminar imagen anterior si existe en Cloudinary
                if (existingPublicacion.imagen && existingPublicacion.imagen.includes('cloudinary.com')) {
                    try {
                        console.log('🗑️ Intentando eliminar imagen anterior:', existingPublicacion.imagen);
                        const publicId = extractPublicIdFromUrl(existingPublicacion.imagen);
                        if (publicId) {
                            const deleteResult = await deleteFromCloudinary(publicId);
                            console.log('✅ Imagen anterior eliminada de Cloudinary:', deleteResult);
                        } else {
                            console.log('⚠️ No se pudo extraer public_id de:', existingPublicacion.imagen);
                        }
                    } catch (err) {
                        console.error('⚠️ Error al eliminar imagen anterior de Cloudinary:', err);
                        // No fallar por esto, continuar con la actualización
                    }
                } else {
                    console.log('ℹ️ No hay imagen anterior de Cloudinary para eliminar');
                }
                
                // Con Cloudinary, req.file.path contiene la URL completa
                updateData.imagen = req.file.path;
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
                message: 'Publicación de tendencias actualizada exitosamente',
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
                    message: 'Publicación de tendencias no encontrada'
                });
            }

            // Eliminar imagen de Cloudinary si existe
            if (existingPublicacion.imagen) {
                try {
                    const publicId = extractPublicIdFromUrl(existingPublicacion.imagen);
                    if (publicId) {
                        await deleteFromCloudinary(publicId);
                        console.log('🗑️ Imagen eliminada de Cloudinary');
                    }
                } catch (err) {
                    console.log('⚠️ No se pudo eliminar la imagen de Cloudinary:', err.message);
                }
            }

            // Eliminar de la base de datos
            await this.repository.delete(id);

            res.json({
                success: true,
                message: 'Publicación de tendencias eliminada exitosamente'
            });
        } catch (error) {
            console.error('Error al eliminar publicación de tendencias:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }   // Obtener todas las publicaciones con filtros y paginación
    async getAllWithFilters(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                autor
            } = req.query;

            const filters = {};

            if (search) filters.search = search;
            if (autor) filters.autor = autor;

            const result = await this.repository.findAllWithFilters(
                parseInt(page),
                parseInt(limit),
                filters
            );

            res.json({
                success: true,
                message: 'Publicaciones de tendencias obtenidas exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error al obtener publicaciones de tendencias:', error);
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
    async searchPublications(req, res) {
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

            res.json({
                success: true,
                message: `Publicaciones del autor ${autor} obtenidas exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error al obtener publicaciones por autor:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = PublicacionesTendenciasController;