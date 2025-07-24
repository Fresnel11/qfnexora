const SavingPlan = require('../models/savingPlan.model');

/**
 * Crée un nouveau plan d'épargne pour un utilisateur
 * @param {ObjectId} userId - ID de l'utilisateur
 * @param {Object} data - Données du plan d'épargne
 * @returns {Promise<Object>} - Plan d'épargne créé
 */
async function createSavingPlan(userId, data) {
  const plan = new SavingPlan({ ...data, user: userId });
  await plan.save();
  return plan;
}

/**
 * Récupère tous les plans d'épargne d'un utilisateur
 * @param {ObjectId} userId
 * @returns {Promise<Array>} - Liste des plans
 */
async function getUserSavingPlans(userId) {
  return SavingPlan.find({ user: userId });
}

/**
 * Récupère un plan d'épargne par son ID (et vérifie l'appartenance à l'utilisateur)
 * @param {ObjectId} userId
 * @param {ObjectId} planId
 * @returns {Promise<Object|null>}
 */
async function getSavingPlanById(userId, planId) {
  return SavingPlan.findOne({ _id: planId, user: userId });
}

/**
 * Met à jour un plan d'épargne (seulement si in_progress)
 * @param {ObjectId} userId
 * @param {ObjectId} planId
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
async function updateSavingPlan(userId, planId, data) {
  // On ne peut modifier que les plans en cours
  return SavingPlan.findOneAndUpdate(
    { _id: planId, user: userId, status: 'in_progress' },
    { $set: data },
    { new: true }
  );
}

/**
 * Supprime un plan d'épargne (seulement si in_progress)
 * @param {ObjectId} userId
 * @param {ObjectId} planId
 * @returns {Promise<Object|null>}
 */
async function deleteSavingPlan(userId, planId) {
  return SavingPlan.findOneAndDelete({ _id: planId, user: userId, status: 'in_progress' });
}

/**
 * Ajoute un dépôt manuel à un plan d'épargne
 * @param {ObjectId} userId
 * @param {ObjectId} planId
 * @param {Object} deposit - { amount, note }
 * @returns {Promise<Object|null>} - Plan mis à jour
 */
async function addDepositToSavingPlan(userId, planId, deposit) {
  const plan = await SavingPlan.findOne({ _id: planId, user: userId, status: 'in_progress' });
  if (!plan) return null;
  // Vérifier que le montant ne dépasse pas targetAmount
  if (plan.currentAmount + deposit.amount > plan.targetAmount) {
    throw new Error('Le montant total épargné ne peut pas dépasser le montant cible.');
  }
  plan.transactions.push({ amount: deposit.amount, note: deposit.note });
  plan.currentAmount += deposit.amount;
  // Si l'objectif est atteint, on marque comme terminé
  if (plan.currentAmount >= plan.targetAmount) {
    plan.status = 'completed';
  }
  await plan.save();
  return plan;
}

module.exports = {
  createSavingPlan,
  getUserSavingPlans,
  getSavingPlanById,
  updateSavingPlan,
  deleteSavingPlan,
  addDepositToSavingPlan,
}; 