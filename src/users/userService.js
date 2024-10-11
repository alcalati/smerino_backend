const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hash de la contraseña
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Comparar contraseña
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generar JWT
const generateToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verificar JWT
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
};
