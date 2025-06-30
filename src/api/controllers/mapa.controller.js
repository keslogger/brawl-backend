const { Mapa } = require('../../models');

exports.criarMapa = async (req, res) => {
  try {
    const mapa = await Mapa.create(req.body);
    res.status(201).json(mapa);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar mapa: ' + error.message });
  }
};

exports.listarMapas = async (req, res) => {
  try {
    const mapas = await Mapa.findAll();
    res.status(200).json(mapas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar mapas.' });
  }
};

exports.deletarMapa = async (req, res) => {
  try {
    const deleted = await Mapa.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Mapa não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar mapa.' });
  }
};