const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const esquemaUsuario = new mongoose.Schema({
  nomeUsuario: {
    type: String,
    required: [true, 'Nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    minlength: [3, 'Nome de usuário deve ter pelo menos 3 caracteres'],
    maxlength: [50, 'Nome de usuário não pode exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, insira um email válido']
  },
  senha: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres']
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

// Hash da senha antes de salvar
esquemaUsuario.pre('save', async function(proximo) {
  if (!this.isModified('senha')) return proximo();

  try {
    const sal = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, sal);
    proximo();
  } catch (erro) {
    proximo(erro);
  }
});

// Método para comparar senha
esquemaUsuario.methods.compararSenha = async function(senhaCandidata) {
  return await bcrypt.compare(senhaCandidata, this.senha);
};

module.exports = mongoose.model('Usuario', esquemaUsuario);
