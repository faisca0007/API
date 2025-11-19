const express = require('express');
const roteador = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obterPerfilUsuario
} = require('../controllers/userController');
const autenticacao = require('../middleware/auth');
const {
  validarRegistroUsuario,
  validarLoginUsuario
} = require('../middleware/validation');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomeUsuario
 *               - email
 *               - senha
 *             properties:
 *               nomeUsuario:
 *                 type: string
 *                 description: Nome de usuário único
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Endereço de email do usuário
 *               senha:
 *                 type: string
 *                 minLength: 6
 *                 description: Senha do usuário
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Erro de validação ou usuário já existe
 */
roteador.post('/register', validarRegistroUsuario, registrarUsuario);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
roteador.post('/login', validarLoginUsuario, loginUsuario);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obter perfil do usuário atual
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário recuperado com sucesso
 *       401:
 *         description: Não autorizado
 */
roteador.get('/profile', autenticacao, obterPerfilUsuario);

module.exports = roteador;
