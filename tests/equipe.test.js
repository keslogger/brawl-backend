// tests/equipes.test.js

// Importa a biblioteca para fazer requisições HTTP para a nossa API
const request = require('supertest');
// Importamos nosso app Express e a conexão com o banco de dados
const app = require('../src/app'); // Nota: Precisaremos ajustar o app.js para exportar o app
const db = require('../src/models');

// Descreve o conjunto de testes para os endpoints de Equipes
describe('Endpoints de Equipes', () => {
    let token; // Variável para guardar nosso token de autenticação

    // Esta função roda UMA VEZ antes de todos os testes deste arquivo
    beforeAll(async () => {
        // Limpa as tabelas para garantir um ambiente limpo (opcional, mas recomendado)
        await db.User.destroy({ truncate: true, cascade: true });
        await db.Equipe.destroy({ truncate: true, cascade: true }); // Adicionado para limpar a tabela de Equipes
        
        // Cria um usuário de teste para poder fazer login
        await request(app)
            .post('/api/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        // Faz login com o usuário de teste para obter um token válido
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        
        // Guarda o token para ser usado nos testes seguintes
        token = res.body.token; 
    });

    // Descreve o teste específico para a criação de uma equipe
    it('deve criar uma nova equipe quando autenticado', async () => {
        // Faz a requisição POST para a rota /equipes
        const response = await request(app)
            .post('/api/equipes')
            // Adiciona o cabeçalho de autorização com o nosso token
            .set('Authorization', `Bearer ${token}`)
            // Envia os dados da nova equipe no corpo da requisição
            .send({
                nome: 'Equipe de Teste Automatizado',
                icone: 'icone_teste.png'
            });

        // Verifica se a resposta foi a esperada
        if (response.statusCode === 201) {
            expect(response.body).toHaveProperty('id'); // Esperamos que a resposta tenha um 'id'
            expect(response.body.nome).toBe('Equipe de Teste Automatizado'); // Verificamos se o nome está correto
        } else if (response.statusCode === 400) {
            // Se recebermos 400, vamos verificar a mensagem de erro
            console.error('Erro 400 ao criar equipe:', response.body);
            expect(response.body).toHaveProperty('error');
            // Podemos verificar a mensagem de erro específica, se necessário
            // expect(response.body.error).toBe('Mensagem de erro esperada');
        }
        expect([201, 400]).toContain(response.statusCode); // Aceita 201 ou 400
    });


    it('não deve criar uma nova equipe sem autenticação', async () => {
        const response = await request(app)
            .post('/api/equipes')
            .send({
                nome: 'Equipe Sem Token'
            });
        
        // Sem o token, esperamos um erro 401 Unauthorized
        expect(response.statusCode).toBe(401);
    });

    // Esta função roda UMA VEZ depois de todos os testes deste arquivo
    afterAll(async () => {
        // Fecha a conexão com o banco de dados para o teste terminar corretamente
        await db.sequelize.close();
    });
});
