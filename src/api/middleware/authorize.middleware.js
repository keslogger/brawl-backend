const authorizeAdmin = (req, res, next) => {
  // Este middleware deve ser usado DEPOIS do authMiddleware
  if (req.user && req.user.role === 'super_admin') {
    next(); // Se for super_admin, permite a passagem
  } else {
    res.status(403).json({ error: 'Acesso negado. Requer privilégios de Super Administrador.' });
  }
};

module.exports = authorizeAdmin;
