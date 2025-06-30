const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mapa = sequelize.define('Mapa', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
  // No futuro, poderíamos adicionar um campo para a imagem do mapa aqui
});

module.exports = Mapa;
