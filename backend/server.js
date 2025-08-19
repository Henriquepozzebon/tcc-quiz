const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Carrega variáveis do .env
const bcrypt = require("bcrypt");

// Mongoose e modelos
const { connectDB } = require("./utils/connectDB");
const User = require("./models/User");
const Question = require("./models/Question");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Pega URI do .env ou fallback local
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizdb";

// Conecta ao MongoDB e inicia servidor
(async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Servidor rodando em http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Falha ao conectar ao MongoDB — encerrando processo.");
    process.exit(1);
  }
})();

// Rotas
app.get("/", (req, res) => res.send("API do Quiz funcionando!"));

// Função de validação de email
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Cadastro de usuário
app.post("/register", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha)
      return res
        .status(400)
        .json({ mensagem: "Email e senha obrigatórios", sucesso: false });
    if (!emailValido(email))
      return res
        .status(400)
        .json({ mensagem: "Email inválido", sucesso: false });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(200).json({
        mensagem: "Usuário já cadastrado",
        sucesso: true,
        usuario: existing,
      });
    }

    const hash = await bcrypt.hash(senha, 10);
    const user = new User({ email, senha: hash });
    await user.save();

    res.json({ mensagem: "Cadastro realizado!", sucesso: true, usuario: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no servidor", sucesso: false });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(200).json({
        mensagem: "Entrando como convidado",
        sucesso: true,
        usuario: {
          email: "convidado@local",
          pontuacao: 0,
          acertos: 0,
          erros: 0,
          nivel: 1,
          xpAtual: 0,
          xpMax: 100,
        },
      });
    }

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res
        .status(404)
        .json({ mensagem: "Usuário não encontrado", sucesso: false });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk)
      return res
        .status(401)
        .json({ mensagem: "Senha incorreta", sucesso: false });

    res.json({ mensagem: "Login bem-sucedido", sucesso: true, usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no servidor", sucesso: false });
  }
});

// Atualizar estatísticas
app.post("/update-stats", async (req, res) => {
  try {
    const { email, pontuacao, acertos, erros, nivel, xpAtual, xpMax } =
      req.body;
    const usuario = await User.findOneAndUpdate(
      { email },
      { pontuacao, acertos, erros, nivel, xpAtual, xpMax },
      { new: true }
    );
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.json({ mensagem: "Estatísticas atualizadas", usuario });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
});

// Ranking
app.get("/ranking", async (req, res) => {
  try {
    const ranking = await User.find({})
      .select("email pontuacao nivel -_id")
      .sort({ pontuacao: -1 })
      .limit(10)
      .lean();
    res.json({ ranking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
});

// CRUD de questões
app.post("/questions", async (req, res) => {
  try {
    const { enunciado, alternativas, correta, nivel, tema } = req.body;
    const q = new Question({ enunciado, alternativas, correta, nivel, tema });
    await q.save();
    res.json({ mensagem: "Questão criada", questao: q });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao criar questão" });
  }
});

app.get("/questions", async (req, res) => {
  try {
    const { nivel, limit } = req.query;
    const filtro = {};
    if (nivel) filtro.nivel = Number(nivel);
    const qs = await Question.find(filtro)
      .limit(Number(limit) || 50)
      .lean();
    res.json({ questions: qs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao buscar questões" });
  }
});

// Captura erros não tratados
process.on("uncaughtException", (err) =>
  console.error("Uncaught Exception:", err)
);
process.on("unhandledRejection", (err) =>
  console.error("Unhandled Rejection:", err)
);
