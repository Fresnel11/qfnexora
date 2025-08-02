const Budget = require('../models/budget.model');

/**
 * Crée un nouveau budget pour un utilisateur
 * @param {ObjectId} userId - ID de l'utilisateur
 * @param {Object} data - Données du budget
 * @returns {Promise<Object>} - Budget créé
 */
async function createBudget(userId, data) {
  // Vérifier s'il existe déjà un budget actif pour la même période
  const existingBudget = await Budget.findOne({
    user: userId,
    period: data.period,
    status: 'active'
  });

  if (existingBudget) {
    throw new Error(`Vous avez déjà un budget actif pour la période ${data.period}. Veuillez désactiver ou supprimer le budget existant avant d'en créer un nouveau.`);
  }

  const budget = new Budget({ ...data, user: userId });
  await budget.save();
  return budget;
}

/**
 * Récupère tous les budgets d'un utilisateur
 * @param {ObjectId} userId
 * @returns {Promise<Array>} - Liste des budgets
 */
async function getUserBudgets(userId) {
  return Budget.find({ user: userId });
}

/**
 * Récupère un budget par son ID (et vérifie l'appartenance à l'utilisateur)
 * @param {ObjectId} userId
 * @param {ObjectId} budgetId
 * @returns {Promise<Object|null>}
 */
async function getBudgetById(userId, budgetId) {
  return Budget.findOne({ _id: budgetId, user: userId });
}

/**
 * Met à jour un budget
 * @param {ObjectId} userId
 * @param {ObjectId} budgetId
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
async function updateBudget(userId, budgetId, data) {
  return Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    { $set: data },
    { new: true }
  );
}

/**
 * Supprime un budget
 * @param {ObjectId} userId
 * @param {ObjectId} budgetId
 * @returns {Promise<Object|null>}
 */
async function deleteBudget(userId, budgetId) {
  return Budget.findOneAndDelete({ _id: budgetId, user: userId });
}

/**
 * Désactive un budget (change le status de 'active' à 'inactive')
 * @param {ObjectId} userId
 * @param {ObjectId} budgetId
 * @returns {Promise<Object|null>}
 */
async function deactivateBudget(userId, budgetId) {
  return Budget.findOneAndUpdate(
    { _id: budgetId, user: userId },
    { $set: { status: 'inactive' } },
    { new: true }
  );
}

module.exports = {
  createBudget,
  getUserBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  deactivateBudget,
}; 