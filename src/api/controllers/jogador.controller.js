const { validationResult } = require('express-validator');
const { Jogador, Equipe } = require('../../models');
const brawlStarsService = require('../../services/brawlStars.service');

// Função para criar um novo jogador manualmente e associá-lo a uma equipe
exports.criarJogador = async (req, res) => {
  // Verifica se houve erros de validação definidos na rota
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Os dados já foram validados, podemos usá-los com segurança
    const { nome, instituicaoDeEnsino, equipeId } = req.body;

    // A validação na rota já garante que equipeId é um número, então não precisamos mais do parseInt.
    const equipe = await Equipe.findByPk(equipeId);

    if (!equipe) {
      return res.status(404).json({ error: `Equipe com o ID ${equipeId} não foi encontrada.` });
    }

    const novoJogador = await Jogador.create({
      nome,
      instituicaoDeEnsino,
      equipeId: equipeId, // Associa o jogador à equipe
      fonte: 'local'
    });

    res.status(201).json(novoJogador);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'Erro ao criar jogador: já existe um jogador com este nome.' });
    }
    console.error('Erro detalhado ao criar jogador:', error);
    res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
  }
};

// Função para listar todos os jogadores do nosso banco de dados
exports.listarJogadores = async (req, res) => {
  try {
    const jogadores = await Jogador.findAll();
    res.status(200).json(jogadores);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao listar jogadores: ' + error.message });
  }
};

// Busca os dados de um jogador na API do Brawl Stars, mas não o salva
exports.buscarJogadorNaAPI = async (req, res) => {
  // Verifica se houve erros de validação definidos na rota
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { playerTag } = req.params;
    const dadosJogador = await brawlStarsService.buscarJogadorPorTag(playerTag);
    res.status(200).json(dadosJogador);
  } catch (error) {
    console.error(`Erro ao buscar jogador com tag ${req.params.playerTag}:`, error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message });
  }
};

// Importa um jogador da API do Brawl Stars e salva no nosso banco de dados
exports.importarJogador = async (req, res) => {
  // Verifica se houve erros de validação definidos na rota
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { playerTag } = req.params;
    const { instituicaoDeEnsino } = req.body;

    const dadosApi = await brawlStarsService.buscarJogadorPorTag(playerTag);

    const novoJogador = await Jogador.create({
      nome: dadosApi.name,
      instituicaoDeEnsino: instituicaoDeEnsino,
      fonte: 'api_brawl_stars',
    });

    res.status(201).json(novoJogador);
  } catch (error) {
    console.error(`Erro ao importar jogador com tag ${req.params.playerTag}:`, error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: 'Erro ao importar jogador: ' + error.message });
  }
};
