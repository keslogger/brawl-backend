// src/api/controllers/jogador.controller.js
const Jogador = require('../../models/Jogador');
const brawlStarsService = require('../../services/brawlStars.service');

// Função para criar um novo jogador
exports.criarJogador = async (req, res) => {
  try {
    const { nome, instituicaoDeEnsino } = req.body;
    const novoJogador = await Jogador.create({ nome, instituicaoDeEnsino });
    res.status(201).json(novoJogador);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar jogador: ' + error.message });
  }
};

// Função para listar todos os jogadores
exports.listarJogadores = async (req, res) => {
  try {
    const jogadores = await Jogador.findAll();
    res.status(200).json(jogadores);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao listar jogadores: ' + error.message });
  }
};

// Busca um jogador na API externa do Brawl Stars
exports.buscarJogadorNaAPI = async (req, res) => {
  try {
    const { playerTag } = req.params;
    const dadosJogador = await brawlStarsService.buscarJogadorPorTag(playerTag);
    res.status(200).json(dadosJogador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};