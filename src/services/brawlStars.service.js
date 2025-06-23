const axios = require('axios');
require('dotenv').config();

// Cache para os dados dos jogadores individuais
const playerCache = new Map();
// Cache separado para a lista de Brawlers (heróis)
const brawlerCache = new Map();

const apiClient = axios.create({
  baseURL: 'https://api.brawlstars.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.BRAWL_STARS_API_KEY}`,
    'Accept': 'application/json'
  }
});

// --- FUNÇÃO EXISTENTE PARA BUSCAR UM JOGADOR ---
const buscarJogadorPorTag = async (playerTag) => {
  const tagLimpa = playerTag.replace('#', '');

  if (playerCache.has(tagLimpa)) {
    console.log(`>>> Servindo dados do JOGADOR ${tagLimpa} do cache!`);
    return playerCache.get(tagLimpa);
  }

  try {
    console.log(`<<< Buscando dados do JOGADOR ${tagLimpa} na API do Brawl Stars...`);
    const tagFinal = `%23${tagLimpa}`;
    const response = await apiClient.get(`/players/${tagFinal}`);

    playerCache.set(tagLimpa, response.data);

    setTimeout(() => {
      playerCache.delete(tagLimpa);
      console.log(`Cache para o jogador ${tagLimpa} expirou e foi removido.`);
    }, 10 * 60 * 1000); // 10 minutos

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar jogador:', error.response?.data || 'Erro desconhecido');
    throw new Error('Não foi possível buscar o jogador na API do Brawl Stars.');
  }
};

// --- NOVA FUNÇÃO PARA LISTAR TODOS OS BRAWLERS ---
const listarBrawlers = async () => {
  const cacheKey = 'allBrawlers';

  if (brawlerCache.has(cacheKey)) {
    console.log('>>> Servindo lista de BRAWLERS do cache!');
    return brawlerCache.get(cacheKey);
  }

  try {
    console.log('<<< Buscando lista de BRAWLERS na API do Brawl Stars...');
    const response = await apiClient.get('/brawlers');
    
    // A API retorna os brawlers dentro de um array 'items'
    const brawlers = response.data.items;
    
    brawlerCache.set(cacheKey, brawlers);

    // O cache para a lista de brawlers pode ser mais longo (ex: 12 horas)
    setTimeout(() => {
      brawlerCache.delete(cacheKey);
      console.log('Cache da lista de Brawlers expirou.');
    }, 12 * 60 * 60 * 1000); 

    return brawlers;
  } catch (error) {
    console.error('Erro ao buscar lista de brawlers:', error.response?.data || error.message);
    throw new Error('Não foi possível buscar a lista de Brawlers da API oficial.');
  }
};


// Exporta as duas funções para serem usadas em outras partes do sistema
module.exports = {
  buscarJogadorPorTag,
  listarBrawlers,
};