// src/models/SessaoDraft.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SessaoDraft = sequelize.define('SessaoDraft', {
  status: {
    // Agora o status inicial será definido pela lógica do nosso controller
    type: DataTypes.ENUM('pendente', 'ban_em_andamento', 'pick_em_andamento', 'finalizado', 'cancelado'),
    allowNull: false
  },
  equipeAzulId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  equipeVermelhaId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = SessaoDraft;
