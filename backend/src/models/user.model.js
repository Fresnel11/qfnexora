const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },

    // Pour savoir le type d'utilisateur
    userType: {
      type: String,
      enum: ['individual', 'company'],
      required: true,
    },

    // Champs optionnels spécifiques aux entreprises
    companyName: {
      type: String,
      default: null,
      trim: true,
    },
    companyWebsite: {
      type: String,
      default: null,
      trim: true,
    },
    companyAddress: {
      type: String,
      default: null,
      trim: true,
    },
    companyDescription: {
      type: String,
      default: null,
      trim: true,
    },
    companyLogoUrl: {
      type: String,
      default: null,
    },
    IFU: {
      type: String,
      default: null,
      trim: true,
    },

    // Sécurité
    password: {
      type: String,
      required: true,
    },
    // Vérification de l'email
    emailVerified: {
      type: Boolean,
      default: false,
    },
    // Champs pour la vérification OTP
    otpCode: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    // Réinitialisation du mot de passe
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
    // Sécurité avancée : tentatives de connexion et verrouillage
    loginAttempts: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
