const {
  register: registerService,
  login: loginService,
  verifyEmail: verifyEmailService,
  resendOtp: resendOtpService,
  logout: logoutService,
  changePassword: changePasswordService,
  forgotPassword: forgotPasswordService,
  resetPassword: resetPasswordService,
  deleteAccount: deleteAccountService,
} = require('../services/auth.service');
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
    const { user, token } = await loginService(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    if (error.message === 'Veuillez valider votre adresse email avant de vous connecter.') {
      return res.status(403).json({ error: error.message });
    }
    if (error.message === 'Votre compte est bloqué suite à plusieurs tentatives échouées. Veuillez contacter le support pour le déverrouiller.') {
      return res.status(403).json({ error: error.message });
    }
    if (error.message === 'Email ou mot de passe incorrect') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Vérification de l'email par OTP
const verifyEmail = async (req, res) => {
  try {
    const { email, otpCode } = req.body;
    const user = await verifyEmailService(email, otpCode);
    res.status(200).json({ user });
  } catch (error) {
    if (error.message === 'Utilisateur introuvable') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Email déjà vérifié') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === 'Aucun code de vérification trouvé. Veuillez demander un nouveau code.' || error.message === 'Code de vérification incorrect' || error.message === 'Code de vérification expiré') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Renvoi d'un nouveau code OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const message = await resendOtpService(email);
    res.status(200).json({ message });
  } catch (error) {
    if (error.message === 'Utilisateur introuvable') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Email déjà vérifié') {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "Erreur lors de l'envoi de l'email OTP") {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Déconnexion
const logout = async (req, res) => {
  try {
    const message = await logoutService();
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Changement de mot de passe
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Les champs currentPassword et newPassword sont requis.' });
    }
    const message = await changePasswordService(req.user, currentPassword, newPassword);
    res.status(200).json({ message });
  } catch (error) {
    console.error('Erreur dans changePassword:', error);
    if (error.message === 'Ancien mot de passe incorrect') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Demande de réinitialisation du mot de passe
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Le champ email est requis.' });
    }
    const message = await forgotPasswordService(email);
    res.status(200).json({ message });
  } catch (error) {
    console.error('Erreur dans forgotPassword:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    if (!email || !otpCode || !newPassword) {
      return res.status(400).json({ error: 'Les champs email, otpCode et newPassword sont requis.' });
    }
    const message = await resetPasswordService(email, otpCode, newPassword);
    res.status(200).json({ message });
  } catch (error) {
    console.error('Erreur dans resetPassword:', error);
    if (error.message === 'Utilisateur introuvable' || error.message === 'Aucune demande de réinitialisation en cours. Veuillez refaire une demande.' || error.message === 'Code de réinitialisation incorrect' || error.message === 'Code de réinitialisation expiré') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Suppression du compte utilisateur
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: 'Le champ password est requis.' });
    }
    const message = await deleteAccountService(req.user, password);
    res.status(200).json({ message });
  } catch (error) {
    if (error.message === 'Mot de passe incorrect') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { register, login, verifyEmail, resendOtp, logout, changePassword, forgotPassword, resetPassword, deleteAccount };