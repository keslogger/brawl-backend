const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Rota protegida para listar todos os logs de auditoria
router.get('/audit-logs', authMiddleware, auditController.listarLogs);

module.exports = router;