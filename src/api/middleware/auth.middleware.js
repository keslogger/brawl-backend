// src/api/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'seu_segredo_super_secreto');
    req.user = decoded; // Adiciona os dados do usuário (id, role) à requisição
    next(); // Se o token for válido, permite que a requisição continue
  } catch (error) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};

module.exports = authMiddleware;