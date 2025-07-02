const express = require('express');
const router = express.Router();
const equipeController = require('../controllers/equipe.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Equipes
 *   description: API para gerenciamento de equipes
 */

/**
 * @swagger
 * /equipes:
 *   get:
 *     summary: Retorna uma lista de todas as equipes
 *     tags: [Equipes]
 *     responses:
 *       '200':
 *         description: Lista de equipes retornada com sucesso.
 */
router.get('/equipes', equipeController.listarEquipes);

/**
 * @swagger
 * /equipes:
 *   post:
 *     summary: Cria uma nova equipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipe'
 *     responses:
 *       '201':
 *         description: Equipe criada com sucesso
 */
router.post('/equipes', authMiddleware, equipeController.criarEquipe);

/**
 * @swagger
 * /equipes/{id}:
 *   get:
 *     summary: Busca uma equipe pelo ID
 *     tags: [Equipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Sucesso
 */
router.get('/equipes/:id', equipeController.buscarEquipePorId);

/**
 * @swagger
 * /equipes/{id}:
 *   put:
 *     summary: Atualiza uma equipe existente
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Equipe'
 *     responses:
 *       '200':
 *         description: Equipe atualizada com sucesso
 */
router.put('/equipes/:id', authMiddleware, equipeController.atualizarEquipe);

/**
 * @swagger
 * /equipes/{id}:
 *   delete:
 *     summary: Deleta uma equipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Equipe deletada com sucesso
 */
router.delete('/equipes/:id', authMiddleware, equipeController.deletarEquipe);

/**
 * @swagger
 * /equipes/{equipeId}/jogadores:
 *   post:
 *     summary: Adiciona um jogador a uma equipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jogadorId:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Jogador adicionado com sucesso.
 */
router.post('/equipes/:equipeId/jogadores', authMiddleware, equipeController.adicionarJogador);

/**
 * @swagger
 * /equipes/{equipeId}/jogadores/{jogadorId}:
 *   delete:
 *     summary: Remove um jogador de uma equipe
 *     tags: [Equipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: jogadorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Jogador removido com sucesso.
 */
router.delete('/equipes/:equipeId/jogadores/:jogadorId', authMiddleware, equipeController.removerJogador);

module.exports = router;
