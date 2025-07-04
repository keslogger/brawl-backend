const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const requireDirectory = require('require-directory');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Em produção, restrinja para o seu domínio: 'https://seu-frontend.com'
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware para disponibilizar a instância do 'io' em cada requisição.
// Isso faz com que o `req.io` funcione nos seus controllers.
app.use((req, res, next) => {
  req.io = io;
  next();
});

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

// --- Lógica do Socket.IO ---
io.on('connection', (socket) => {
  console.log('Um usuário se conectou via WebSocket:', socket.id);

  // Sala para uma sessão de draft específica
  socket.on('entrar_sessao', (sessaoId) => {
    const roomName = `sessao_${sessaoId}`;
    socket.join(roomName);
    console.log(`Socket ${socket.id} entrou na sala ${roomName}`);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado:', socket.id);
  });
});

// Rota raiz para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.send('<h1>API do Brawl Backend está no ar!</h1><p>Acesse <a href="/api-docs">/api-docs</a> para ver a documentação.</p>');
});

// --- Inicia o Servidor ---
// Esta verificação garante que o servidor só será iniciado quando o arquivo for
// executado diretamente (node src/app.js), e não quando for importado por um teste.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Servidor rodando e escutando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
  });
}

// Exporta o app para ser usado pelo server.js ou testes
module.exports = app;
