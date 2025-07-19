const { register: registerService } = require('../services/auth.service');
// const { generateToken } = require('../utils/jwt'); // plus utilisé ici

// Inscription d'un utilisateur
const register = async (req, res) => {
  try {
    // Appel du service d'inscription
    const user = await registerService(req.body);

    // On ne génère plus de token ici
    res.status(201).json({ user });
  } catch (error) {
    // Gestion des erreurs personnalisées
    if (error.message === "Cet email est déjà utilisé.") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Champs obligatoires manquants." || error.message === "Type d'utilisateur invalide.") {
      return res.status(400).json({ error: error.message });
    }
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