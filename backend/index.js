const express = require("express");
const { connectDB } = require("./utils/connectDB");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());

// montar rotas
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Falha ao conectar ao DB:", err);
    process.exit(1);
  });
