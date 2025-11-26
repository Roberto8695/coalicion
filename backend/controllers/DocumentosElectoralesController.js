const BaseController = require('./BaseController');
const { DocumentosElectoralesRepository } = require('../repositories');

class DocumentosElectoralesController extends BaseController {
    constructor() {
        super(new DocumentosElectoralesRepository());
    }

    // Obtener documentos por categoría
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const validCategories = ['Manual', 'Procedimiento', 'Normativa', 'Capacitación', 'Informe'];
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: `Categoría inválida. Debe ser: ${validCategories.join(', ')}`
                });
            }

            const result = await this.repository.findByCategory(
                category,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Documentos categoría ${category} obtenidos exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener documentos por categoría',
                error: error.message
            });
        }
    }

    // Obtener documentos por tipo de archivo
    async getByType(req, res) {
        try {
            const { type } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const validTypes = ['PDF', 'DOC', 'DOCX', 'XLSX', 'PPTX'];
            if (!validTypes.includes(type.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: `Tipo inválido. Debe ser: ${validTypes.join(', ')}`
                });
            }

            const result = await this.repository.findByType(
                type.toUpperCase(),
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Documentos tipo ${type} obtenidos exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByType:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener documentos por tipo',
                error: error.message
            });
        }
    }

    // Obtener documentos por estado
    async getByStatus(req, res) {
        try {
            const { status } = req.params;
            const { page = 1, limit = 10 } = req.query;

            const validStatuses = ['borrador', 'revision', 'publicado', 'archivado'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Estado inválido. Debe ser: ${validStatuses.join(', ')}`
                });
            }

            const result = await this.repository.findByStatus(
                status,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Documentos con estado ${status} obtenidos exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener documentos por estado',
                error: error.message
            });
        }
    }

    // Obtener documentos publicados
    async getPublished(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await this.repository.findPublished(parseInt(page), parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Documentos publicados obtenidos exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getPublished:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener documentos publicados',
                error: error.message
            });
        }
    }

    // Obtener documentos más recientes
    async getRecent(req, res) {
        try {
            const { limit = 10 } = req.query;
            const documentos = await this.repository.findRecent(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Documentos recientes obtenidos exitosamente',
                data: documentos
            });
        } catch (error) {
            console.error('Error en getRecent:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener documentos recientes',
                error: error.message
            });
        }
    }

    // Búsqueda de documentos
    async search(req, res) {
        try {
            const { q: searchTerm } = req.query;
            const { page = 1, limit = 10 } = req.query;

            if (!searchTerm || searchTerm.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'El término de búsqueda debe tener al menos 2 caracteres'
                });
            }

            const result = await this.repository.searchDocuments(
                searchTerm.trim(),
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Búsqueda completada para: "${searchTerm}"`,
                searchTerm,
                ...result
            });
        } catch (error) {
            console.error('Error en search:', error);
            res.status(500).json({
                success: false,
                message: 'Error al buscar documentos',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear documento
    async create(req, res) {
        try {
            const data = req.body;
            
            // Validaciones requeridas
            if (!data.title || data.title.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'El título es requerido y debe tener al menos 3 caracteres'
                });
            }

            if (!data.category) {
                return res.status(400).json({
                    success: false,
                    message: 'La categoría es requerida'
                });
            }

            const validCategories = ['Manual', 'Procedimiento', 'Normativa', 'Capacitación', 'Informe'];
            if (!validCategories.includes(data.category)) {
                return res.status(400).json({
                    success: false,
                    message: `Categoría inválida. Debe ser: ${validCategories.join(', ')}`
                });
            }

            if (!data.type) {
                return res.status(400).json({
                    success: false,
                    message: 'El tipo de archivo es requerido'
                });
            }

            const validTypes = ['PDF', 'DOC', 'DOCX', 'XLSX', 'PPTX'];
            if (!validTypes.includes(data.type.toUpperCase())) {
                return res.status(400).json({
                    success: false,
                    message: `Tipo de archivo inválido. Debe ser: ${validTypes.join(', ')}`
                });
            }

            if (!data.fileUrl || !data.fileUrl.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'La URL del archivo es requerida'
                });
            }

            if (!data.publishDate) {
                return res.status(400).json({
                    success: false,
                    message: 'La fecha de publicación es requerida'
                });
            }

            // Valores por defecto
            const documentData = {
                ...data,
                type: data.type.toUpperCase(),
                status: data.status || 'borrador',
                version: data.version || '1.0'
            };

            // Llamar al método create del BaseController
            req.body = documentData;
            await super.create(req, res);
        } catch (error) {
            console.error('Error en create documento:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear documento',
                error: error.message
            });
        }
    }

    // Validaciones específicas para actualizar documento
    async update(req, res) {
        try {
            const data = req.body;
            
            // Validaciones similares al create pero opcionales
            if (data.title && data.title.trim().length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'El título debe tener al menos 3 caracteres'
                });
            }

            if (data.category) {
                const validCategories = ['Manual', 'Procedimiento', 'Normativa', 'Capacitación', 'Informe'];
                if (!validCategories.includes(data.category)) {
                    return res.status(400).json({
                        success: false,
                        message: `Categoría inválida. Debe ser: ${validCategories.join(', ')}`
                    });
                }
            }

            if (data.type) {
                const validTypes = ['PDF', 'DOC', 'DOCX', 'XLSX', 'PPTX'];
                if (!validTypes.includes(data.type.toUpperCase())) {
                    return res.status(400).json({
                        success: false,
                        message: `Tipo de archivo inválido. Debe ser: ${validTypes.join(', ')}`
                    });
                }
                data.type = data.type.toUpperCase();
            }

            // Llamar al método update del BaseController
            await super.update(req, res);
        } catch (error) {
            console.error('Error en update documento:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar documento',
                error: error.message
            });
        }
    }
}

module.exports = DocumentosElectoralesController;