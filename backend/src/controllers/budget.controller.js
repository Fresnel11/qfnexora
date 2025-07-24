const {
  createBudget,
  getUserBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} = require('../services/budget.service');

// Créer un budget
const create = async (req, res) => {
  try {
    const budget = await createBudget(req.user._id, req.body);
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lister tous les budgets de l'utilisateur
const list = async (req, res) => {
  try {
    const budgets = await getUserBudgets(req.user._id);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un budget par son ID
const getById = async (req, res) => {
  try {
    const budget = await getBudgetById(req.user._id, req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget non trouvé' });
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un budget
const update = async (req, res) => {
  try {
    const budget = await updateBudget(req.user._id, req.params.id, req.body);
    if (!budget) return res.status(404).json({ error: 'Budget non trouvé ou non modifiable' });
    res.status(200).json(budget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un budget
const remove = async (req, res) => {
  try {
    const budget = await deleteBudget(req.user._id, req.params.id);
    if (!budget) return res.status(404).json({ error: 'Budget non trouvé ou non supprimable' });
    res.status(200).json({ message: 'Budget supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { create, list, getById, update, remove }; 