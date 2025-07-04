const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorize.middleware');

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Rotas para login e gerenciamento de tokens.
 *   - name: Usuários
 *     description: Operações relacionadas a usuários administradores.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "super.admin@torneio.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       '200':
 *         description: Login bem-sucedido, token retornado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '401':
 *         description: Credenciais inválidas.
 */
router.post('/auth/login', userController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários administradores
 *     tags: [Usuários]
 *     description: Retorna uma lista de todos os usuários. Apenas um super_admin pode acessar.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sucesso.
 *       '403':
 *         description: Acesso negado.
 */
router.get('/users', authMiddleware, authorizeAdmin, userController.listarUsuarios);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário com a função 'admin'
 *     tags: [Usuários]
 *     description: Cria um novo usuário administrador. Apenas um super_admin pode executar esta ação.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "novo.admin@torneio.com"
 *               password:
 *                 type: string
 *                 example: "outrasenha123"
 *     responses:
 *       '201':
 *         description: Usuário admin criado com sucesso.
 *       '409':
 *         description: Conflito, o email já está em uso.
 */
router.post(
  '/users',
  authMiddleware,
  authorizeAdmin,
  // --- Validações ---
  body('email', 'O email fornecido é inválido.').isEmail(),
  body('password', 'A senha deve ter no mínimo 6 caracteres.').isLength({ min: 6 }),
  userController.criarAdmin
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário administrador
 *     tags: [Usuários]
 *     description: Deleta um usuário com base no seu ID. Apenas um super_admin pode executar esta ação.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do usuário a ser deletado.
 *     responses:
 *       '204':
 *         description: Usuário deletado com sucesso.
 *       '403':
 *         description: "Acesso negado (ex: tentar se auto-deletar)."
 *       '404':
 *         description: Usuário não encontrado.
 */
router.delete('/users/:id', authMiddleware, authorizeAdmin, userController.deletarUsuario);

module.exports = router;
