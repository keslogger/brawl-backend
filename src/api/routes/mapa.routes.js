const express = require('express');
const router = express.Router();
const mapaController = require('../controllers/mapa.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /mapas:
 *   get:
 *     summary: Lista todos os mapas cadastrados
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso.
 */

/**
 * @swagger
 * /mapas:
 *   post:
 *     summary: Cadastra um novo mapa
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
 *                 example: "Mina Rochosa"
 *     responses:
 *       '201':
 *         description: Mapa criado com sucesso.
 */

router.post('/mapas', authMiddleware, mapaController.criarMapa);
router.get('/mapas', authMiddleware, mapaController.listarMapas);
router.delete('/mapas/:id', authMiddleware, mapaController.deletarMapa);

module.exports = router;
