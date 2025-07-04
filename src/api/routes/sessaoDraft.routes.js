const express = require('express');
const router = express.Router();
const sessaoDraftController = require('../controllers/sessaoDraft.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Sessões de Draft
 *   description: Endpoints para criar e gerenciar o ciclo de vida de uma sessão de draft.
 */

/**
 * @swagger
 * /sessoes-draft:
 *   post:
 *     summary: Cria uma nova sessão de draft
 *     tags: [Sessões de Draft]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipeAzulId:
 *                 type: integer
 *               equipeVermelhaId:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Sessão criada com sucesso.
 */
router.post('/sessoes-draft', authMiddleware, sessaoDraftController.criarSessao);

/**
 * @swagger
 * /sessoes-draft/{id}:
 *   get:
 *     summary: Busca uma sessão de draft e suas escolhas
 *     tags: [Sessões de Draft]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Sessão encontrada com sucesso.
 */
router.get('/sessoes-draft/:id', authMiddleware, sessaoDraftController.buscarSessaoPorId);

/**
 * @swagger
 * /sessoes-draft/{sessaoDraftId}/bans:
 *   post:
 *     summary: Registra todos os 6 bans de uma só vez
 *     tags: [Sessões de Draft]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessaoDraftId
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
 *               bansEquipeAzul:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Leon", "Spike", "Crow"]
 *               bansEquipeVermelha:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Sandy", "Amber", "Meg"]
 *     responses:
 *       '201':
 *         description: Bans registrados com sucesso.
 */
router.post('/sessoes-draft/:sessaoDraftId/bans', authMiddleware, sessaoDraftController.registrarBans);

/**
 * @swagger
 * /sessoes-draft/{id}/iniciar:
 *   put:
 *     summary: (Admin) Altera o status de uma sessão para 'ban_em_andamento'
 *     tags: [Sessões de Draft]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Status da sessão alterado com sucesso.
 */
router.put('/sessoes-draft/:id/iniciar', authMiddleware, sessaoDraftController.iniciarSessao);

/**
 * @swagger
 * /sessoes-draft/{id}/finalizar:
 *   put:
 *     summary: (Admin) Altera o status de uma sessão para 'finalizado'
 *     tags: [Sessões de Draft]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Status da sessão alterado com sucesso.
 */
router.put('/sessoes-draft/:id/finalizar', authMiddleware, sessaoDraftController.finalizarSessao);

/**
 * @swagger
 * /sessoes-draft/{id}/reiniciar:
 *   put:
 *     summary: (Admin) Altera o status de uma sessão para 'pendente'
 *     tags: [Sessões de Draft]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Status da sessão alterado com sucesso.
 */
router.put('/sessoes-draft/:id/reiniciar', authMiddleware, sessaoDraftController.reiniciarSessao);

module.exports = router;
