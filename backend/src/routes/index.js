const express = require('express');
const authRoutes = require('./auth.routes');
const savingPlanRoutes = require('./savingPlan.routes');
const transactionRoutes = require('./transaction.routes');
const budgetRoutes = require('./budget.routes');

const router = express.Router();

// Monte les routes d'authentification
router.use('/auth', authRoutes);
// Monte les routes de plans d'épargne
router.use('/saving-plans', savingPlanRoutes);
// Monte les routes de transactions
router.use('/transactions', transactionRoutes);
// Monte les routes de budgets
router.use('/budgets', budgetRoutes);

module.exports = router;