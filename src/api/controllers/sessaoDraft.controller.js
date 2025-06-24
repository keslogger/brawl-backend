// src/api/controllers/sessaoDraft.controller.js
const { SessaoDraft, Escolha, Equipe } = require('../../models');
const auditService = require('../../services/audit.service');

// Cria uma nova sessão de draft
exports.criarSessao = async (req, res) => {
  try {
    const { equipeAzulId, equipeVermelhaId } = req.body;
    if (!equipeAzulId || !equipeVermelhaId) {
      return res.status(400).json({ error: 'É necessário fornecer os IDs das duas equipas.' });
    }
    if (equipeAzulId === equipeVermelhaId) {
      return res.status(400).json({ error: 'As equipas devem ser diferentes.' });
    }
    const novaSessao = await SessaoDraft.create({
      equipeAzulId,
      equipeVermelhaId,
      status: 'ban_em_andamento'
    });
    res.status(201).json(novaSessao);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar sessão de draft: ' + error.message });
  }
};

// Busca uma sessão e todas as suas escolhas de forma mais eficiente
exports.buscarSessaoPorId = async (req, res) => {
  try {
    const sessao = await SessaoDraft.findByPk(req.params.id, {
      include: [
        {
          model: Escolha,
          include: {
            model: Equipe,
            attributes: ['id', 'nome']
          }
        },
        {
          model: Equipe,
          as: 'EquipeAzul',
          attributes: ['id', 'nome']
        },
        {
          model: Equipe,
          as: 'EquipeVermelha',
          attributes: ['id', 'nome']
        }
      ],
      order: [
        [Escolha, 'createdAt', 'ASC']
      ]
    });

    if (!sessao) {
      return res.status(404).json({ error: 'Sessão de draft não encontrada' });
    }
    res.status(200).json(sessao);
  } catch (error) {
    console.error("Erro detalhado ao buscar sessão:", error);
    res.status(500).json({ error: 'Erro ao buscar sessão de draft.' });
  }
};

// --- Funções de Gestão de Estado (Implementação Completa) ---
const alterarStatusSessao = async (req, res, novoStatus, acaoLog) => {
  try {
    const { id } = req.params;
    const [updated] = await SessaoDraft.update({ status: novoStatus }, {
      where: { id: id }
    });

    if (updated) {
      const sessaoAtualizada = await SessaoDraft.findByPk(id);
      
      const userId = req.user.id;
      auditService.logAction(userId, acaoLog, { sessaoDraftId: id });
      
      req.io.emit('status_sessao_alterado', sessaoAtualizada);

      res.status(200).json(sessaoAtualizada);
    } else {
      res.status(404).json({ error: 'Sessão de draft não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: `Erro ao alterar status da sessão para ${novoStatus}` });
  }
};

exports.iniciarSessao = (req, res) => alterarStatusSessao(req, res, 'ban_em_andamento', 'INICIOU_DRAFT');
exports.finalizarSessao = (req, res) => alterarStatusSessao(req, res, 'finalizado', 'FINALIZOU_DRAFT');
exports.reiniciarSessao = (req, res) => alterarStatusSessao(req, res, 'pendente', 'REINICIOU_DRAFT');

// --- Função de Bans em Massa (Implementação Completa) ---
exports.registrarBans = async (req, res) => {
  try {
    const { sessaoDraftId } = req.params;
    const { bansEquipeAzul, bansEquipeVermelha } = req.body;

    if (!bansEquipeAzul || !bansEquipeVermelha || bansEquipeAzul.length !== 3 || bansEquipeVermelha.length !== 3) {
      return res.status(400).json({ error: 'É necessário fornecer 3 bans para cada equipa.' });
    }

    const sessao = await SessaoDraft.findByPk(sessaoDraftId);
    if (!sessao) {
      return res.status(404).json({ error: 'Sessão de draft não encontrada.' });
    }
    if (sessao.status !== 'ban_em_andamento') {
      return res.status(403).json({ error: 'A fase de bans não está ativa ou já foi concluída.' });
    }

    const bansParaCriar = [
      ...bansEquipeAzul.map(brawler => ({
        personagemEscolhido: brawler,
        tipo: 'ban',
        equipeId: sessao.equipeAzulId,
        sessaoDraftId: sessao.id,
      })),
      ...bansEquipeVermelha.map(brawler => ({
        personagemEscolhido: brawler,
        tipo: 'ban',
        equipeId: sessao.equipeVermelhaId,
        sessaoDraftId: sessao.id,
      })),
    ];

    await Escolha.bulkCreate(bansParaCriar);

    sessao.status = 'pick_em_andamento';
    await sessao.save();

    req.io.emit('status_sessao_alterado', sessao);
    req.io.emit('bans_registados', bansParaCriar);

    res.status(201).json({ message: 'Todos os 6 bans foram registados com sucesso. Fase de picks iniciada.' });

  } catch (error) {
    res.status(400).json({ error: 'Erro ao registar bans: ' + error.message });
  }
};
