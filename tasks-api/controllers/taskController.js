const Projeto = require('../models/Task');

// @desc    Obter todos os projetos do usuario autenticado
// @route   GET /api/projetos
// @access  Privado
const obterProjetos = async (req, res) => {
  try {
    const { status, prioridade, ordenarPor = 'criadoEm', ordem = 'desc' } = req.query;

    // Construir objeto de filtro
    const filtro = { usuario: req.usuario._id };
    if (status) filtro.status = status;
    if (prioridade) filtro.prioridade = prioridade;

    // Construir objeto de ordenação
    const ordenacao = {};
    ordenacao[ordenarPor] = ordem === 'desc' ? -1 : 1;

    const tarefas = await Projeto.find(filtro).sort(ordenacao);

    res.json({
      count: tarefas.length,
      tarefas: tarefas.map(tarefa => ({
        id: tarefa._id,
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        dataVencimento: tarefa.dataVencimento,
        criadoEm: tarefa.criadoEm,
        atualizadoEm: tarefa.atualizadoEm
      }))
    });
  } catch (erro) {
    console.error('Erro ao obter tarefas:', erro);
    res.status(500).json({ message: 'Erro do servidor ao recuperar tarefas' });
  }
};

// @desc    Obter tarefa única
// @route   GET /api/projetos/:id
// @access  Privado
const obterProjeto = async (req, res) => {
  try {
    const tarefa = await Projeto.findOne({
      _id: req.params.id,
      usuario: req.usuario._id
    });

    if (!tarefa) {
      return res.status(404).json({ message: 'Projeto não encontrada' });
    }

    res.json({
      tarefa: {
        id: tarefa._id,
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        dataVencimento: tarefa.dataVencimento,
        criadoEm: tarefa.criadoEm,
        atualizadoEm: tarefa.atualizadoEm
      }
    });
  } catch (erro) {
    console.error('Erro ao obter tarefa:', erro);
    if (erro.name === 'CastError') {
      return res.status(400).json({ message: 'ID de tarefa inválido' });
    }
    res.status(500).json({ message: 'Erro do servidor ao recuperar tarefa' });
  }
};

// @desc    Criar projeto
// @route   POST /api/projetos
// @access  Privado
const criarProjeto = async (req, res) => {
  try {
    const { titulo, descricao, status, prioridade, dataVencimento } = req.body;

    const tarefa = await Projeto.create({
      titulo,
      descricao,
      status: status || 'pendente',
      prioridade: prioridade || 'media',
      dataVencimento,
      usuario: req.usuario._id
    });

    res.status(201).json({
      message: 'Projeto criada com sucesso',
      tarefa: {
        id: tarefa._id,
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        dataVencimento: tarefa.dataVencimento,
        criadoEm: tarefa.criadoEm,
        atualizadoEm: tarefa.atualizadoEm
      }
    });
  } catch (erro) {
    console.error('Erro ao criar tarefa:', erro);
    res.status(500).json({ message: 'Erro do servidor ao criar tarefa' });
  }
};

// @desc    Atualizar projeto
// @route   PUT /api/projetos/:id
// @access  Privado
const atualizarProjeto = async (req, res) => {
  try {
    const { titulo, descricao, status, prioridade, dataVencimento } = req.body;

    const tarefa = await Projeto.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario._id },
      { titulo, descricao, status, prioridade, dataVencimento },
      { new: true, runValidators: true }
    );

    if (!tarefa) {
      return res.status(404).json({ message: 'Projeto não encontrada' });
    }

    res.json({
      message: 'Projeto atualizada com sucesso',
      tarefa: {
        id: tarefa._id,
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        status: tarefa.status,
        prioridade: tarefa.prioridade,
        dataVencimento: tarefa.dataVencimento,
        criadoEm: tarefa.criadoEm,
        atualizadoEm: tarefa.atualizadoEm
      }
    });
  } catch (erro) {
    console.error('Erro ao atualizar tarefa:', erro);
    if (erro.name === 'CastError') {
      return res.status(400).json({ message: 'ID de tarefa inválido' });
    }
    if (erro.name === 'ValidationError') {
      return res.status(400).json({ message: 'Erro de validação', errors: erro.errors });
    }
    res.status(500).json({ message: 'Erro do servidor ao atualizar tarefa' });
  }
};

// @desc    Excluir um projeto
// @route   DELETE /api/projetos/:id
// @access  Privado
const excluirProjeto = async (req, res) => {
  try {
    const tarefa = await Projeto.findOneAndDelete({
      _id: req.params.id,
      usuario: req.usuario._id
    });

    if (!tarefa) {
      return res.status(404).json({ message: 'Projeto não encontrada' });
    }

    res.json({ message: 'Projeto excluída com sucesso' });
  } catch (erro) {
    console.error('Erro ao excluir tarefa:', erro);
    if (erro.name === 'CastError') {
      return res.status(400).json({ message: 'ID de tarefa inválido' });
    }
    res.status(500).json({ message: 'Erro do servidor ao excluir tarefa' });
  }
};

module.exports = {
  obterProjetos,
  obterProjeto,
  criarProjeto,
  atualizarProjeto,
  excluirProjeto
};
