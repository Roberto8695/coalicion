class BaseController {
    constructor(repository) {
        this.repository = repository;
    }

    // Obtener todos los registros
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            
            // Limpiar filtros vacíos
            const cleanFilters = Object.keys(filters).reduce((acc, key) => {
                if (filters[key] && filters[key] !== '') {
                    acc[key] = filters[key];
                }
                return acc;
            }, {});

            const result = await this.repository.findAll(
                parseInt(page), 
                parseInt(limit), 
                cleanFilters
            );

            res.status(200).json({
                success: true,
                message: 'Registros obtenidos exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getAll:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener registro por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const record = await this.repository.findById(parseInt(id));
            
            if (!record) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Registro encontrado',
                data: record
            });
        } catch (error) {
            console.error('Error en getById:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener registro por slug
    async getBySlug(req, res) {
        try {
            const { slug } = req.params;
            
            if (!slug) {
                return res.status(400).json({
                    success: false,
                    message: 'Slug es requerido'
                });
            }

            const record = await this.repository.findBySlug(slug);
            
            if (!record) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Registro encontrado',
                data: record
            });
        } catch (error) {
            console.error('Error en getBySlug:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Crear nuevo registro
    async create(req, res) {
        try {
            const data = req.body;
            
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos requeridos para crear el registro'
                });
            }

            // Generar slug si no existe
            if (!data.slug && data.title) {
                data.slug = this.generateSlug(data.title);
            }

            const newRecord = await this.repository.create(data);
            
            res.status(201).json({
                success: true,
                message: 'Registro creado exitosamente',
                data: newRecord
            });
        } catch (error) {
            console.error('Error en create:', error);
            
            // Manejar errores de duplicación
            if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un registro con estos datos únicos',
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al crear el registro',
                error: error.message
            });
        }
    }

    // Actualizar registro
    async update(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;
            
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos requeridos para actualizar el registro'
                });
            }

            // Actualizar slug si se cambió el título
            if (data.title && !data.slug) {
                data.slug = this.generateSlug(data.title);
            }

            const updatedRecord = await this.repository.update(parseInt(id), data);
            
            if (!updatedRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado para actualizar'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Registro actualizado exitosamente',
                data: updatedRecord
            });
        } catch (error) {
            console.error('Error en update:', error);
            
            if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un registro con estos datos únicos',
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al actualizar el registro',
                error: error.message
            });
        }
    }

    // Eliminar registro
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID inválido'
                });
            }

            const deletedRecord = await this.repository.delete(parseInt(id));
            
            if (!deletedRecord) {
                return res.status(404).json({
                    success: false,
                    message: 'Registro no encontrado para eliminar'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Registro eliminado exitosamente',
                data: deletedRecord
            });
        } catch (error) {
            console.error('Error en delete:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar el registro',
                error: error.message
            });
        }
    }

    // Búsqueda
    async search(req, res) {
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
                ['title', 'description'], // campos por defecto
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: 'Búsqueda completada',
                ...result
            });
        } catch (error) {
            console.error('Error en search:', error);
            res.status(500).json({
                success: false,
                message: 'Error en la búsqueda',
                error: error.message
            });
        }
    }

    // Generar slug a partir del título
    generateSlug(title) {
        return title
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-')  // Reemplazar espacios y caracteres especiales con guiones
            .replace(/^-+|-+$/g, '');   // Eliminar guiones al inicio y final
    }
}

module.exports = BaseController;