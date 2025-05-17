const express = require('express');
const authRoutes = require('./auth.routes');

const router = express.Router();

// Monte les routes d'authentification
router.use('/auth', authRoutes);

module.exports = router;