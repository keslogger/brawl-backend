const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Escolha = sequelize.define('Escolha', {
  personagemEscolhido: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'personagem_escolhido'
  },
  // NOVO CAMPO para diferenciar picks de bans
  tipo: {
    type: DataTypes.ENUM('pick', 'ban'),
    allowNull: false,
  },
  modoDeJogo: {
    type: DataTypes.STRING,
    allowNull: true // Modo e mapa podem ser definidos uma vez por sessão
  },
  mapa: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Escolha;
