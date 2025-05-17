const jwt = require('jsonwebtoken');

// Génère un JWT
const generateToken = (userId, role) => {
  const payload = { userId, role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Vérifie un JWT
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };