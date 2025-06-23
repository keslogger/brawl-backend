// src/api/routes/escolha.routes.js
const express = require('express');
const router = express.Router();
// Assumindo que o controller se chama escolha.controller.js
const escolhaController = require('../controllers/escolha.controller');

// A rota deve ser no plural: '/escolhas' para corresponder ao que o Thunder Client está chamando
router.post('/escolhas', escolhaController.criarEscolha);

// No futuro, se você quiser uma rota para listar todas as escolhas, ela viria aqui:
// router.get('/escolhas', escolhaController.listarEscolhas);

module.exports = router;