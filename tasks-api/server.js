const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
const conectarBancoDados = require('./config/database');
conectarBancoDados();

// Inicializar aplicação Express
const app = express();

// Middleware para analisar JSON
app.use(express.json());

// Configuração do Swagger
const opcoesSwagger = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Projetos',
      version: '1.0.0',
      description: 'Uma API RESTful para gerenciar tarefas com autenticação de usuário',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Caminhos para os arquivos de rotas
};

const especificacaoSwagger = swaggerJsdoc(opcoesSwagger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(especificacaoSwagger));

// Rotas
const rotasUsuario = require('./routes/userRoutes');
const rotasProjeto = require('./routes/taskRoutes');

app.use('/api/usuarios', rotasUsuario);
app.use('/api/tarefas', rotasProjeto);

// Rota de saúde
app.get('/api/saude', (req, res) => {
  res.json({ status: 'OK', mensagem: 'API funcionando corretamente' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

// Porta do servidor
const PORTA = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
  console.log(`Documentação Swagger disponível em http://localhost:${PORTA}/api-docs`);
});

module.exports = app;
