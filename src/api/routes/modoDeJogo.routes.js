const express = require('express');
const router = express.Router();
const modoController = require('../controllers/modoDeJogo.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/modos-de-jogo', authMiddleware, modoController.criarModo);
router.get('/modos-de-jogo', authMiddleware, modoController.listarModos);
router.delete('/modos-de-jogo/:id', authMiddleware, modoController.deletarModo);

module.exports = router;