const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET || 'mi_clave_secreta',
    { expiresIn: '8h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta');
};

module.exports = { generateToken, verifyToken };