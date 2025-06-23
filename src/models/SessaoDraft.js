const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SessaoDraft = sequelize.define('SessaoDraft', {
  status: {
    type: DataTypes.ENUM('pendente', 'em_andamento', 'finalizado', 'cancelado'),
    defaultValue: 'pendente',
    allowNull: false
  },
  // Poderíamos adicionar mais campos no futuro, como rodada atual,
  // de quem é a vez, etc. Por enquanto, o status é o suficiente.
});

module.exports = SessaoDraft;