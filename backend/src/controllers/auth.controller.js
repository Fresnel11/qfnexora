const User = require('../models/user.model');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

// Inscription d'un utilisateur
const register = async (req, res) => {
  try {
    const { email, password, name, role, country, age, companyName, companyAddress } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hache le mot de passe
    const hashedPassword = await hashPassword(password);

    // Crée un nouvel utilisateur
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      country,
      ...(role === 'user' && { age }), // Ajoute age pour les particuliers
      ...(role === 'business' && { companyName, companyAddress }), // Ajoute companyName et companyAddress pour les entreprises
    });

    await user.save();

    // Génère un JWT
    const token = generateToken(user._id, user.role);

    // Retourne les données de l'utilisateur et le token
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
    };
    if (role === 'user') {
      userResponse.age = user.age;
    } else {
      userResponse.companyName = user.companyName;
      userResponse.companyAddress = user.companyAddress;
    }

    res.status(201).json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifie le mot de passe
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Génère un JWT
    const token = generateToken(user._id, user.role);

    // Retourne les données de l'utilisateur et le token
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      country: user.country,
    };
    if (user.role === 'user') {
      userResponse.age = user.age;
    } else {
      userResponse.companyName = user.companyName;
      userResponse.companyAddress = user.companyAddress;
    }

    res.status(200).json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { register, login };