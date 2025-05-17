const mongoose = require('mongoose');

// Schéma pour l'utilisateur
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [6, 'Le mot de passe doit avoir au moins 6 caractères'],
    },
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'business'],
      required: [true, 'Le rôle est requis'],
    },
    country: {
      type: String,
      required: [true, 'Le pays est requis'],
      trim: true,
    },
    age: {
      type: Number,
      min: [18, 'L\'âge doit être d\'au moins 18 ans'],
      required: [
        function () {
          return this.role === 'user';
        },
        'L\'âge est requis pour les particuliers',
      ],
    },
    companyName: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.role === 'business';
        },
        'Le nom de l\'entreprise est requis pour les entreprises',
      ],
    },
    companyAddress: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    language: {
      type: String,
      enum: ['en', 'fr'],
      default: 'en',
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// Crée un index unique sur l'email
userSchema.index({ email: 1 }, { unique: true });

// Exporte le modèle
module.exports = mongoose.model('User', userSchema);