// src/api/controllers/escolha.controller.js

const { Escolha, SessaoDraft } = require('../../models');

exports.criarEscolha = async (req, res) => {
  try {
    // Agora o corpo só precisa do personagem e da sessão. O tipo será sempre 'pick'.
    const { personagemEscolhido, equipeId, sessaoDraftId } = req.body;

    const sessao = await SessaoDraft.findByPk(sessaoDraftId, {
      // O include agora busca apenas as escolhas do tipo 'pick' para contar os turnos
      include: [{ model: Escolha, where: { tipo: 'pick' }, required: false }]
    });

    if (!sessao) {
      return res.status(404).json({ error: 'Sessão de draft não encontrada' });
    }
    
    // Validação da fase de picks
    if (sessao.status !== 'pick_em_andamento') {
      return res.status(403).json({ error: 'Ação não permitida. A fase de picks não está ativa.' });
    }

    const picks = sessao.Escolhas;
    if (picks.length >= 6) {
      return res.status(403).json({ error: 'Fase de picks já concluída.' });
    }

    // Lógica de Turnos (A, B, B, A, A, B)
    const ordemDePicks = [
      sessao.equipeAzulId, sessao.equipeVermelhaId, sessao.equipeVermelhaId,
      sessao.equipeAzulId, sessao.equipeAzulId, sessao.equipeVermelhaId
    ];
    const idEquipaDaVez = ordemDePicks[picks.length];

    if (equipeId !== idEquipaDaVez) {
      return res.status(403).json({ error: `Ação não permitida. É a vez da equipa com ID ${idEquipaDaVez}.` });
    }

    // Cria a escolha do tipo 'pick'
    const novaEscolha = await Escolha.create({
      personagemEscolhido,
      tipo: 'pick', // O tipo é sempre 'pick'
      equipeId,
      sessaoDraftId,
    });

    // Se for o último pick, finaliza o draft
    if ((picks.length + 1) === 6) {
      sessao.status = 'finalizado';
      await sessao.save();
      req.io.emit('status_sessao_alterado', sessao);
    }

    req.io.emit('nova_escolha', novaEscolha);
    res.status(201).json(novaEscolha);

  } catch (error) {
    res.status(400).json({ error: 'Erro ao registar pick: ' + error.message });
  }
};
