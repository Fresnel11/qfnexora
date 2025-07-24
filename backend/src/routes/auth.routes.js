const express = require('express');
const {
  register,
  login,
  verifyEmail,
  resendOtp,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
  refreshToken,
} = require('../controllers/auth.controller');
const { validate, loginSchema, registerSchema } = require('../utils/validator');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               userType:
 *                 type: string
 *                 enum: [individual, company]
 *               password:
 *                 type: string
 *                 minLength: 6
 *               companyName:
 *                 type: string
 *               companyWebsite:
 *                 type: string
 *               companyAddress:
 *                 type: string
 *               companyDescription:
 *                 type: string
 *               companyLogoUrl:
 *                 type: string
 *               IFU:
 *                 type: string
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - phone
 *               - dateOfBirth
 *               - userType
 *               - password
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 token:
 *                   type: string
 *       400:
 *         description: Données invalides
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Vérification de l'email par code OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otpCode:
 *                 type: string
 *             required:
 *               - email
 *               - otpCode
 *     responses:
 *       200:
 *         description: Email vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       400:
 *         description: Code incorrect, expiré ou email déjà vérifié
 *       404:
 *         description: Utilisateur introuvable
 */
router.post('/verify-email', verifyEmail);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Renvoyer un nouveau code OTP à l'utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Nouveau code OTP envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Email déjà vérifié
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur lors de l'envoi de l'email OTP
 */
router.post('/resend-otp', resendOtp);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Non autorisé (token manquant)
 *       403:
 *         description: Interdit (token invalide)
 */
router.post('/logout', authenticateToken, logout);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Changer le mot de passe de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Ancien mot de passe incorrect ou champs manquants
 *       401:
 *         description: Non autorisé (token manquant)
 *       403:
 *         description: Interdit (token invalide)
 */
router.post('/change-password', authenticateToken, changePassword);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe (envoi d'un code OTP par email)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Si un compte existe, un code de réinitialisation a été envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Email manquant
 *       500:
 *         description: Erreur serveur
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe via un code OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otpCode:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - email
 *               - otpCode
 *               - newPassword
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Erreur de validation ou code incorrect/expiré
 *       500:
 *         description: Erreur serveur
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /auth/delete-account:
 *   delete:
 *     summary: Supprimer le compte utilisateur (confirmation du mot de passe requise)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Mot de passe incorrect ou manquant
 *       401:
 *         description: Non autorisé (token manquant)
 *       403:
 *         description: Interdit (token invalide)
 *       500:
 *         description: Erreur serveur
 */
router.delete('/delete-account', authenticateToken, deleteAccount);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Actualiser le token d'accès via un refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Nouveaux tokens générés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Refresh token manquant
 *       401:
 *         description: Refresh token invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */
router.post('/refresh-token', refreshToken);

module.exports = router;