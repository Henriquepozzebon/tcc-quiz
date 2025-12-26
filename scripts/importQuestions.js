const mongoose = require("mongoose");
const Question = require("../backend/models/Question");
const fs = require("fs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/quizdb";

// Troque pelo caminho do seu arquivo JSON
const arquivo = "./enem-questoes.json";

async function importarQuestoes() {
  await mongoose.connect(MONGO_URI);
  const questoes = JSON.parse(fs.readFileSync(arquivo, "utf8"));
  for (const q of questoes) {
    // Normaliza alternativas para 5 opções A-E
    if (Array.isArray(q.alternativas) && q.alternativas.length === 5) {
      q.alternativas = q.alternativas.map((alt, idx) => ({
        letra: String.fromCharCode(65 + idx), // "A"-"E"
        texto: alt.texto || alt,
      }));
    }
    // Normaliza correta para índice
    if (typeof q.correta === "string") {
      q.correta = q.correta.toUpperCase().charCodeAt(0) - 65;
    }
    // Valida assunto
    if (!["matematica", "linguagens", "naturezas", "humanas"].includes(q.assunto)) {
      console.warn("Assunto inválido:", q.assunto, q.enunciado);
      continue;
    }
    // Nivel: se não existir, define como 1
    if (!q.nivel) q.nivel = 1;
    try {
      await Question.create(q);
      console.log("Importada:", q.enunciado.slice(0, 40));
    } catch (err) {
      console.error("Erro:", err.message, q.enunciado);
    }
  }
  await mongoose.disconnect();
  console.log("Importação concluída!");
}

importarQuestoes();
