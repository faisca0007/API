const Projeto = require('../models/Projeto');

/**
 * @desc    Obter todos os projetos do usuário autenticado
 * @route   GET /api/projetos
 * @access  Privado
 */
const obterProjetos = async (req, res) => {
  try {
    const { status, prioridade, ordenarPor = 'criadoEm', ordem = 'desc' } = req.query;

    // Construir o filtro
    const filtro = { usuario: req.usuario._id };
    if (status) filtro.status = status;
    if (prioridade) filtro.prioridade = prioridade;

    // Construir objeto de ordenação
    const ordenacao = {};
    ordenacao[ordenarPor] = ordem === 'desc' ? -1 : 1;

    const projetos = await Projeto.find(filtro).sort(ordenacao);

    res.json({
      count: projetos.length,
      projetos: projetos.map(projeto => ({
        id: projeto._id,
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        status: projeto.status,
        prioridade: projeto.prioridade,
        dataVencimento: projeto.dataVencimento,
        criadoEm: projeto.criadoEm,
        atualizadoEm: projeto.atualizadoEm
      }))
    });
  } catch (erro) {
    console.error('Erro ao obter projetos:', erro);
    res.status(500).json({ message: 'Erro do servidor ao recuperar projetos' });
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

/**
 * @desc    Criar projeto
 * @route   POST /api/projetos
 * @access  Privado
 */
const criarProjeto = async (req, res) => {
  try {
    const { titulo, descricao, status, prioridade, dataVencimento } = req.body;

    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ message: 'O campo título é obrigatório' });
    }

    // Validar dataVencimento, caso fornecida
    let dataV = null;
    if (dataVencimento) {
      dataV = new Date(dataVencimento);
      if (isNaN(dataV.getTime())) {
        return res.status(400).json({ message: 'Data de vencimento inválida' });
      }
      if (dataV <= new Date()) {
        return res.status(400).json({ message: 'Data de vencimento deve ser uma data futura' });
      }
    }

    const projetoDados = {
      titulo: titulo.trim(),
      descricao: descricao ? descricao.trim() : '',
      status: status || 'pendente',
      prioridade: prioridade || 'media',
      usuario: req.usuario._id
    };

    if (dataV) {
      projetoDados.dataVencimento = dataV;
    }

    const projeto = await Projeto.create(projetoDados);

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      projeto: {
        id: projeto._id,
        titulo: projeto.titulo,
        descricao: projeto.descricao,
        status: projeto.status,
        prioridade: projeto.prioridade,
        dataVencimento: projeto.dataVencimento,
        criadoEm: projeto.criadoEm,
        atualizadoEm: projeto.atualizadoEm
      }
    });
  } catch (erro) {
    console.error('Erro ao criar projeto:', erro);
    res.status(500).json({ message: 'Erro do servidor ao criar projeto' });
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
