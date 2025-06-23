// src/api/routes/sessaoDraft.routes.js
const express = require('express');
const router = express.Router();
const sessaoDraftController = require('../controllers/sessaoDraft.controller');

router.post('/sessoes-draft', sessaoDraftController.criarSessao);
router.get('/sessoes-draft/:id', sessaoDraftController.buscarSessaoPorId);

module.exports = router;