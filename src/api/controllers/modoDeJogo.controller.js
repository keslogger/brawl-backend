const { ModoDeJogo } = require('../../models');

exports.criarModo = async (req, res) => {
  try {
    const modo = await ModoDeJogo.create(req.body);
    res.status(201).json(modo);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar modo de jogo: ' + error.message });
  }
};

exports.listarModos = async (req, res) => {
  try {
    const modos = await ModoDeJogo.findAll();
    res.status(200).json(modos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar modos de jogo.' });
  }
};

exports.deletarModo = async (req, res) => {
  try {
    const deleted = await ModoDeJogo.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Modo de jogo não encontrado.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar modo de jogo.' });
  }
};