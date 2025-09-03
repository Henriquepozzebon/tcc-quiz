// Adicionado: exemplo de payload para testar endpoint POST /questions
// Exemplo JSON:
// {
//   "assunto": "Geografia",
//   "ano": 2021,
//   "enunciado": "Qual a capital do Brasil?",
//   "imagem": {
//     "url": "http://exemplo.com/imagem.jpg",
//     "descricao": "Imagem da bandeira do Brasil"
//   },
//   "alternativas": [
//     { "letra": "A", "texto": "São Paulo" },
//     { "letra": "B", "texto": "Brasília" },
//     { "letra": "C", "texto": "Rio de Janeiro" },
//     { "letra": "D", "texto": "Salvador" }
//   ],
//   "correta": "B",        // pode ser índice (0-based) ou letra da alternativa correta
//   "nivel": 1
// }
// Enviar para: POST http://localhost:3000/questions  (Content-Type: application/json)

const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    assunto: { type: String, required: true }, // assunto/tema principal
    ano: { type: Number, default: null },
    enunciado: { type: String, required: true },
    imagem: {
      url: { type: String, default: "" },
      descricao: { type: String, default: "" },
    },
    // alternativas como objetos { letra, texto }
    alternativas: [
      {
        letra: { type: String, required: true },
        texto: { type: String, required: true },
      },
    ],
    // correta armazena o índice (0-based) da alternativa correta
    correta: { type: Number, required: true, min: 0 },
    nivel: { type: Number, default: 1 },
    // campo extra opcional
    tema: { type: String, default: "" },
  },
  { timestamps: true }
);

// Helper: gera letras A, B, C...
function letraParaIndex(letra) {
  if (!letra || typeof letra !== "string") return null;
  const l = letra.trim().toUpperCase();
  return l.charCodeAt(0) - 65; // 'A' -> 0
}

// Normaliza alternativas e converte correta quando necessário
QuestionSchema.pre("save", function (next) {
  try {
    // Normalize alternativas: if array of strings, convert to objects
    if (Array.isArray(this.alternativas)) {
      const raw = this.alternativas;
      // if first element is string -> map strings to objects
      if (raw.length > 0 && typeof raw[0] === "string") {
        this.alternativas = raw.map((txt, idx) => ({
          letra: String.fromCharCode(65 + idx),
          texto: String(txt || "").trim(),
        }));
      } else {
        // ensure each alternativa has letra and texto; fill missing letras
        this.alternativas = raw.map((a, idx) => {
          const texto = a && (a.texto || a.text) ? String(a.texto || a.text).trim() : "";
          const letra = a && a.letra ? String(a.letra).trim().toUpperCase() : String.fromCharCode(65 + idx);
          return { letra, texto };
        });
      }
    } else {
      // if not an array, make empty array
      this.alternativas = [];
    }

    // valida mínimo de alternativas
    if (!Array.isArray(this.alternativas) || this.alternativas.length < 2) {
      return next(new Error("São necessárias pelo menos 2 alternativas"));
    }

    // Normaliza campo 'correta':
    // - se correta é string como "A" ou "B": converte para índice
    // - se correta é número, mantém (mas valida dentro do range)
    if (typeof this.correta === "string") {
      const idx = letraParaIndex(this.correta);
      this.correta = idx;
    }

    if (typeof this.correta !== "number" || isNaN(this.correta)) {
      return next(new Error("Campo 'correta' inválido"));
    }

    if (this.correta < 0 || this.correta >= this.alternativas.length) {
      return next(new Error("Índice da alternativa correta fora do intervalo"));
    }

    // garante que letras estejam consistentes (A, B, C...) - reescreve letras com base na ordem
    this.alternativas = this.alternativas.map((alt, idx) => ({
      letra: String.fromCharCode(65 + idx),
      texto: alt.texto,
    }));

    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model("Question", QuestionSchema);
