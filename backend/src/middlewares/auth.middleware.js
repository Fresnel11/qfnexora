const { verifyToken } = require('../utils/jwt');
const User = require('../models/user.model');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId); // On ne retire plus le password
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré' }); // Forbidden
  }
};

module.exports = { authenticateToken }; 