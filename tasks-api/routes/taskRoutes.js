const express = require('express');
const roteador = express.Router();
const {
  obterProjetos,
  obterProjeto,
  criarProjeto,
  atualizarProjeto,
  excluirProjeto
} = require('../controllers/ProjetoController');
const autenticacao = require('../middleware/auth');
const {
  validarCriacaoProjeto,
  validarAtualizacaoProjeto
} = require('../middleware/validation');

// Todas as rotas de tarefa requerem autenticação
roteador.use(autenticacao);

/**
 * @swagger
 * /api/projetos:
 *   get:
 *     summary: Obter todos os projetos do usuario autenticado
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pendente, em-andamento, concluida]
 *       - in: query
 *         name: prioridade
 *         schema:
 *           type: string
 *           enum: [baixa, media, alta]
 *       - in: query
 *         name: ordenarPor
 *         schema:
 *           type: string
 *           default: criadoEm
 *       - in: query
 *         name: ordem
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Projetos recuperadas com sucesso
 *       401:
 *         description: Não autorizado
 */
roteador.get('/', obterProjetos);

/**
 * @swagger
 * /api/projetos/{id}:
 *   get:
 *     summary: Criar Projeto único
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projeto recuperada com sucesso
 *       404:
 *         description: Projeto não encontrada
 *       401:
 *         description: Não autorizado
 */
roteador.get('/:id', obterProjeto);

/**
 * @swagger
 * /api/projetos:
 *   post:
 *     summary: Criar projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 maxLength: 100
 *               descricao:
 *                 type: string
 *                 maxLength: 500
 *               status:
 *                 type: string
 *                 enum: [pendente, em-andamento, concluida]
 *                 default: pendente
 *               prioridade:
 *                 type: string
 *                 enum: [baixa, media, alta]
 *                 default: media
 *               dataVencimento:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Projeto criada com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 */
roteador.post('/', validarCriacaoProjeto, criarProjeto);

/**
 * @swagger
 * /api/projetos/{id}:
 *   put:
 *     summary: Atualizar projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 maxLength: 100
 *               descricao:
 *                 type: string
 *                 maxLength: 500
 *               status:
 *                 type: string
 *                 enum: [pendente, em-andamento, concluida]
 *               prioridade:
 *                 type: string
 *                 enum: [baixa, media, alta]
 *               dataVencimento:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Projeto atualizada com sucesso
 *       404:
 *         description: Projeto não encontrada
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 */
roteador.put('/:id', validarAtualizacaoProjeto, atualizarProjeto);

/**
 * @swagger
 * /api/projetos/{id}:
 *   delete:
 *     summary: Excluir um projeto
 *     tags: [Projetos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Projeto excluída com sucesso
 *       404:
 *         description: Projeto não encontrada
 *       401:
 *         description: Não autorizado
 */
roteador.delete('/:id', excluirProjeto);

module.exports = roteador;
