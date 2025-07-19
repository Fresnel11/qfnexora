const { z } = require('zod');
const Joi = require('joi');

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

const registerSchema = Joi.object({
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  dateOfBirth: Joi.date().iso().required(), // Correction ici
  userType: Joi.string().valid('individual', 'company').required(),
  password: Joi.string().min(6).required(),
  // Champs optionnels pour les entreprises
  companyName: Joi.string().trim().allow(null, ''),
  companyWebsite: Joi.string().trim().allow(null, ''),
  companyAddress: Joi.string().trim().allow(null, ''),
  companyDescription: Joi.string().trim().allow(null, ''),
  companyLogoUrl: Joi.string().trim().allow(null, ''),
  IFU: Joi.string().trim().allow(null, ''),
});

// Middleware de validation amélioré pour retourner le message d'erreur exact
function validate(schema) {
  return (req, res, next) => {
    if (!schema) return next();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Retourne tous les messages d'erreur Joi
      return res.status(400).json({ error: error.details.map(d => d.message).join(' | ') });
    }
    next();
  };
}

module.exports = { userRegisterSchema, businessRegisterSchema, loginSchema, validate, registerSchema };