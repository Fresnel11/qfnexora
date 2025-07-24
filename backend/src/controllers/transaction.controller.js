const {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../services/transaction.service');

// Créer une transaction
const create = async (req, res) => {
  try {
    const transaction = await createTransaction(req.user._id, req.body);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lister toutes les transactions de l'utilisateur
const list = async (req, res) => {
  try {
    // Filtres optionnels (type, status, date...)
    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.currency) filters.currency = req.query.currency;
    // Ajout d'autres filtres si besoin
    const transactions = await getUserTransactions(req.user._id, filters);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer une transaction par son ID
const getById = async (req, res) => {
  try {
    const transaction = await getTransactionById(req.user._id, req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction non trouvée' });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier une transaction (seulement si source = manual)
const update = async (req, res) => {
  try {
    const transaction = await updateTransaction(req.user._id, req.params.id, req.body);
    if (!transaction) return res.status(404).json({ error: 'Transaction non trouvée ou non modifiable' });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une transaction (seulement si source = manual)
const remove = async (req, res) => {
  try {
    const transaction = await deleteTransaction(req.user._id, req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction non trouvée ou non supprimable' });
    res.status(200).json({ message: 'Transaction supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { create, list, getById, update, remove }; 