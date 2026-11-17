const BaseController = require('./BaseController');
const { TiposNoticiaRepository } = require('../repositories');

class TiposNoticiaController extends BaseController {
    constructor() {
        super(new TiposNoticiaRepository());
    }

    async getActive(req, res) {
        try {
            res.status(200).json({
                success: true,
                message: 'Tipos de noticia activos obtenidos exitosamente',
                data: await this.repository.findActive()
            });
        } catch (error) {
            console.error('Error en getActive tipos de noticia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de noticia activos',
                error: error.message
            });
        }
    }
}

module.exports = TiposNoticiaController;
