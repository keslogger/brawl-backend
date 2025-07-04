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

// --- FUNÇÃO EXISTENTE PARA BUSCAR UM JOGADOR (REFATORADA) ---
const buscarJogadorPorTag = async (playerTag) => {
  // Usar a tag original (com #) como chave de cache é mais seguro
  if (playerCache.has(playerTag)) {
    console.log(`>>> Servindo dados do JOGADOR ${playerTag} do cache!`);
    return playerCache.get(playerTag);
  }

  // **MELHORIA 1: Usar encodeURIComponent para segurança e clareza**
  const encodedPlayerTag = encodeURIComponent(playerTag);

  try {
    console.log(`<<< Buscando dados do JOGADOR ${playerTag} na API do Brawl Stars...`);
    const response = await apiClient.get(`/players/${encodedPlayerTag}`);

    playerCache.set(playerTag, response.data);

    setTimeout(() => {
      playerCache.delete(playerTag);
      console.log(`Cache para o jogador ${playerTag} expirou e foi removido.`);
    }, 10 * 60 * 1000); // 10 minutos

    return response.data;
  } catch (error) {
    // **MELHORIA 2: Tratamento de erro específico**
    if (error.response) {
      // A API externa respondeu com um código de erro (4xx ou 5xx).
      const { status } = error.response;
      // Criamos um novo objeto de erro com uma mensagem clara e o status code.
      const serviceError = new Error('Erro ao comunicar com a API do Brawl Stars.');
      serviceError.statusCode = status; // Anexamos o status code ao erro.

      switch (status) {
        case 403:
          serviceError.message = 'Acesso negado à API do Brawl Stars. Verifique a chave da API e as permissões de IP.';
          break;
        case 404:
          serviceError.message = 'Jogador não encontrado na API do Brawl Stars.';
          break;
        case 429:
          serviceError.message = 'Muitas requisições para a API do Brawl Stars. Tente novamente mais tarde.';
          break;
        case 500:
        case 503:
          serviceError.message = 'A API do Brawl Stars está indisponível no momento.';
          break;
      }
      // Lançamos o erro enriquecido para o controller.
      throw serviceError;
    }
    // Para outros erros (timeout, problema de rede), lançamos um erro genérico.
    throw new Error('Não foi possível buscar o jogador na API do Brawl Stars.');
  }
};

// --- NOVA FUNÇÃO PARA LISTAR TODOS OS BRAWLERS (sem alterações necessárias aqui) ---
const listarBrawlers = async () => {
  const cacheKey = 'allBrawlers';

  if (brawlerCache.has(cacheKey)) {
    console.log('>>> Servindo lista de BRAWLERS do cache!');
    return brawlerCache.get(cacheKey);
  }

  try {
    console.log('<<< Buscando lista de BRAWLERS na API do Brawl Stars...');
    const response = await apiClient.get('/brawlers');
    
    const brawlers = response.data.items;
    
    brawlerCache.set(cacheKey, brawlers);

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


module.exports = {
  buscarJogadorPorTag,
  listarBrawlers,
};
