const { body, validationResult } = require('express-validator');

// Middleware para lidar com erros de validação
const lidarComErrosValidacao = (req, res, proximo) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      message: 'Validação falhou',
      errors: erros.array()
    });
  }
  proximo();
};

// Validação de registro de usuário
const validarRegistroUsuario = [
  body('nomeUsuario')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Nome de usuário deve ter entre 3 e 50 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Nome de usuário pode conter apenas letras, números e sublinhados'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Por favor, forneça um email válido'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  lidarComErrosValidacao
];

// Validação de login de usuário
const validarLoginUsuario = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Por favor, forneça um email válido'),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  lidarComErrosValidacao
];

// Validação de criação de tarefa
const validarCriacaoProjeto = [
  body('titulo')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Título é obrigatório e deve ter menos de 100 caracteres'),
  body('descricao')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Descrição deve ter menos de 500 caracteres'),
  body('status')
    .optional()
    .isIn(['pendente', 'em-andamento', 'concluida'])
    .withMessage('Status deve ser um dos seguintes: pendente, em-andamento, concluida'),
  body('prioridade')
    .optional()
    .isIn(['baixa', 'media', 'alta'])
    .withMessage('Prioridade deve ser uma das seguintes: baixa, media, alta'),
  body('dataVencimento')
    .optional()
    .isISO8601()
    .withMessage('Data de vencimento deve ser uma data válida'),
  lidarComErrosValidacao
];

// Validação de atualização de tarefa
const validarAtualizacaoProjeto = [
  body('titulo')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Título deve ter menos de 100 caracteres'),
  body('descricao')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Descrição deve ter menos de 500 caracteres'),
  body('status')
    .optional()
    .isIn(['pendente', 'em-andamento', 'concluida'])
    .withMessage('Status deve ser um dos seguintes: pendente, em-andamento, concluida'),
  body('prioridade')
    .optional()
    .isIn(['baixa', 'media', 'alta'])
    .withMessage('Prioridade deve ser uma das seguintes: baixa, media, alta'),
  body('dataVencimento')
    .optional()
    .isISO8601()
    .withMessage('Data de vencimento deve ser uma data válida'),
  lidarComErrosValidacao
];

module.exports = {
  validarRegistroUsuario,
  validarLoginUsuario,
  validarCriacaoProjeto,
  validarAtualizacaoProjeto
};
