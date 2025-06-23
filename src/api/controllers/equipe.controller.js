// src/api/controllers/equipe.controller.js

const { Equipe, Jogador } = require('../../models');
// A linha abaixo importa o serviço de auditoria, corrigindo o erro
const auditService = require('../../services/audit.service'); 

// --- CONTROLLERS DE EQUIPE ---

// Criar uma nova equipe
exports.criarEquipe = async (req, res) => {
  try {
    console.log('--- RECEBENDO DADOS PARA CRIAÇÃO DE EQUIPE:', req.body); // Log dos dados recebidos
    const novaEquipe = await Equipe.create(req.body);

    // Pega o ID do usuário que veio do middleware de autenticação
    const userId = req.user.id; 
    // Chama o serviço para registrar a ação
    auditService.logAction(userId, 'CRIOU_EQUIPE', { 
      equipeId: novaEquipe.id, 
      nomeEquipe: novaEquipe.nome 
    });

    res.status(201).json(novaEquipe);
  } catch (error) {
    console.error('--- ERRO AO CRIAR EQUIPE:', error); // Log do erro detalhado
        res.status(400).json({ 
        error: 'Erro ao criar equipe: ' + error.message,
        details: error.errors // Inclui detalhes dos erros de validação, se houver
      });
  }
};

// Listar todas as equipes e seus jogadores
exports.listarEquipes = async (req, res) => {
  console.log("--- EXECUTANDO CONTROLLER: listarEquipes ---");
  try {
    const equipes = await Equipe.findAll({
      include: [{ model: Jogador }]
    });
    res.status(200).json(equipes);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao listar equipes: ' + error.message });
  }
};

// Buscar uma equipe por ID
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

// Atualizar uma equipe
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

// Deletar uma equipe
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
