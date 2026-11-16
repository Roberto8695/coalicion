const BaseController = require('./BaseController');
const CategoriasDocumentosElectoralesRepository = require('../repositories/CategoriasDocumentosElectoralesRepository');

class CategoriasDocumentosElectoralesController extends BaseController {
    constructor() {
        super(new CategoriasDocumentosElectoralesRepository());
    }

    async getActive(req, res) {
        try {
            const categorias = await this.repository.findActive();
            res.status(200).json({
                success: true,
                message: 'Categorías de documentos electorales activas obtenidas exitosamente',
                data: categorias
            });
        } catch (error) {
            console.error('Error en getActive categorías de documentos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener categorías de documentos electorales',
                error: error.message
            });
        }
    }

    async validateData(data, id = null) {
        if (!data.name || !String(data.name).trim()) return 'El nombre es requerido';
        if (!data.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
            return 'El slug es requerido y solo puede contener letras minúsculas, números y guiones';
        }
        if (await this.repository.existsActiveSlug(data.slug, id)) {
            return 'Ya existe una categoría activa con ese slug';
        }
        return null;
    }

    async create(req, res) {
        try {
            const data = { ...req.body };
            const validationError = await this.validateData(data);
            if (validationError) return res.status(400).json({ success: false, message: validationError });
            data.name = String(data.name).trim();
            data.slug = String(data.slug).trim().toLowerCase();
            req.body = data;
            await super.create(req, res);
        } catch (error) {
            console.error('Error en create categoría de documentos:', error);
            res.status(500).json({ success: false, message: 'Error al crear categoría de documentos', error: error.message });
        }
    }

    async update(req, res) {
        try {
            const data = { ...req.body };
            const validationError = await this.validateData(data, parseInt(req.params.id, 10));
            if (validationError) return res.status(400).json({ success: false, message: validationError });
            data.name = String(data.name).trim();
            data.slug = String(data.slug).trim().toLowerCase();
            req.body = data;
            await super.update(req, res);
        } catch (error) {
            console.error('Error en update categoría de documentos:', error);
            res.status(500).json({ success: false, message: 'Error al actualizar categoría de documentos', error: error.message });
        }
    }
}

module.exports = CategoriasDocumentosElectoralesController;
