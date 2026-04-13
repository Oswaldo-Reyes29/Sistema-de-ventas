const usuarioModel = require('../models/usuarioModel');
const { validationResult } = require('express-validator');
const { generateToken } = require('../config/auth');

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  try {
    const user = await usuarioModel.verifyCredentials(email, password);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas o cuenta desactivada' });
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
  } catch (error) { next(error); }
};

module.exports = { login };