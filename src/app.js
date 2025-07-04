// c:/Users/jkesl/brawl-backend/src/app.js

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

// Importar rotas com os caminhos corretos
const jogadorRoutes = require('./api/routes/jogador.routes.js');
const userRoutes = require('./api/routes/user.routes.js');
const debugRoutes = require('./api/routes/debug.routes.js'); // Caminho corrigido

const app = express();

app.use(express.json());

// --- Configuração do Swagger ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brawl Backend API',
      version: '1.0.0',
      description: 'Documentação completa da API para o backend do Brawl Stars Draft.',
    },
    servers: [
      {
        url: 'https://brawl-backend.fly.dev', // URL de produção
        description: 'Servidor de Produção (Fly.io)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT no formato: Bearer {token}',
        },
      },
    },
  },
  // O padrão agora busca dentro de src/api/routes
  apis: [path.join(__dirname, './api/routes/*.routes.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// --- Rota da Documentação ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Rotas da API ---
app.use('/api', jogadorRoutes);
app.use('/api', userRoutes);
app.use('/api', debugRoutes); // Rota de debug registrada

// Rota raiz para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('<h1>API do Brawl Backend está no ar!</h1><p>Acesse <a href="/api-docs">/api-docs</a> para ver a documentação.</p>');
});

// Exporta o app para ser usado pelo server.js ou testes
module.exports = app;
