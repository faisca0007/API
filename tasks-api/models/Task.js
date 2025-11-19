const mongoose = require('mongoose');

const esquemaProjeto = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título da tarefa é obrigatório'],
    trim: true,
    maxlength: [100, 'Título não pode exceder 100 caracteres']
  },
  descricao: {
    type: String,
    trim: true,
    maxlength: [500, 'Descrição não pode exceder 500 caracteres']
  },
  status: {
    type: String,
    enum: ['pendente', 'em-andamento', 'concluida'],
    default: 'pendente'
  },
  prioridade: {
    type: String,
    enum: ['baixa', 'media', 'alta'],
    default: 'media'
  },
  dataVencimento: {
    type: Date,
    validate: {
      validator: function(valor) {
        return valor > new Date();
      },
      message: 'Data de vencimento deve estar no futuro'
    }
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  atualizadoEm: {
    type: Date,
    default: Date.now
  }
});

// Atualizar o campo atualizadoEm antes de salvar
esquemaProjeto.pre('save', function(proximo) {
  this.atualizadoEm = Date.now();
  proximo();
});

module.exports = mongoose.model('Projeto', esquemaProjeto);
