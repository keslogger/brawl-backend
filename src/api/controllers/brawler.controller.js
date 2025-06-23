const brawlStarsService = require('../../services/brawlStars.service');

// Controller para buscar e retornar a lista de todos os Brawlers
exports.listarTodos = async (req, res) => {
  try {
    const brawlers = await brawlStarsService.listarBrawlers();
    res.status(200).json(brawlers);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar a lista de Brawlers.' });
  }
};