const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

// A Render fornece a URL de conexão na variável de ambiente DATABASE_URL
const connectionString = process.env.DATABASE_URL;

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  // Esta configuração é CRUCIAL para o deploy na Render
  dialectOptions: {
    ssl: isProduction ? { require: true, rejectUnauthorized: false } : false
  },
  logging: false // Desativamos os logs do SQL em produção
});

module.exports = sequelize;