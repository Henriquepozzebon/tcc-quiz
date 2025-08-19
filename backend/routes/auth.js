const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Usuário já existe." });

    const user = new User({ email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "dev_secret",
      {
        expiresIn: "1d",
      }
    );

    return res.status(201).json({ token, email: user.email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro no servidor.", error: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Credenciais inválidas." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Credenciais inválidas." });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "dev_secret",
      {
        expiresIn: "1d",
      }
    );

    return res.json({ token, email: user.email });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro no servidor.", error: err.message });
  }
});

module.exports = router;
