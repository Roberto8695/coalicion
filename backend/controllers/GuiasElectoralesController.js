const BaseController = require('./BaseController');
const { GuiasElectoralesRepository } = require('../repositories');

class GuiasElectoralesController extends BaseController {
    constructor() {
        super(new GuiasElectoralesRepository());
    }

    // Obtener guías por categoría
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['manual', 'procedimiento', 'normativa', 'capacitacion'].includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: 'Categoría inválida. Debe ser: manual, procedimiento, normativa, capacitacion'
                });
            }

            const result = await this.repository.findByCategory(
                category,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Guías categoría ${category} obtenidas exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener guías por categoría',
                error: error.message
            });
        }
    }

    // Obtener guías por tipo de archivo
    async getByType(req, res) {
        try {
            const { type } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['PDF', 'DOC', 'XLSX'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: PDF, DOC, XLSX'
                });
            }

            const result = await this.repository.findByType(
                type,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Guías tipo ${type} obtenidas exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByType:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener guías por tipo',
                error: error.message
            });
        }
    }

    // Obtener guías más recientes
    async getRecent(req, res) {
        try {
            const { limit = 10 } = req.query;
            const guias = await this.repository.findRecent(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Guías recientes obtenidas exitosamente',
                data: guias
            });
        } catch (error) {
            console.error('Error en getRecent:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener guías recientes',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear guía
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

            if (!['PDF', 'DOC', 'XLSX'].includes(data.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: PDF, DOC, XLSX'
                });
            }

            if (!data.category) {
                return res.status(400).json({
                    success: false,
                    message: 'La categoría es requerida'
                });
            }

            await super.create(req, res);
        } catch (error) {
            console.error('Error en create guía:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear guía',
                error: error.message
            });
        }
    }
}

module.exports = GuiasElectoralesController;