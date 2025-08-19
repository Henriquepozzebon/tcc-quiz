const mongoose = require("mongoose");

function maskUri(u) {
  try {
    return u.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
  } catch {
    return u;
  }
}

async function connectDB(uri) {
  // fallback para desenvolvimento (tcc_user / 1234)
  const fallback =
    "mongodb+srv://tcc_user:1234@tcc-quiz-cluster.6sxiydc.mongodb.net/tcc_quiz_db?retryWrites=true&w=majority";
  const MONGO_URI = uri || process.env.MONGO_URI || fallback;

  console.log("Tentando conectar usando URI:", maskUri(MONGO_URI)); // mostra usuário e host, mascara senha
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado ao MongoDB em", maskUri(MONGO_URI));
  } catch (err) {
    console.error("❌ Erro de conexão:", err);
    throw err;
  }
}

module.exports = { connectDB, mongoose };
