const express = require('express');
const router = express.Router();
const escolhaController = require('../controllers/escolha.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /escolhas:
 *   post:
 *     summary: Registra um novo pick para uma sessão de draft
 *     tags: [Escolhas]
 *     description: Esta rota é usada para registrar os picks (seleções) de heróis, seguindo a ordem de turnos. Os bans são registrados pela rota de bans em massa.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personagemEscolhido:
 *                 type: string
 *               equipeId:
 *                 type: integer
 *               sessaoDraftId:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Pick registrado com sucesso.
 *       '403':
 *         description: Ação não permitida (não é o turno da equipe, ou a fase de picks não está ativa).
 */

router.post('/escolhas', authMiddleware, escolhaController.criarEscolha);

module.exports = router;
