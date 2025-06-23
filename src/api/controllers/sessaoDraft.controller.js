// src/api/controllers/sessaoDraft.controller.js
const { SessaoDraft, Escolha, Equipe } = require('../../models');

// Cria uma nova sessão de draft
exports.criarSessao = async (req, res) => {
  try {
    // Apenas cria uma sessão com o status padrão 'pendente'
    const novaSessao = await SessaoDraft.create();
    res.status(201).json(novaSessao);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar sessão de draft: ' + error.message });
  }
};

// Busca uma sessão e todas as suas escolhas
exports.buscarSessaoPorId = async (req, res) => {
  try {
    const sessao = await SessaoDraft.findByPk(req.params.id, {
      // Inclui todas as escolhas associadas a esta sessão
      include: [{
        model: Escolha,
        // Para cada escolha, também inclui os dados da equipe que a fez
        include: [{ model: Equipe, attributes: ['id', 'nome'] }]
      }],
      order: [
        // Ordena as escolhas pela data de criação para vermos a sequência correta
        [Escolha, 'createdAt', 'ASC']
      ]
    });

    if (!sessao) {
      return res.status(404).json({ error: 'Sessão de draft não encontrada' });
    }
    res.status(200).json(sessao);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar sessão de draft: ' + error.message });
  }
};