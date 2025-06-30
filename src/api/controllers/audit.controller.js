const { AuditLog, User } = require('../../models');

exports.listarLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['createdAt', 'DESC']], // Mostra os mais recentes primeiro
      include: [{
        model: User,
        attributes: ['id', 'email'] // Mostra o email de quem fez a ação
      }]
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar logs de auditoria.' });
  }
};