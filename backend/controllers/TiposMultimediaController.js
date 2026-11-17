const BaseController = require('./BaseController');
const { TiposMultimediaRepository } = require('../repositories');

class TiposMultimediaController extends BaseController {
    constructor() {
        super(new TiposMultimediaRepository());
    }

    async getActive(req, res) {
        try {
            res.status(200).json({
                success: true,
                message: 'Tipos de multimedia activos obtenidos exitosamente',
                data: await this.repository.findActive()
            });
        } catch (error) {
            console.error('Error en getActive tipos de multimedia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de multimedia activos',
                error: error.message
            });
        }
    }
}

module.exports = TiposMultimediaController;
