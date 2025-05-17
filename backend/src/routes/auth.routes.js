const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validate, loginSchema } = require('../utils/validator');

const router = express.Router();

// Route pour l'inscription
router.post('/register', validate(), register);

// Route pour la connexion
router.post('/login', validate(loginSchema), login);

module.exports = router;