const mongoose = require('mongoose');

const conectarBancoDados = async () => {
  try {
    const conexao = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Conectado: ${conexao.connection.host}`);
  } catch (erro) {
    console.error('Erro de conexão com o banco de dados:', erro.message);
    process.exit(1);
  }
};

module.exports = conectarBancoDados;
