API para Sistema de Draft - Torneio Brawl Stars

API de back-end completa e profissional para um sistema de gestão de torneios de Brawl Stars, desenvolvida com Node.js, Express e PostgreSQL. Este projeto demonstra uma arquitetura robusta, segura e escalável, pronta para produção.
Funcionalidades Principais

    Gestão Completa: Endpoints RESTful para gerir Jogadores, Equipes, Usuários, Modos de Jogo e Mapas.

    Integração com API Externa: Conexão com a API oficial do Brawl Stars para buscar dados de jogadores e a lista completa de Brawlers, otimizada com um sistema de cache.

    Lógica de Draft Avançada: Implementação de regras de torneio, com uma fase de bans em massa e uma sequência de picks por turnos (A, B, B, A, A, B).

    Comunicação em Tempo Real: Suporte a WebSockets com Socket.io para atualizações instantâneas da interface durante o draft.

    Segurança e Autorização: Autenticação baseada em JWT e um sistema de autorização com dois níveis de acesso (Super Admin e Admin). Senhas criptografadas com bcrypt.

    Auditoria de Ações: Sistema de logs que regista todas as ações sensíveis realizadas por utilizadores autenticados.

    Documentação Interativa: Geração automática de documentação da API com Swagger/OpenAPI, facilitando a integração com o front-end.

    Testes Automatizados: Suíte de testes com Jest e Supertest para garantir a qualidade e a estabilidade do código.

Tech Stack

    Runtime: Node.js

    Framework: Express.js

    Banco de Dados: PostgreSQL

    ORM: Sequelize

    WebSockets: Socket.io

    Segurança: JSON Web Token (JWT), Bcrypt.js

    Documentação: Swagger (OpenAPI 3.0)

    Testes: Jest & Supertest

    Containerização: Docker

Como Executar Localmente
Pré-requisitos

    Node.js (v18 ou superior)

    Docker e Docker Compose

Passos

    Clone o repositório:

    git clone https://github.com/keslogger/brawl-backend.git
    cd brawl-backend

    Instale as dependências:

    npm install

    Configure as variáveis de ambiente:

        Crie uma cópia do ficheiro .env.example e renomeie-a para .env.

        Preencha todas as variáveis necessárias no seu novo ficheiro .env.

    Crie a configuração do Docker:

        Crie um ficheiro chamado docker-compose.yml na raiz do projeto com o seguinte conteúdo:

    version: '3.8'
    services:
      postgres:
        image: postgres:13
        container_name: brawl_db
        restart: always
        ports:
          - "5432:5432"
        environment:
          - POSTGRES_USER=postgres
          - POSTGRES_PASSWORD=docker
          - POSTGRES_DB=brawl_draft_db
        volumes:
          - pgdata:/var/lib/postgresql/data
    volumes:
      pgdata:

    Inicie o banco de dados com Docker:

    docker-compose up -d

    Inicie o servidor:

    npm run dev

O servidor estará a rodar em http://localhost:3000.
Documentação da API

A documentação completa e interativa da API, gerada pelo Swagger, está disponível na rota /api-docs quando o servidor está em execução.

URL: http://localhost:3000/api-docs

Nesta página, é possível visualizar todos os endpoints, os seus parâmetros, corpos de requisição, respostas e até mesmo testá-los em tempo real.
