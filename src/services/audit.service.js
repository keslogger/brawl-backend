// src/services/audit.service.js
const { AuditLog } = require('../models');

const logAction = async (userId, action, details = {}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      details,
    });
    console.log(`AUDITORIA: Usuário ${userId} realizou a ação ${action}`);
  } catch (error) {
    console.error('Falha ao registrar log de auditoria:', error);
  }
};

module.exports = { logAction };