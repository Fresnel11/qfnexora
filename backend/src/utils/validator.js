const Joi = require('joi');

// Schéma pour les particuliers (user)
const userRegisterSchema = Joi.object({
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  dateOfBirth: Joi.date().iso().required(),
  userType: Joi.string().valid('individual').required(),
  password: Joi.string().min(6).required(),
});

// Schéma pour les entreprises (business)
const businessRegisterSchema = Joi.object({
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  dateOfBirth: Joi.date().iso().required(),
  userType: Joi.string().valid('company').required(),
  password: Joi.string().min(6).required(),
  companyName: Joi.string().trim().required(),
  companyWebsite: Joi.string().trim().allow(null, ''),
  companyAddress: Joi.string().trim().allow(null, ''),
  companyDescription: Joi.string().trim().allow(null, ''),
  companyLogoUrl: Joi.string().trim().allow(null, ''),
  IFU: Joi.string().trim().allow(null, ''),
});

// Schéma pour la connexion
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

const registerSchema = Joi.object({
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().trim().required(),
  dateOfBirth: Joi.date().iso().required(),
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

// Schéma pour la création d'un plan d'épargne
const savingPlanSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().allow('', null),
  targetAmount: Joi.number().min(0).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
  autoSave: Joi.boolean().default(false),
  frequency: Joi.string().valid('daily', 'weekly', 'monthly').when('autoSave', { is: true, then: Joi.required() }),
  currency: Joi.string().default('XOF'),
  IFU: Joi.string().allow('', null),
});

// Schéma pour l'ajout d'un dépôt à un plan d'épargne
const savingPlanDepositSchema = Joi.object({
  amount: Joi.number().min(1).required(),
  note: Joi.string().allow('', null),
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

module.exports = { userRegisterSchema, businessRegisterSchema, loginSchema, validate, registerSchema, savingPlanSchema, savingPlanDepositSchema };