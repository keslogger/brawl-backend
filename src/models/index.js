// src/models/index.js

const sequelize = require('../config/database');

// Importa todos os modelos
const User = require('./User');
const Equipe = require('./Equipe');
const Jogador = require('./Jogador');
const Escolha = require('./Escolha');
const SessaoDraft = require('./sessaoDraft');
const AuditLog = require('./AuditLog');

// ---- Associações Centralizadas ----

// Relação Equipe <-> Jogador
Equipe.hasMany(Jogador, { foreignKey: 'equipeId' });
Jogador.belongsTo(Equipe, { foreignKey: 'equipeId' });

// Relação SessaoDraft <-> Escolha
SessaoDraft.hasMany(Escolha, { foreignKey: 'sessaoDraftId' });
Escolha.belongsTo(SessaoDraft, { foreignKey: 'sessaoDraftId' });

// Relação Equipe -> Escolha
Equipe.hasMany(Escolha, { foreignKey: 'equipeId' });
Escolha.belongsTo(Equipe, { foreignKey: 'equipeId' });

// Relação User -> AuditLog
User.hasMany(AuditLog, { foreignKey: 'userId' });
AuditLog.belongsTo(User, { foreignKey: 'userId' });

// Agrupa a instância do Sequelize e todos os modelos em um único objeto 'db'
const db = {
  sequelize,
  User,
  Equipe,
  Jogador,
  Escolha,
  SessaoDraft,
  AuditLog
};

module.exports = db;