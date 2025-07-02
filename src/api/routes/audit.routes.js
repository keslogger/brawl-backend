const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /audit-logs:
 *   get:
 *     summary: Lista todos os registros de auditoria
 *     tags: [Auditoria]
 *     description: Retorna uma lista de todas as ações importantes realizadas no sistema, ordenadas da mais recente para a mais antiga. Requer autenticação.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna a lista de logs de auditoria.
 *       '401':
 *         description: Não autorizado.
 */
router.get('/audit-logs', authMiddleware, auditController.listarLogs);

module.exports = router;
