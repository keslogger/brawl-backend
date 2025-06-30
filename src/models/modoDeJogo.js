
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModoDeJogo = sequelize.define('ModoDeJogo', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = ModoDeJogo;
