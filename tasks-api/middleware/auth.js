const jwt = require('jsonwebtoken');
const Usuario = require('../models/User');

const autenticacao = async (req, res, proximo) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Nenhum token fornecido, autorização negada' });
    }

    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decodificado.userId);

    if (!usuario) {
      return res.status(401).json({ message: 'Token não é válido' });
    }

    req.usuario = usuario;
    proximo();
  } catch (erro) {
    res.status(401).json({ message: 'Token não é válido' });
  }
};

module.exports = autenticacao;
