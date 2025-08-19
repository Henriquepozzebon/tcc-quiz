require("dotenv").config();
const connectDB = require("./utils/connectDB");

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error(
    "Erro: MONGO_URI não definido. Crie .env com MONGO_URI ou defina a variável de ambiente."
  );
  console.error(
    "Ex: Set-Content -Path .env -Value 'MONGO_URI=\"mongodb+srv://tcc-quiz:1234@tcc-quiz-cluster.6sxiydc.mongodb.net/tcc_quiz_db?retryWrites=true&w=majority\"'"
  );
  process.exit(1);
}

(function maskUri(u) {
  try {
    const masked = u.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
    console.log("Testando conexão com URI:", masked);
  } catch {}
})(uri);

(async () => {
  try {
    await connectDB(uri);
    console.log("\n✅ Teste de conexão realizado com sucesso.");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Falha ao conectar ao MongoDB Atlas.");
    if (err && err.message) console.error("Mensagem:", err.message);
    if (err && err.name) console.error("Erro (name):", err.name);
    if (err && err.code) console.error("Código:", err.code);
    if (err && err.stack) console.error("Stack:", err.stack);
    console.error("\nPossíveis causas / próximos passos:");
    console.error(
      "- Verifique Database Access no Atlas: usuário e senha estão corretos?"
    );
    console.error(
      "- Verifique Network Access: seu IP está liberado? (ou adicione 0.0.0.0/0 para dev)"
    );
    console.error(
      "- Se a senha contém caracteres especiais (ex: @), faça URL-encoding (ex: @ -> %40) na URI."
    );
    console.error(
      "- Confira o formato da URI: mongodb+srv://<user>:<password>@<host>/<dbname>?retryWrites=true&w=majority"
    );
    console.error(
      "- Rode mongosh com a mesma URI para testar (se tiver mongosh instalado)."
    );
    process.exit(1);
  }
})();
