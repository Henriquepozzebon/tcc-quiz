// Adicionado: exemplo de payload para testar endpoint POST /questions
// Exemplo JSON:
// {
//   "enunciado": "Qual a capital do Brasil?",
//   "alternativas": ["São Paulo","Brasília","Rio de Janeiro","Salvador"],
//   "correta": 1,            // índice (0-based) da alternativa correta
//   "nivel": 1,
//   "tema": "Geografia"
// }
// Enviar para: POST http://localhost:3000/questions  (Content-Type: application/json)

const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    enunciado: { type: String, required: true },
    alternativas: [{ type: String, required: true }],
    correta: { type: Number, required: true }, // índice
    nivel: { type: Number, default: 1 },
    tema: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
