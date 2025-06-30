// src/api/routes/user.routes.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorize.middleware');

// --- ROTAS PROTEGIDAS PARA GESTÃO DE UTILIZADORES ---
// Note que usamos os dois middlewares em sequência.

// Lista todos os utilizadores (apenas super_admin)
router.get('/users', authMiddleware, authorizeAdmin, userController.listarUsuarios);

// Cria um novo administrador (apenas super_admin)
router.post('/users', authMiddleware, authorizeAdmin, userController.criarAdmin);

// Apaga um utilizador (apenas super_admin)
router.delete('/users/:id', authMiddleware, authorizeAdmin, userController.deletarUsuario);


module.exports = router;
