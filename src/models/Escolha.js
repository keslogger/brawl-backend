// src/models/Escolha.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// AQUI definimos a variável 'Escolha'
const Escolha = sequelize.define('Escolha', {
  personagemEscolhido: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'personagem_escolhido'
  },
  modoDeJogo: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'modo_de_jogo'
  },
  mapa: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// E AQUI exportamos a variável que acabamos de definir
module.exports = Escolha;