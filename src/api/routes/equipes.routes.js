// src/api/routes/equipes.routes.js
const express = require('express');
const router = express.Router();
const equipeController = require('../controllers/equipe.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /equipes:
 *   get:
 *     summary: Retorna uma lista de todas as equipes
 *     tags: 
 *       - Equipes
 *     description: Endpoint público para visualizar todas as equipes e seus jogadores.
 *     responses:
 *       '200':
 *         description: Lista de equipes retornada com sucesso.
 *   post:
 *     summary: Cria uma nova equipe
 *     tags: 
 *       - Equipes
 *     description: Cria uma nova equipe no sistema. Requer autenticação.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Os Invencíveis"
 *               icone:
 *                 type: string
 *                 example: "url_do_icone.png"
 *     responses:
 *       '201':
 *         description: Equipe criada com sucesso
 *       '400':
 *         description: Erro de validação
 *       '401':
 *         description: Não autorizado (token JWT inválido ou não fornecido)
 */
router.get('/equipes', equipeController.listarEquipes);
router.post('/equipes', authMiddleware, equipeController.criarEquipe);

// (O resto das suas rotas pode ficar como estava)
router.get('/equipes/:id', equipeController.buscarEquipePorId);
router.put('/equipes/:id', authMiddleware, equipeController.atualizarEquipe);
router.delete('/equipes/:id', authMiddleware, equipeController.deletarEquipe);
router.post('/equipes/:id/jogadores', authMiddleware, equipeController.adicionarJogador);

module.exports = router;
