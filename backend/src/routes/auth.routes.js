const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validate, loginSchema, registerSchema } = require('../utils/validator');

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

module.exports = router;