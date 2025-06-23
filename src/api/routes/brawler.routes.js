const express = require('express');
const router = express.Router();
const brawlerController = require('../controllers/brawler.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Brawlers
 *   description: Endpoints para dados dos Brawlers
 */


/**
 * @swagger
 * /brawlers:
 *   get:
 *     summary: Retorna a lista de todos os Brawlers (heróis) do jogo.
 *     tags: [Brawlers]
 *     description: Busca os dados da API oficial do Brawl Stars. Os resultados são mantidos em cache para otimizar o desempenho.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de Brawlers retornada com sucesso.
 *       '500':
 *         description: Erro ao buscar dados na API externa.
 */

router.get('/brawlers', authMiddleware, brawlerController.listarTodos);

module.exports = router;