// src/api/routes/sessaoDraft.routes.js
const express = require('express');
const router = express.Router();
const sessaoDraftController = require('../controllers/sessaoDraft.controller');
// A linha abaixo importa o nosso middleware de autenticação
const authMiddleware = require('../middleware/auth.middleware');

// Rotas existentes
router.post('/sessoes-draft', authMiddleware, sessaoDraftController.criarSessao);
router.get('/sessoes-draft/:id', sessaoDraftController.buscarSessaoPorId);

// --- NOVAS ROTAS DE GESTÃO DE ESTADO ---
router.put('/sessoes-draft/:id/iniciar', authMiddleware, sessaoDraftController.iniciarSessao);
router.put('/sessoes-draft/:id/finalizar', authMiddleware, sessaoDraftController.finalizarSessao);
router.put('/sessoes-draft/:id/reiniciar', authMiddleware, sessaoDraftController.reiniciarSessao);

// --- NOVA ROTA PARA BANS EM MASSA ---
router.post('/sessoes-draft/:sessaoDraftId/bans', authMiddleware, sessaoDraftController.registrarBans);

module.exports = router;
