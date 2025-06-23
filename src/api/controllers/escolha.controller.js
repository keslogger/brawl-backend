// src/api/controllers/escolha.controller.js

// Importamos TODOS os modelos que vamos usar na mesma linha
const { Escolha, SessaoDraft, Equipe } = require('../../models');

// Registra uma nova escolha de draft em uma sessão específica
exports.criarEscolha = async (req, res) => {
  try {
    const { personagemEscolhido, modoDeJogo, mapa, equipeId, sessaoDraftId } = req.body;

    // Verifica se a sessão de draft existe antes de continuar
    const sessao = await SessaoDraft.findByPk(sessaoDraftId);
    if (!sessao) {
      return res.status(404).json({ error: 'Sessão de draft não encontrada' });
    }

    // Bônus: Vamos também verificar se a equipe existe
    const equipe = await Equipe.findByPk(equipeId);
    if (!equipe) {
        return res.status(404).json({ error: 'Equipe não encontrada' });
    }

    const novaEscolha = await Escolha.create({
      personagemEscolhido,
      modoDeJogo,
      mapa,
      equipeId,
      sessaoDraftId, // Associa a escolha à sessão
    });

    // ---- LÓGICA DO SOCKET.IO ----
    // Emite um evento chamado 'nova_escolha' para todos os clientes conectados,
    // enviando os dados da escolha que acabou de ser criada.
    req.io.emit('nova_escolha', novaEscolha);
    // -----------------------------

    res.status(201).json(novaEscolha);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao registrar escolha: ' + error.message });
  }
};

// Se você tiver outras funções neste arquivo (como listarEscolhas), elas viriam aqui