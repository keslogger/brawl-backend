const express = require('express');
const router = express.Router();
const modoController = require('../controllers/modoDeJogo.controller');
const authMiddleware = require('../middleware/auth.middleware');
/**
 * @swagger
 * /modos-de-jogo:
 *   get:
 *     summary: Lista todos os modos de jogo cadastrados
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso.
 */

/**
 * @swagger
 * /modos-de-jogo:
 *   post:
 *     summary: Cadastra um novo modo de jogo
 *     tags: [Configurações]
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
 *                 example: "Pique-Gema"
 *     responses:
 *       '201':
 *         description: Modo de jogo criado com sucesso.
 */

router.post('/modos-de-jogo', authMiddleware, modoController.criarModo);
router.get('/modos-de-jogo', authMiddleware, modoController.listarModos);
router.delete('/modos-de-jogo/:id', authMiddleware, modoController.deletarModo);

module.exports = router;