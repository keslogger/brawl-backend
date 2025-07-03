const { Jogador, Equipe } = require('../../models');
const brawlStarsService = require('../../services/brawlStars.service');

// Função para criar um novo jogador manualmente e associá-lo a uma equipe
exports.criarJogador = async (req, res) => {
  try {
    const { nome, instituicaoDeEnsino, equipeId } = req.body;

    // 1. Validação dos dados de entrada
    if (!nome || !equipeId) {
      return res.status(400).json({ error: 'Nome do jogador e ID da equipe são obrigatórios.' });
    }

    // 2. CORREÇÃO: Converte o ID para um número e valida
    const idNumericoEquipe = parseInt(equipeId, 10);
    if (isNaN(idNumericoEquipe)) {
      return res.status(400).json({ error: 'O ID da equipe deve ser um número válido.' });
    }

    // 3. Procura a equipe no banco de dados
    const equipe = await Equipe.findByPk(idNumericoEquipe);

    if (!equipe) {
      return res.status(404).json({ error: `Equipe com o ID ${idNumericoEquipe} não foi encontrada.` });
    }

    // 4. Cria o jogador, associando-o à equipe
    const novoJogador = await Jogador.create({
      nome,
      instituicaoDeEnsino,
      equipeId: idNumericoEquipe, // Associa o jogador à equipe
      fonte: 'local'
    });

    res.status(201).json(novoJogador);
  } catch (error) {
    // Tratamento de erro mais robusto
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
  try {
    const { playerTag } = req.params;
    const dadosJogador = await brawlStarsService.buscarJogadorPorTag(playerTag);
    res.status(200).json(dadosJogador);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- NOVA FUNÇÃO ---
// Importa um jogador da API do Brawl Stars e salva no nosso banco de dados
exports.importarJogador = async (req, res) => {
  try {
    const { playerTag } = req.params;
    const { instituicaoDeEnsino } = req.body;

    if (!instituicaoDeEnsino) {
      return res.status(400).json({ error: 'O nome da instituição de ensino é obrigatório.' });
    }

    // 1. Busca os dados na API externa usando nosso serviço
    const dadosApi = await brawlStarsService.buscarJogadorPorTag(playerTag);

    // 2. Cria o jogador no nosso banco de dados com os dados importados
    const novoJogador = await Jogador.create({
      nome: dadosApi.name, // O nome vem da API
      instituicaoDeEnsino: instituicaoDeEnsino, // A instituição vem do nosso formulário
      fonte: 'api_brawl_stars', // Marcamos a fonte como externa
    });

    res.status(201).json(novoJogador);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao importar jogador: ' + error.message });
  }
};
