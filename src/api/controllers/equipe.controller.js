// src/api/controllers/equipe.controller.js

const { Equipe, Jogador } = require('../../models');
const auditService = require('../../services/audit.service');

// --- CONTROLLERS DE EQUIPE ---

exports.criarEquipe = async (req, res) => {
  try {
    const novaEquipe = await Equipe.create(req.body);
    const userId = req.user.id;
    auditService.logAction(userId, 'CRIOU_EQUIPE', {
      equipeId: novaEquipe.id,
      nomeEquipe: novaEquipe.nome
    });
    res.status(201).json(novaEquipe);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar equipe: ' + error.message });
  }
};

exports.listarEquipes = async (req, res) => {
  try {
    const equipes = await Equipe.findAll({ include: [{ model: Jogador }] });
    res.status(200).json(equipes);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao listar equipes: ' + error.message });
  }
};

exports.buscarEquipePorId = async (req, res) => {
  try {
    const equipe = await Equipe.findByPk(req.params.id, {
      include: [{ model: Jogador }]
    });
    if (equipe) {
      res.status(200).json(equipe);
    } else {
      res.status(404).json({ error: 'Equipe não encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar equipe: ' + error.message });
  }
};

exports.atualizarEquipe = async (req, res) => {
  try {
    const [updated] = await Equipe.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const equipeAtualizada = await Equipe.findByPk(req.params.id);
      res.status(200).json(equipeAtualizada);
    } else {
      res.status(404).json({ error: 'Equipe não encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar equipe: ' + error.message });
  }
};

exports.deletarEquipe = async (req, res) => {
  try {
    const deleted = await Equipe.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Equipe não encontrada' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar equipe: ' + error.message });
  }
};

// Adicionar um jogador a uma equipe
exports.adicionarJogador = async (req, res) => {
  try {
    const { id } = req.params;
    const { jogadorId } = req.body;
    const equipe = await Equipe.findByPk(id);
    if (!equipe) {
      return res.status(404).json({ error: 'Equipe não encontrada' });
    }
    const jogador = await Jogador.findByPk(jogadorId);
    if (!jogador) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }
    await equipe.addJogador(jogador);
    res.status(200).json({ message: `Jogador ${jogador.nome} adicionado à equipe ${equipe.nome}` });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao adicionar jogador à equipe: ' + error.message });
  }
};

// Remove um jogador de uma equipe
exports.removerJogador = async (req, res) => {
  try {
    const { equipeId, jogadorId } = req.params;
    const equipe = await Equipe.findByPk(equipeId);
    if (!equipe) {
      return res.status(404).json({ error: 'Equipe não encontrada' });
    }
    const jogador = await Jogador.findByPk(jogadorId);
    if (!jogador) {
      return res.status(404).json({ error: 'Jogador não encontrado' });
    }
    
    await equipe.removeJogador(jogador);

    const userId = req.user.id;
    auditService.logAction(userId, 'REMOVEU_JOGADOR_DA_EQUIPE', {
      equipeId: equipe.id,
      nomeEquipe: equipe.nome,
      jogadorId: jogador.id,
      nomeJogador: jogador.nome
    });

    res.status(200).json({ message: `Jogador ${jogador.nome} removido da equipe ${equipe.nome}` });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao remover jogador da equipe: ' + error.message });
  }
};