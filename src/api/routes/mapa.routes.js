const express = require('express');
const router = express.Router();
const mapaController = require('../controllers/mapa.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/mapas', authMiddleware, mapaController.criarMapa);
router.get('/mapas', authMiddleware, mapaController.listarMapas);
router.delete('/mapas/:id', authMiddleware, mapaController.deletarMapa);

module.exports = router;
