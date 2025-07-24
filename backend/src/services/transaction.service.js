const Transaction = require('../models/transaction.model');

/**
 * Crée une nouvelle transaction pour un utilisateur
 * @param {ObjectId} userId - ID de l'utilisateur
 * @param {Object} data - Données de la transaction
 * @returns {Promise<Object>} - Transaction créée
 */
async function createTransaction(userId, data) {
  const transaction = new Transaction({ ...data, user: userId, status: 'success' });
  await transaction.save();
  return transaction;
}

/**
 * Récupère toutes les transactions d'un utilisateur (avec filtres optionnels)
 * @param {ObjectId} userId
 * @param {Object} [filters]
 * @returns {Promise<Array>} - Liste des transactions
 */
async function getUserTransactions(userId, filters = {}) {
  return Transaction.find({ user: userId, ...filters }).sort({ date: -1 });
}

/**
 * Récupère une transaction par son ID (et vérifie l'appartenance à l'utilisateur)
 * @param {ObjectId} userId
 * @param {ObjectId} transactionId
 * @returns {Promise<Object|null>}
 */
async function getTransactionById(userId, transactionId) {
  return Transaction.findOne({ _id: transactionId, user: userId });
}

/**
 * Met à jour une transaction (seulement si source = manual)
 * @param {ObjectId} userId
 * @param {ObjectId} transactionId
 * @param {Object} data
 * @returns {Promise<Object|null>}
 */
async function updateTransaction(userId, transactionId, data) {
  return Transaction.findOneAndUpdate(
    { _id: transactionId, user: userId, source: 'manual' },
    { $set: data },
    { new: true }
  );
}

/**
 * Supprime une transaction (seulement si source = manual)
 * @param {ObjectId} userId
 * @param {ObjectId} transactionId
 * @returns {Promise<Object|null>}
 */
async function deleteTransaction(userId, transactionId) {
  return Transaction.findOneAndDelete({ _id: transactionId, user: userId, source: 'manual' });
}

module.exports = {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
}; 