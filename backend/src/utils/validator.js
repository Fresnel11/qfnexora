const { z } = require('zod');

// Schéma de base partagé pour l'inscription
const baseSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(6, 'Le mot de passe doit avoir au moins 6 caractères'),
  name: z.string().min(1, 'Nom requis'),
  role: z.enum(['user', 'business'], { message: 'Rôle invalide' }),
  country: z.string().min(1, 'Pays requis'),
});

// Schéma pour les particuliers
const userRegisterSchema = baseSchema.extend({
  age: z.number().min(18, 'L\'âge doit être d\'au moins 18 ans'),
});

// Schéma pour les entreprises
const businessRegisterSchema = baseSchema.extend({
  companyName: z.string().min(1, 'Nom de l\'entreprise requis'),
  companyAddress: z.string().optional(),
});

// Schéma pour la connexion
const loginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

// Middleware de validation
const validate = (schema) => (req, res, next) => {
  try {
    // Si aucun schéma n'est fourni, utiliser un schéma dynamique pour l'inscription
    const selectedSchema = schema || (req.body.role === 'business' ? businessRegisterSchema : userRegisterSchema);
    selectedSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

module.exports = { userRegisterSchema, businessRegisterSchema, loginSchema, validate };