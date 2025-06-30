// src/app.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const db = require('./models');

// --- 1. IMPORTAÇÕES DO SWAGGER ---
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// --- 2. IMPORTAÇÕES DAS ROTAS ---
const jogadorRoutes = require('./api/routes/jogadores.routes');
const equipeRoutes = require('./api/routes/equipes.routes');
const escolhaRoutes = require('./api/routes/escolha.routes');
const sessaoDraftRoutes = require('./api/routes/sessaoDraft.routes');
const authRoutes = require('./api/routes/auth.routes');
const auditRoutes = require('./api/routes/audit.routes');
const brawlerRoutes = require('./api/routes/brawler.routes.js');
const userRoutes = require ('./api/routes/user.routes.js');
const modoDeJogoRoutes = require('./api/routes/modoDeJogo.routes.js');
const mapaRoutes = require('./api/routes/mapa.routes.js'); 


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 3000;

// --- 3. CONFIGURAÇÃO CENTRAL DO SWAGGER ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Draft Brawl Stars',
      version: '1.0.0',
      description: 'Documentação da API para o sistema de draft.',
    },
    // Define os Schemas, Segurança e Tags aqui, em um único lugar
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Equipe: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string', example: 'Os Destemidos' },
            icone: { type: 'string', example: 'icone.png' },
          }
        }
      }
    },    
    // tags: [
    //   { name: 'Equipes', description: 'Operações relacionadas a equipes' }
    //   // Outras tags podem ser adicionadas aqui...
    // ],
    security: [{ bearerAuth: [] }],
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  // Diz ao Swagger para ler os comentários nos arquivos de rotas
  apis: ['./src/api/routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// --- 4. MIDDLEWARES E ROTAS DA API ---
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', jogadorRoutes);
app.use('/api', equipeRoutes);
app.use('/api', escolhaRoutes);
app.use('/api', sessaoDraftRoutes);
app.use('/api', authRoutes);
app.use('/api', auditRoutes);
app.use('/api', brawlerRoutes);
app.use('/api', userRoutes);
app.use('/api', modoDeJogoRoutes);
app.use('/api', mapaRoutes);

app.get('/', (req, res) => {
  res.send('Servidor do Draft Brawl Stars está no ar!');
});

io.on('connection', (socket) => {
  console.log('>>> Um usuário se conectou via WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('<<< Um usuário se desconectou:', socket.id);
  });
});

async function startServer() {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('Tabelas e relacionamentos sincronizados com o banco de dados.');
    
    server.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}. Acesse em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
}

// Inicia o servidor apenas se este script for executado diretamente
if (require.main === module) {
  startServer();
}

module.exports = server;
