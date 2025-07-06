const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const requireDirectory = require('require-directory');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(helmet());

const server = http.createServer(app);

// --- Configuração Centralizada de CORS ---
// Lista de domínios autorizados a acessar a API
const allowedOrigins = [
  'https://lighthearted-bavarois-27af8b.netlify.app',
  'http://localhost:3000' // Adicione a porta que seu frontend usa localmente
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permite requisições sem origin (ex: Postman, Insomnia, apps mobile)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'A política de CORS para este site não permite acesso a partir da origem especificada.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// --- Middlewares Globais ---
// 1. Aplica as regras de CORS a todas as rotas da API.
app.use(cors(corsOptions));
// 2. Garante que as requisições pre-flight (OPTIONS) sejam respondidas corretamente.
app.options('*', cors(corsOptions));

// --- Configuração do Socket.IO ---
const io = new Server(server, {
  cors: corsOptions // Reutiliza as mesmas opções de CORS para o Socket.IO
});

// 3. Disponibiliza a instância do 'io' em cada requisição HTTP.
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
        url: 'https://brawl-backend.fly.dev/api',
        description: 'Servidor de Produção (Fly.io)',
      },
      {
        url: 'http://localhost:3000/api',
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
  apis: [path.join(__dirname, './api/routes/*.routes.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// --- Rota da Documentação ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Rotas da API ---
console.log('Registrando rotas da API...');
const routes = requireDirectory(module, './api/routes');
Object.values(routes).forEach(router => {
  app.use('/api', router);
});

// --- Lógica do Socket.IO ---
io.on('connection', (socket) => {
  console.log('Um usuário se conectou via WebSocket:', socket.id);

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

// Middleware de tratamento de erros (deve ser o último middleware)
app.use((err, req, res, next) => {
  console.error('ERRO NÃO TRATADO:', err.stack);
  res.status(500).send({ error: 'Algo deu errado no servidor!' });
});

// --- Inicia o Servidor ---
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Servidor rodando e escutando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
