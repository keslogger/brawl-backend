// src/api/routes/jogadores.routes.js
const express = require('express');
const router = express.Router();
const jogadorController = require('../controllers/jogador.controller');

// Rota para criar um novo jogador (Ex: POST /api/jogadores)
router.post('/jogadores', jogadorController.criarJogador);

// Rota para listar todos os jogadores (Ex: GET /api/jogadores)
router.get('/jogadores', jogadorController.listarJogadores);

// Rota para buscar um jogador da API do Brawl Stars
router.get('/brawlstars/jogadores/:playerTag', jogadorController.buscarJogadorNaAPI);

module.exports = router;