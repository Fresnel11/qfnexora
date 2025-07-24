const express = require('express');
const authRoutes = require('./auth.routes');
const savingPlanRoutes = require('./savingPlan.routes');

const router = express.Router();

// Monte les routes d'authentification
router.use('/auth', authRoutes);
// Monte les routes de plans d'épargne
router.use('/saving-plans', savingPlanRoutes);

module.exports = router;