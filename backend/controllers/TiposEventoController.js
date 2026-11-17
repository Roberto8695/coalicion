const BaseController = require('./BaseController');
const CatalogosEventosRepository = require('../repositories/CatalogosEventosRepository');

class TiposEventoController extends BaseController {
    constructor() {
        super(new CatalogosEventosRepository('tipos_evento'));
    }

    async getActive(req, res) {
        try {
            res.json({ success: true, message: 'Tipos de evento activos obtenidos exitosamente', data: await this.repository.findActive() });
        } catch (error) {
            console.error('Error en tipos de evento:', error);
            res.status(500).json({ success: false, message: 'Error al obtener tipos de evento', error: error.message });
        }
    }
}

module.exports = TiposEventoController;
