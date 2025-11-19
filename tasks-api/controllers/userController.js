const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');

// Gerar token JWT
const gerarToken = (idUsuario) => {
  return jwt.sign({ userId: idUsuario }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registrar um novo usuário
// @route   POST /api/users/register
// @access  Público
const registrarUsuario = async (req, res) => {
  try {
    const { nomeUsuario, email, senha } = req.body;

    // Verificar se usuário já existe
    const usuarioExistente = await Usuario.findOne({
      $or: [{ email }, { nomeUsuario }]
    });

    if (usuarioExistente) {
      return res.status(400).json({
        message: usuarioExistente.email === email ? 'Email já cadastrado' : 'Nome de usuário já em uso'
      });
    }

    // Criar usuário
    const usuario = await Usuario.create({
      nomeUsuario,
      email,
      senha
    });

    // Gerar token
    const token = gerarToken(usuario._id);

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      user: {
        id: usuario._id,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email
      },
      token
    });
  } catch (erro) {
    console.error('Erro ao registrar usuário:', erro);
    res.status(500).json({ message: 'Erro do servidor durante o registro' });
  }
};

// @desc    Login do usuário
// @route   POST /api/users/login
// @access  Público
const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Encontrar usuário por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await usuario.compararSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = gerarToken(usuario._id);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: usuario._id,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email
      },
      token
    });
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    res.status(500).json({ message: 'Erro do servidor durante o login' });
  }
};

// @desc    Obter perfil do usuário atual
// @route   GET /api/users/profile
// @access  Privado
const obterPerfilUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id).select('-senha');
    res.json({
      user: {
        id: usuario._id,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email,
        criadoEm: usuario.criadoEm
      }
    });
  } catch (erro) {
    console.error('Erro ao obter perfil do usuário:', erro);
    res.status(500).json({ message: 'Erro do servidor ao recuperar perfil' });
  }
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  obterPerfilUsuario
};
