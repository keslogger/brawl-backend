const express = require('express');
const router = express.Router();
const jogadorController = require('../controllers/jogador.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /jogadores:
 *   post:
 *     summary: Cria um novo jogador e o associa a uma equipe
 *     tags: [Jogadores]
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
 *                 example: "Jonas"
 *               instituicaoDeEnsino:
 *                 type: string
 *                 example: "Universidade Federal"
 *               equipeId:
 *                 type: integer
 *                 description: "O ID da equipe à qual o jogador pertence."
 *                 example: 1
 *     responses:
 *       '201':
 *         description: Jogador criado com sucesso.
 *       '400':
 *         description: Dados inválidos (ex: nome ou equipeId faltando).
 *       '404':
 *         description: Equipe não encontrada.
 */
router.post('/jogadores', authMiddleware, jogadorController.criarJogador);

/**
 * @swagger
 * /jogadores:
 *   get:
 *     summary: Lista todos os jogadores cadastrados
 *     tags: [Jogadores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso.
 */
router.get('/jogadores', authMiddleware, jogadorController.listarJogadores);

/**
 * @swagger
 * /jogadores/buscar-api/{playerTag}:
 *   get:
 *     summary: Busca os dados de um jogador na API oficial do Brawl Stars
 *     tags: [Jogadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         schema:
 *           type: string
 *         description: A tag do jogador (ex: #2Y2Y2Y2Y).
 *     responses:
 *       '200':
 *         description: Sucesso.
 *       '500':
 *         description: Erro ao buscar dados na API externa.
 */
router.get('/jogadores/buscar-api/:playerTag', authMiddleware, jogadorController.buscarJogadorNaAPI);

/**
 * @swagger
 * /jogadores/importar/{playerTag}:
 *   post:
 *     summary: Importa um jogador da API do Brawl Stars e salva no banco de dados local
 *     tags: [Jogadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         schema:
 *           type: string
 *         description: A tag do jogador a ser importado (ex: #2Y2Y2Y2Y).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instituicaoDeEnsino:
 *                 type: string
 *                 example: "Universidade Federal"
 *     responses:
 *       '201':
 *         description: Jogador importado com sucesso.
 *       '400':
 *         description: Instituição de ensino é obrigatória.
 *       '500':
 *         description: Erro ao importar jogador.
 */
router.post('/jogadores/importar/:playerTag', authMiddleware, jogadorController.importarJogador);

module.exports = router;
