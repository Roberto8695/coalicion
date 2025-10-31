const BaseController = require('./BaseController');
const { VerificadoresRepository } = require('../repositories');

class VerificadoresController extends BaseController {
    constructor() {
        super(new VerificadoresRepository());
    }

    // Obtener verificadores activos
    async getActive(req, res) {
        try {
            const verificadores = await this.repository.findActive();

            res.status(200).json({
                success: true,
                message: 'Verificadores activos obtenidos exitosamente',
                data: verificadores.data || verificadores
            });
        } catch (error) {
            console.error('Error en getActive:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener verificadores activos',
                error: error.message
            });
        }
    }

    // Obtener verificadores por tipo
    async getByType(req, res) {
        try {
            const { type } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['website', 'bot', 'api', 'tool'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: website, bot, api, tool'
                });
            }

            const result = await this.repository.findByType(
                type,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Verificadores tipo ${type} obtenidos exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByType:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener verificadores por tipo',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear verificador
    async create(req, res) {
        try {
            const data = req.body;
            
            if (!data.name) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre es requerido'
                });
            }

            if (!data.type) {
                return res.status(400).json({
                    success: false,
                    message: 'El tipo es requerido'
                });
            }

            if (!['website', 'bot', 'api', 'tool'].includes(data.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: website, bot, api, tool'
                });
            }

            await super.create(req, res);
        } catch (error) {
            console.error('Error en create verificador:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear verificador',
                error: error.message
            });
        }
    }
}

module.exports = VerificadoresController;