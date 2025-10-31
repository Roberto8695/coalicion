const BaseController = require('./BaseController');
const { CategoriasRepository } = require('../repositories');

class CategoriasController extends BaseController {
    constructor() {
        super(new CategoriasRepository());
    }

    // Obtener categorías activas
    async getActive(req, res) {
        try {
            const categorias = await this.repository.findActive();

            res.status(200).json({
                success: true,
                message: 'Categorías activas obtenidas exitosamente',
                data: categorias.data || categorias
            });
        } catch (error) {
            console.error('Error en getActive:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener categorías activas',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear categoría
    async create(req, res) {
        try {
            const data = req.body;
            
            if (!data.name) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre es requerido'
                });
            }

            await super.create(req, res);
        } catch (error) {
            console.error('Error en create categoría:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear categoría',
                error: error.message
            });
        }
    }
}

module.exports = CategoriasController;