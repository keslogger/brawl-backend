const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Debug
 *   description: Ferramentas de depuração para a API
 */

/**
 * @swagger
 * /debug/my-ip:
 *   get:
 *     summary: Retorna o endereço de IP de saída do servidor
 *     tags: [Debug]
 *     description: Endpoint para verificar qual o endereço de IP público o servidor está usando para fazer requisições externas. Útil para configurar firewalls e listas de permissão.
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna o endereço de IP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ip:
 *                   type: string
 *                   example: "213.188.208.57"
 */
router.get('/debug/my-ip', async (req, res) => {
  try {
    // Usamos um serviço público para descobrir nosso próprio IP de saída
    const response = await axios.get('https://api.ipify.org?format=json');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Erro ao verificar o IP de saída:', error.message);
    res.status(500).json({ error: 'Não foi possível determinar o IP de saída.' });
  }
});

module.exports = router;

