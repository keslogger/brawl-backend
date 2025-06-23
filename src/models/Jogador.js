// src/models/Jogador.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogador = sequelize.define('Jogador', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instituicaoDeEnsino: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'instituicao_de_ensino' // Nome da coluna no BD
  },
  fonte: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local' // 'local' ou 'api_brawl_stars'
  }
});

module.exports = Jogador;