const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const requireDirectory = require('require-directory');
require('dotenv').config();

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
        url: 'https://brawl-backend.fly.dev/api', // URL de produção com /api
        description: 'Servidor de Produção (Fly.io)',
      },
      {
        url: 'http://localhost:3000/api', // URL de desenvolvimento com /api
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
// Carrega e registra todas as rotas da pasta 'routes' automaticamente.
console.log('Registrando rotas da API...');
const routes = requireDirectory(module, './api/routes');
Object.values(routes).forEach(router => {
  app.use('/api', router);
});

// Rota raiz para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('<h1>API do Brawl Backend está no ar!</h1><p>Acesse <a href="/api-docs">/api-docs</a> para ver a documentação.</p>');
});

// --- Inicia o Servidor ---
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando e escutando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
  });
}

// Exporta o app para ser usado pelo server.js ou testes
module.exports = app;
