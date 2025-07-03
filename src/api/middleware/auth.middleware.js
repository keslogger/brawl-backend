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
    // --- DEBUGGING ---
    // Loga o erro específico no console do servidor para podermos ver nos logs do Fly.io
    console.error('Erro na verificação do JWT:', error);

    // Retorna uma resposta mais detalhada para o cliente (Swagger)
    return res.status(400).json({
      error: 'Token inválido.',
      details: {
        name: error.name,     // Ex: "JsonWebTokenError" ou "TokenExpiredError"
        message: error.message, // Ex: "invalid signature" ou "jwt expired"
      },
    });
    // --- FIM DO DEBUGGING ---
  }
};

module.exports = authMiddleware;
