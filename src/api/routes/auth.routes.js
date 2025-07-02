const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Endpoints para registro e login de usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário administrador
 *     tags: [Autenticação]
 *     description: Endpoint para criar um novo usuário. Em produção, esta rota deve ser protegida ou usada apenas para criar o primeiro super_admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@torneio.com"
 *               password:
 *                 type: string
 *                 example: "senhaforte123"
 *     responses:
 *       '201':
 *         description: Usuário criado com sucesso.
 */
router.post('/auth/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login e retorna um token JWT
 *     tags: [Autenticação]
 *     description: Envie o email e a senha para receber um token de autenticação. Este token deve ser usado no cabeçalho 'Authorization' como 'Bearer [token]' para acessar rotas protegidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@torneio.com"
 *               password:
 *                 type: string
 *                 example: "senhaforte123"
 *     responses:
 *       '200':
 *         description: Login bem-sucedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: O token JWT para ser usado nas requisições seguintes.
 *       '401':
 *         description: Credenciais inválidas.
 */
router.post('/auth/login', authController.login);

module.exports = router;
