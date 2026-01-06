const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: { type: String, required: true }, // Corrigido: era 'password'
    pontuacao: { type: Number, default: 0 },
    acertos: { type: Number, default: 0 },
    erros: { type: Number, default: 0 },
    nivel: { type: Number, default: 1 },
    xpAtual: { type: Number, default: 0 },
    xpMax: { type: Number, default: 100 },
    nome: { type: String, default: "Jogador" },
    avatarColor: { type: String, default: "#a3a3ff" },
    statsPorArea: { type: Object, default: {} },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

UserSchema.methods.compareSenha = function (candidateSenha) {
  return bcrypt.compare(candidateSenha, this.senha);
};

module.exports = mongoose.model("User", UserSchema);
