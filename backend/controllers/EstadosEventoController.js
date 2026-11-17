const BaseController = require('./BaseController');
const CatalogosEventosRepository = require('../repositories/CatalogosEventosRepository');

class EstadosEventoController extends BaseController {
    constructor() {
        super(new CatalogosEventosRepository('estados_evento'));
    }

    async getActive(req, res) {
        try {
            res.json({ success: true, message: 'Estados de evento activos obtenidos exitosamente', data: await this.repository.findActive() });
        } catch (error) {
            console.error('Error en estados de evento:', error);
            res.status(500).json({ success: false, message: 'Error al obtener estados de evento', error: error.message });
        }
    }
}

module.exports = EstadosEventoController;
