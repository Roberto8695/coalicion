const BaseController = require('./BaseController');
const { MultimediaRepository } = require('../repositories');

class MultimediaController extends BaseController {
    constructor() {
        super(new MultimediaRepository());
    }

    async getPreviewMetadata(req, res) {
        try {
            const rawUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
            let targetUrl;

            try {
                targetUrl = new URL(rawUrl);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: 'La URL debe comenzar con http:// o https://'
                });
            }

            if (!['http:', 'https:'].includes(targetUrl.protocol) || targetUrl.username || targetUrl.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Solo se permiten URLs públicas http o https'
                });
            }

            const hostname = targetUrl.hostname.toLowerCase();
            const isPrivateHost = hostname === 'localhost'
                || hostname === '::1'
                || hostname === '0.0.0.0'
                || hostname.startsWith('127.')
                || hostname.startsWith('10.')
                || hostname.startsWith('192.168.')
                || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname);

            if (isPrivateHost) {
                return res.status(400).json({
                    success: false,
                    message: 'No se permiten direcciones privadas'
                });
            }

            const response = await fetch(targetUrl, {
                headers: {
                    'User-Agent': 'CoalicionCMS/1.0 (+https://coalicion.bo)'
                },
                signal: AbortSignal.timeout(8000)
            });

            if (!response.ok) {
                return res.status(502).json({
                    success: false,
                    message: `El sitio respondió con el estado ${response.status}`
                });
            }

            const contentLength = Number(response.headers.get('content-length') || 0);
            if (contentLength > 2 * 1024 * 1024) {
                return res.status(413).json({
                    success: false,
                    message: 'La página es demasiado grande para obtener su miniatura'
                });
            }

            const html = (await response.text()).slice(0, 2 * 1024 * 1024);
            const getMetaContent = (key) => {
                const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const patterns = [
                    new RegExp(`<meta\\b[^>]*(?:property|name)\\s*=\\s*["']${escapedKey}["'][^>]*content\\s*=\\s*["']([^"']+)["']`, 'i'),
                    new RegExp(`<meta\\b[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*(?:property|name)\\s*=\\s*["']${escapedKey}["']`, 'i')
                ];

                for (const pattern of patterns) {
                    const match = html.match(pattern);
                    if (match?.[1]) return match[1].trim();
                }

                return '';
            };

            const firstPageImage = html.match(
                /<img\b[^>]*(?:src|data-src)\s*=\s*["']([^"']+)["']/i
            )?.[1] || '';
            const image = getMetaContent('og:image')
                || getMetaContent('twitter:image')
                || firstPageImage;
            const imageUrl = image ? new URL(image, response.url || targetUrl).toString() : '';

            res.status(200).json({
                success: true,
                message: imageUrl ? 'Miniatura encontrada' : 'La página no publica una miniatura',
                data: {
                    imageUrl,
                    title: getMetaContent('og:title') || getMetaContent('twitter:title'),
                    description: getMetaContent('og:description') || getMetaContent('twitter:description')
                }
            });
        } catch (error) {
            console.error('Error al obtener metadatos de multimedia:', error);
            res.status(502).json({
                success: false,
                message: 'No se pudo consultar la página para obtener su miniatura'
            });
        }
    }

    // Obtener multimedia con categoría
    async getAllWithCategory(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            
            const cleanFilters = Object.keys(filters).reduce((acc, key) => {
                if (filters[key] && filters[key] !== '') {
                    acc[key] = filters[key];
                }
                return acc;
            }, {});

            const result = await this.repository.findAllWithCategory(
                parseInt(page), 
                parseInt(limit), 
                cleanFilters
            );

            res.status(200).json({
                success: true,
                message: 'Multimedia obtenida exitosamente',
                ...result
            });
        } catch (error) {
            console.error('Error en getAllWithCategory:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // Obtener multimedia por tipo
    async getByType(req, res) {
        try {
            const { type } = req.params;
            const { page = 1, limit = 10 } = req.query;

            if (!['infografia', 'video', 'arte', 'presentacion'].includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: infografia, video, arte, presentacion'
                });
            }

            const result = await this.repository.findByType(
                type,
                parseInt(page),
                parseInt(limit)
            );

            res.status(200).json({
                success: true,
                message: `Multimedia tipo ${type} obtenida exitosamente`,
                ...result
            });
        } catch (error) {
            console.error('Error en getByType:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener multimedia por tipo',
                error: error.message
            });
        }
    }

    // Obtener multimedia destacada
    async getFeatured(req, res) {
        try {
            const { limit = 5 } = req.query;
            const multimedia = await this.repository.findFeatured(parseInt(limit));

            res.status(200).json({
                success: true,
                message: 'Multimedia destacada obtenida exitosamente',
                data: multimedia
            });
        } catch (error) {
            console.error('Error en getFeatured:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener multimedia destacada',
                error: error.message
            });
        }
    }

    // Validaciones específicas para crear multimedia
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

            if (!['infografia', 'video', 'arte', 'presentacion'].includes(data.type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Tipo inválido. Debe ser: infografia, video, arte, presentacion'
                });
            }

            await super.create(req, res);
        } catch (error) {
            console.error('Error en create multimedia:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear multimedia',
                error: error.message
            });
        }
    }
}

module.exports = MultimediaController;