const User = require('../models/user.model');
const bcrypt = require('../utils/bcrypt');
const { comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');

/**
 * Inscription d'un nouvel utilisateur (particulier ou entreprise)
 * @param {Object} userData - Données reçues du client
 * @returns {Promise<Object>} - Utilisateur créé (sans le mot de passe)
 */
async function register(userData) {
  const {
    firstname,
    lastname,
    email,
    phone,
    dateOfBirth,
    userType,
    password,
    companyName,
    companyWebsite,
    companyAddress,
    companyDescription,
    companyLogoUrl,
    IFU,
  } = userData;

  // Vérification du type d'utilisateur
  if (!userType || !['individual', 'company'].includes(userType)) {
    throw new Error('Type d\'utilisateur invalide.');
  }

  // Validation des champs obligatoires pour tous
  if (!firstname || !lastname || !email || !phone || !dateOfBirth || !password) {
    throw new Error('Champs obligatoires manquants.');
  }

  // Vérification de l'unicité de l'email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Cet email est déjà utilisé.');
  }

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hashPassword(password);

  // Préparation des données utilisateur
  const userPayload = {
    firstname,
    lastname,
    email,
    phone,
    dateOfBirth,
    userType,
    password: hashedPassword,
  };

  // Si c'est une entreprise, ajouter les champs optionnels
  if (userType === 'company') {
    userPayload.companyName = companyName || null;
    userPayload.companyWebsite = companyWebsite || null;
    userPayload.companyAddress = companyAddress || null;
    userPayload.companyDescription = companyDescription || null;
    userPayload.companyLogoUrl = companyLogoUrl || null;
    userPayload.IFU = IFU || null;
  }

  // Création et sauvegarde
  const user = new User(userPayload);
  await user.save();

  // On retire le mot de passe de la réponse
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

/**
 * Connexion d'un utilisateur
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Object, token: string}>}
 */
async function login(email, password) {
  // Recherche de l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Vérification de l'email
  if (!user.emailVerified) {
    throw new Error('Veuillez valider votre adresse email avant de vous connecter.');
  }

  // Vérification du mot de passe
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Génération du token JWT valable 3h
  const token = generateToken(user._id, user.userType, { expiresIn: '3h' });

  // On retire le mot de passe de la réponse
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
}

module.exports = {
  register,
  login,
}; 