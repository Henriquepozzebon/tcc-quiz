const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors()); // Permite CORS para todas as origens
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API do Quiz funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
