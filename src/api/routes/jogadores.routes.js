const express = require('express');
const router = express.Router();
const jogadorController = require('../controllers/jogador.controller');
const authMiddleware = require('../middleware/auth.middleware');

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
 *         description: Lista de jogadores retornada com sucesso.
 */

/**
 * @swagger
 * /jogadores:
 *   post:
 *     summary: Cria um novo jogador manualmente
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
 *               instituicaoDeEnsino:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Jogador criado com sucesso.
 */

router.get('/jogadores', authMiddleware, jogadorController.listarJogadores);
router.post('/jogadores', authMiddleware, jogadorController.criarJogador);

/**
 * @swagger
 * /jogadores/importar/{playerTag}:
 *   post:
 *     summary: Importa um jogador da API do Brawl Stars e salva localmente
 *     tags: [Jogadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         description: A tag do jogador no Brawl Stars (com ou sem #).
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               instituicaoDeEnsino:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Jogador importado e salvo com sucesso.
 */
router.post('/jogadores/importar/:playerTag', authMiddleware, jogadorController.importarJogador);

/**
 * @swagger
 * /brawlstars/jogadores/{playerTag}:
 *   get:
 *     summary: Busca dados de um jogador na API oficial do Brawl Stars (sem salvar)
 *     tags: [Brawlers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playerTag
 *         required: true
 *         description: A tag do jogador no Brawl Stars (com ou sem #).
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Dados do jogador retornados com sucesso.
 */

router.get('/brawlstars/jogadores/:playerTag', authMiddleware, jogadorController.buscarJogadorNaAPI);

module.exports = router;
