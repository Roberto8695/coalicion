const BaseController = require('./BaseController');
const TiposPublicacionRepository = require('../repositories/TiposPublicacionRepository');

class TiposPublicacionController extends BaseController {
    constructor() {
        super(new TiposPublicacionRepository());
    }

    async getActive(req, res) {
        try {
            const tipos = await this.repository.findActive();
            res.status(200).json({
                success: true,
                message: 'Tipos de publicación activos obtenidos exitosamente',
                data: tipos
            });
        } catch (error) {
            console.error('Error en getActive tipos de publicación:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener tipos de publicación',
                error: error.message
            });
        }
    }

    async validateData(data, id = null) {
        if (!data.name || !String(data.name).trim()) {
            return 'El nombre es requerido';
        }

        if (!data.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
            return 'El slug es requerido y solo puede contener letras minúsculas, números y guiones';
        }

        if (await this.repository.existsActiveSlug(data.slug, id)) {
            return 'Ya existe un tipo activo con ese slug';
        }

        return null;
    }

    async create(req, res) {
        try {
            const data = { ...req.body };
            const validationError = await this.validateData(data);
            if (validationError) {
                return res.status(400).json({ success: false, message: validationError });
            }

            data.name = String(data.name).trim();
            data.slug = String(data.slug).trim().toLowerCase();
            req.body = data;
            await super.create(req, res);
        } catch (error) {
            console.error('Error en create tipo de publicación:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear tipo de publicación',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const data = { ...req.body };
            const validationError = await this.validateData(data, id);
            if (validationError) {
                return res.status(400).json({ success: false, message: validationError });
            }

            data.name = String(data.name).trim();
            data.slug = String(data.slug).trim().toLowerCase();
            req.body = data;
            await super.update(req, res);
        } catch (error) {
            console.error('Error en update tipo de publicación:', error);
            res.status(500).json({
                success: false,
                message: 'Error al actualizar tipo de publicación',
                error: error.message
            });
        }
    }
}

module.exports = TiposPublicacionController;
