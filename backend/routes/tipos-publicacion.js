const express = require('express');
const TiposPublicacionController = require('../controllers/TiposPublicacionController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const controller = new TiposPublicacionController();

router.get('/active', (req, res) => controller.getActive(req, res));
router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({ success: false, message: 'ID debe ser un número válido' });
    }
    controller.getById(req, res);
});
router.post('/', authenticateToken, requireAdmin, (req, res) => controller.create(req, res));
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({ success: false, message: 'ID debe ser un número válido' });
    }
    controller.update(req, res);
});
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({ success: false, message: 'ID debe ser un número válido' });
    }
    controller.delete(req, res);
});

module.exports = router;
