const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const authorizeAdmin = require('../middleware/authorize.middleware');

/**
 * @swagger
 * /users:
 * get:
 * summary: Lista todos os usuários administradores
 * tags: [Usuários]
 * description: Retorna uma lista de todos os usuários. Apenas um super_admin pode acessar.
 * security:
 * - bearerAuth: []
 * responses:
 * '200':
 * description: Sucesso.
 * '403':
 * description: Acesso negado.
 * post:
 * summary: Cria um novo usuário com a função 'admin'
 * tags: [Usuários]
 * description: Cria um novo usuário administrador. Apenas um super_admin pode executar esta ação.
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * example: "novo.admin@torneio.com"
 * password:
 * type: string
 * example: "outrasenha123"
 * responses:
 * '201':
 * description: Usuário admin criado com sucesso.
 * '409':
 * description: Conflito, o email já está em uso.
 */
router.get('/users', authMiddleware, authorizeAdmin, userController.listarUsuarios);
router.post('/users', authMiddleware, authorizeAdmin, userController.criarAdmin);

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
 *         description: Acesso negado (ex: tentar se auto-deletar).
 *       '404':
 *         description: Usuário não encontrado.
 */

router.delete('/users/:id', authMiddleware, authorizeAdmin, userController.deletarUsuario);

module.exports = router;
