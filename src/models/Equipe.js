const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Equipe = sequelize.define('Equipe', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  icone: {
    type: DataTypes.STRING,
    allowNull: true // O ícone pode ser opcional
  }
});

module.exports = Equipe;