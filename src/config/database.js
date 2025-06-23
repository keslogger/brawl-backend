// src/config/database.js
const { Sequelize } = require('sequelize');

// Configurações da conexão com o banco de dados PostgreSQL
// ATENÇÃO: Use variáveis de ambiente em um projeto real por segurança!
const sequelize = new Sequelize('brawl_draft_db', 'postgres', 'docker', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log, // Mostra os comandos SQL no console
});

module.exports = sequelize;