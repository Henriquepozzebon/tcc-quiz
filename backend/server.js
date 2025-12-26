const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Carrega variáveis do .env
const bcryptjs = require("bcryptjs");
// try carregar bcrypt nativo como fallback (pode não estar disponível em todas as máquinas)
let bcryptNative = null;
try {
  bcryptNative = require("bcrypt");
} catch (e) {
  // bcrypt nativo não disponível — tudo bem, vamos usar bcryptjs
}

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
    let { email, senha } = req.body;
    if (!email || !senha)
      return res
        .status(400)
        .json({ mensagem: "Email e senha obrigatórios", sucesso: false });

    email = String(email).trim().toLowerCase();

    if (!emailValido(email))
      return res
        .status(400)
        .json({ mensagem: "Email inválido", sucesso: false });

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        mensagem: "Usuário já cadastrado",
        sucesso: false,
      });
    }

    // Criar usuário (o pre('save') do modelo fará o hash da senha)
    const user = new User({
      email,
      senha,
      pontuacao: 0,
      acertos: 0,
      erros: 0,
      nivel: 1,
      xpAtual: 0,
      xpMax: 100,
    });
    await user.save();

    // Sanitizar antes de retornar
    const out = user.toObject();
    delete out.senha;
    res.json({ mensagem: "Cadastro realizado!", sucesso: true, usuario: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no servidor", sucesso: false });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    let { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Email e senha obrigatórios",
        sucesso: false,
      });
    }

    email = String(email).trim().toLowerCase();

    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res
        .status(404)
        .json({ mensagem: "Usuário não encontrado", sucesso: false });
    }

    // Diagnóstico seguro: tamanho do candidato (não logar a senha)
    console.debug(`Login attempt: email=${email} candidateLen=${String(senha).length}`);

    // Detecta se a senha armazenada parece um hash bcrypt
    const isHashed = typeof usuario.senha === "string" && usuario.senha.startsWith("$2");
    let senhaOk = false;

    if (isHashed) {
      // Primeiro, tente a comparação padrão (bcryptjs via método do modelo)
      senhaOk = await usuario.compareSenha(senha);
      console.debug(`Login: usuário=${email} stored=hash compare(bcryptjs)=${senhaOk}`);

      // Se falhar e bcrypt nativo estiver disponível, tente comparar com ele (fallback)
      if (!senhaOk && bcryptNative) {
        try {
          senhaOk = await bcryptNative.compare(senha, usuario.senha);
          console.debug(`Login: usuário=${email} stored=hash compare(bcrypt native)=${senhaOk}`);
        } catch (err) {
          console.debug("Erro ao comparar com bcrypt nativo:", err && err.message);
        }
      }
    } else {
      // senha em texto plano no banco (dados antigos): comparar diretamente e migre para hash
      console.debug(`Login: usuário=${email} stored=plain`);
      if (senha === usuario.senha) {
        usuario.senha = senha; // pre-save fará o hash
        await usuario.save();
        senhaOk = true;
        console.debug(`Login: usuário=${email} migrado para hash`);
      } else {
        senhaOk = false;
      }
    }

    if (!senhaOk) {
      return res
        .status(401)
        .json({ mensagem: "Senha incorreta", sucesso: false });
    }

    // Sanitizar antes de retornar
    const out = usuario.toObject();
    delete out.senha;
    res.json({ mensagem: "Login bem-sucedido", sucesso: true, usuario: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no servidor", sucesso: false });
  }
});

// Atualizar estatísticas
app.post("/update-stats", async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const usuario = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        pontuacao: req.body.pontuacao,
        acertos: req.body.acertos,
        erros: req.body.erros,
        nivel: req.body.nivel,
        xpAtual: req.body.xpAtual,
        xpMax: req.body.xpMax,
      },
      { new: true }
    );
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    const out = usuario.toObject();
    delete out.senha;
    res.json({ mensagem: "Estatísticas atualizadas", usuario: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro no servidor" });
  }
});

