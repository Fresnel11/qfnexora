const User = require('../models/user.model');
const bcrypt = require('../utils/bcrypt');
const { comparePassword } = require('../utils/bcrypt');
const { generateToken } = require('../utils/jwt');
const { sendOtpMail } = require('../utils/mailer');
const crypto = require('crypto');

/**
 * Génère un code OTP à 6 chiffres
 */
function generateOtpCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Génère un refresh token sécurisé
 * @returns {string}
 */
function generateRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

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

  // Génération du code OTP et expiration (10 minutes)
  const otpCode = generateOtpCode();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Préparation des données utilisateur
  const userPayload = {
    firstname,
    lastname,
    email,
    phone,
    dateOfBirth,
    userType,
    password: hashedPassword,
    otpCode,
    otpExpires,
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

  // Envoi du code OTP par email
  try {
    await sendOtpMail(user.email, otpCode);
    console.log(`✅ Email OTP envoyé avec succès à ${user.email} (code: ${otpCode})`);
  } catch (err) {
    // Log l'erreur mais ne bloque pas l'inscription
    console.error(`❌ Erreur lors de l'envoi de l'email OTP à ${user.email} :`, err);
  }

  return userObj;
}

/**
 * Connexion d'un utilisateur
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
 */
async function login(email, password) {
  // Recherche de l'utilisateur
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Vérification du verrouillage du compte
  if (user.isLocked) {
    throw new Error('Votre compte est bloqué suite à plusieurs tentatives échouées. Veuillez contacter le support pour le déverrouiller.');
  }

  // Vérification de l'email
  if (!user.emailVerified) {
    throw new Error('Veuillez valider votre adresse email avant de vous connecter.');
  }

  // Vérification du mot de passe
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= 5) {
      user.isLocked = true;
    }
    await user.save();
    if (user.isLocked) {
      throw new Error('Votre compte est bloqué suite à plusieurs tentatives échouées. Veuillez contacter le support pour le déverrouiller.');
    }
    throw new Error('Email ou mot de passe incorrect');
  }

  // Si la connexion réussit, on réinitialise les compteurs
  user.loginAttempts = 0;
  user.isLocked = false;

  // Génération du token JWT valable 15min (access token)
  const accessToken = generateToken(user._id, user.userType, { expiresIn: '15m' });

  // Génération du refresh token valable 7 jours
  const refreshToken = generateRefreshToken();
  const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  user.refreshToken = refreshToken;
  user.refreshTokenExpires = refreshTokenExpires;
  await user.save();

  // On retire le mot de passe de la réponse
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, accessToken, refreshToken };
}

/**
 * Actualisation du token d'accès via refresh token
 * @param {string} refreshToken
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
async function refreshTokenService(refreshToken) {
  if (!refreshToken) {
    throw new Error('Refresh token manquant');
  }
  const user = await User.findOne({ refreshToken });
  if (!user || !user.refreshTokenExpires || user.refreshTokenExpires < new Date()) {
    throw new Error('Refresh token invalide ou expiré');
  }
  // Générer un nouveau access token et un nouveau refresh token (rotation)
  const newAccessToken = generateToken(user._id, user.userType, { expiresIn: '15m' });
  const newRefreshToken = generateRefreshToken();
  const newRefreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  user.refreshToken = newRefreshToken;
  user.refreshTokenExpires = newRefreshTokenExpires;
  await user.save();
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

/**
 * Changement de mot de passe pour un utilisateur connecté
 * @param {Object} user - Utilisateur connecté (req.user)
 * @param {string} currentPassword - Ancien mot de passe
 * @param {string} newPassword - Nouveau mot de passe
 * @returns {Promise<string>} - Message de succès
 */
async function changePassword(user, currentPassword, newPassword) {
  // Vérifier l'ancien mot de passe
  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Ancien mot de passe incorrect');
  }
  // Hacher le nouveau mot de passe
  const hashedPassword = await bcrypt.hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
  return 'Mot de passe modifié avec succès.';
}

/**
 * Vérifie le code OTP pour l'email et active l'utilisateur
 * @param {string} email
 * @param {string} otpCode
 * @returns {Promise<Object>} - Utilisateur mis à jour (sans le mot de passe)
 */
async function verifyEmail(email, otpCode) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }
  if (user.emailVerified) {
    throw new Error("Email déjà vérifié");
  }
  if (!user.otpCode || !user.otpExpires) {
    throw new Error("Aucun code de vérification trouvé. Veuillez demander un nouveau code.");
  }
  if (user.otpCode !== otpCode) {
    throw new Error("Code de vérification incorrect");
  }
  if (user.otpExpires < new Date()) {
    throw new Error("Code de vérification expiré");
  }
  user.emailVerified = true;
  user.otpCode = null;
  user.otpExpires = null;
  await user.save();
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
}

/**
 * Demande de réinitialisation du mot de passe (envoi d'un code OTP par email)
 * @param {string} email
 * @returns {Promise<string>} - Message de succès générique
 */
async function forgotPassword(email) {
  const user = await User.findOne({ email });
  // Toujours retourner un message générique pour la sécurité
  if (!user) {
    return "Si un compte existe pour cet email, un code de réinitialisation a été envoyé.";
  }
  // Générer un code OTP et une date d'expiration (15 min)
  const resetOtp = generateOtpCode();
  const resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
  user.resetOtp = resetOtp;
  user.resetOtpExpires = resetOtpExpires;
  await user.save();
  // Envoyer le code OTP par email (même template, mais sujet différent)
  try {
    await sendOtpMail(user.email, resetOtp);
    console.log(`✅ Code OTP de réinitialisation envoyé à ${user.email} (code: ${resetOtp})`);
  } catch (err) {
    console.error(`❌ Erreur lors de l'envoi du code OTP de réinitialisation à ${user.email} :`, err);
  }
  return "Si un compte existe pour cet email, un code de réinitialisation a été envoyé.";
}

/**
 * Réinitialisation du mot de passe via code OTP
 * @param {string} email
 * @param {string} otpCode
 * @param {string} newPassword
 * @returns {Promise<string>} - Message de succès
 */
async function resetPassword(email, otpCode, newPassword) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Utilisateur introuvable");
  }
  if (!user.resetOtp || !user.resetOtpExpires) {
    throw new Error("Aucune demande de réinitialisation en cours. Veuillez refaire une demande.");
  }
  if (user.resetOtp !== otpCode) {
    throw new Error("Code de réinitialisation incorrect");
  }
  if (user.resetOtpExpires < new Date()) {
    throw new Error("Code de réinitialisation expiré");
  }
  // Hacher et mettre à jour le mot de passe
  const hashedPassword = await bcrypt.hashPassword(newPassword);
  user.password = hashedPassword;
  user.resetOtp = null;
  user.resetOtpExpires = null;
  await user.save();
  return "Mot de passe réinitialisé avec succès.";
}

/**
 * Suppression du compte utilisateur (avec confirmation du mot de passe)
 * @param {Object} user - Utilisateur connecté (req.user)
 * @param {string} password - Mot de passe à confirmer
 * @returns {Promise<string>} - Message de succès
 */
async function deleteAccount(user, password) {
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Mot de passe incorrect');
  }
  await User.deleteOne({ _id: user._id });
  return 'Compte supprimé avec succès.';
}

module.exports = {
  register,
  login,
  changePassword,
  verifyEmail,
  forgotPassword,
  resetPassword,
  deleteAccount,
  refreshTokenService,
}; 