// Atualizar perfil (nome e cor do avatar)
app.post("/update-profile", async (req, res) => {
  try {
    const { email, nome, avatarColor } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const usuario = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { nome, avatarColor },
      { new: true }
    );
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    const out = usuario.toObject();
    delete out.senha;
    res.json({ mensagem: "Perfil atualizado", usuario: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao atualizar perfil" });
  }
});

// Ranking
app.get("/ranking", async (req, res) => {
  try {
    const ranking = await User.find({})
      .select("email nome pontuacao nivel -_id")
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

// ROTA PARA POPULAR QUESTÕES DE EXEMPLO NO MONGO
app.post("/populate-questions", async (req, res) => {
  // Array de questões de exemplo
  const questoesExemplo = [
    {
      assunto: "matematica",
      ano: 2025,
      enunciado: "Qual é o resultado de 2 + 2?",
      alternativas: [
        { letra: "A", texto: "3" },
        { letra: "B", texto: "4" },
        { letra: "C", texto: "5" },
        { letra: "D", texto: "6" },
        { letra: "E", texto: "2" }
      ],
      correta: "B",
      nivel: 1,
      tema: "",
    },
    {
      assunto: "matematica",
      ano: 2025,
      enunciado: "Quanto é 5 x 6?",
      alternativas: [
        { letra: "A", texto: "30" },
        { letra: "B", texto: "35" },
        { letra: "C", texto: "25" },
        { letra: "D", texto: "11" },
        { letra: "E", texto: "56" }
      ],
      correta: "A",
      nivel: 1,
      tema: "",
    },
    {
      assunto: "matematica",
      ano: 2025,
      enunciado: "Qual é a raiz quadrada de 81?",
      alternativas: [
        { letra: "A", texto: "7" },
        { letra: "B", texto: "8" },
        { letra: "C", texto: "9" },
        { letra: "D", texto: "10" },
        { letra: "E", texto: "6" }
      ],
      correta: "C",
      nivel: 1,
      tema: "",
    },
    {
      assunto: "matematica",
      ano: 2025,
      enunciado: "Se x = 3, quanto vale 2x + 4?",
      alternativas: [
        { letra: "A", texto: "10" },
        { letra: "B", texto: "9" },
        { letra: "C", texto: "8" },
        { letra: "D", texto: "7" },
        { letra: "E", texto: "6" }
      ],
      correta: "A",
      nivel: 1,
      tema: "",
    },
    {
      assunto: "matematica",
      ano: 2025,
      enunciado: "Qual é o valor de 12 ÷ 4?",
      alternativas: [
        { letra: "A", texto: "2" },
        { letra: "B", texto: "3" },
        { letra: "C", texto: "4" },
        { letra: "D", texto: "6" },
        { letra: "E", texto: "8" }
      ],
      correta: "B",
      nivel: 1,
      tema: "",
    }
  ];

  try {
    // Remove questões antigas (opcional)
    await Question.deleteMany({ ano: 2025, assunto: "matematica" });
    // Insere as novas
    for (const q of questoesExemplo) {
      // Converte correta para índice
      if (typeof q.correta === "string") {
        q.correta = q.correta.toUpperCase().charCodeAt(0) - 65;
      }
      await Question.create(q);
    }
    res.json({ mensagem: "Questões de exemplo inseridas!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao popular questões" });
  }
});

// Migrar senhas para o formato hash (temporário)
// ATENÇÃO: USE APENAS SE AS SENHAS ESTIVEREM EM TEXTO PLANO NO BANCO
app.post("/migrate-passwords", async (req, res) => {
  try {
    const usuarios = await User.find({});
    for (const usuario of usuarios) {
      if (!(typeof usuario.senha === "string" && usuario.senha.startsWith("$2"))) {
        const hash = await bcryptjs.hash(usuario.senha, 10);
        usuario.senha = hash;
        await usuario.save();
      }
    }
    res.json({ mensagem: "Senhas migradas com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: "Erro ao migrar senhas" });
  }
});

// ROTA TEMPORÁRIA: Resetar senha (DESENVOLVIMENTO apenas)
// POST /reset-password { email, newSenha }
// Força atualização do campo senha (pre-save fará o hash).
app.post("/reset-password", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ mensagem: "Endpoint desabilitado em produção" });
    }
    let { email, newSenha } = req.body;
    if (!email || !newSenha) {
      return res.status(400).json({ mensagem: "email e newSenha obrigatórios" });
    }
    email = String(email).trim().toLowerCase();
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });

    console.debug(`Reset password (dev): usuario=${email} newSenhaLen=${String(newSenha).length}`);
    usuario.senha = newSenha; // pre-save fará o hash
    await usuario.save();

    const out = usuario.toObject();
    delete out.senha;
    res.json({ mensagem: "Senha resetada com sucesso", usuario: out });
  } catch (err) {
    console.error("Erro /reset-password:", err);
    res.status(500).json({ mensagem: "Erro ao resetar senha" });
  }
});

// Rota de debug para diagnosticar problemas de login (APENAS em development)
// Corpo: { email: "...", senha: "opcional_para_testar_compare" }
// Retorna: { exists, isHashed, hashLength, compareResult (se senha enviada) }
app.post("/debug-user", async (req, res) => {
  try {
    if (process.env.NODE_ENV === "production") {
      return res.status(403).json({ mensagem: "Rota de debug desabilitada em produção" });
    }

    let { email, senha } = req.body;
    if (!email) return res.status(400).json({ mensagem: "email obrigatório" });
    email = String(email).trim().toLowerCase();

    const usuario = await User.findOne({ email }).lean();
    if (!usuario) {
      console.debug(`DEBUG: usuário não encontrado: ${email}`);
      return res.json({ exists: false });
    }

    const senhaField = usuario.senha || "";
    const isHashed = typeof senhaField === "string" && senhaField.startsWith("$2");
    const hashLength = typeof senhaField === "string" ? senhaField.length : 0;

    let compareResult = null;
    if (senha) {
      // buscar documento completo para usar método compareSenha
      const fullUser = await User.findOne({ email });
      if (fullUser) {
        compareResult = await fullUser.compareSenha(senha);
      } else {
        compareResult = false;
      }
    }

    console.debug(`DEBUG: usuário=${email} exists=true isHashed=${isHashed} hashLen=${hashLength} compare=${compareResult}`);
    return res.json({
      exists: true,
      isHashed,
      hashLength,
      compareResult,
    });
  } catch (err) {
    console.error("Erro /debug-user:", err);
    return res.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

process.on("unhandledRejection", (err) => console.error("Unhandled Rejection:", err));
process.on("uncaughtException", (err) => console.error("Uncaught Exception:", err));