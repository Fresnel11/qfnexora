const {
  createSavingPlan,
  getUserSavingPlans,
  getSavingPlanById,
  updateSavingPlan,
  deleteSavingPlan,
  addDepositToSavingPlan,
} = require('../services/savingPlan.service');

// Créer un plan d'épargne
const create = async (req, res) => {
  try {
    const plan = await createSavingPlan(req.user._id, req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lister tous les plans de l'utilisateur
const list = async (req, res) => {
  try {
    const plans = await getUserSavingPlans(req.user._id);
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un plan par son ID
const getById = async (req, res) => {
  try {
    const plan = await getSavingPlanById(req.user._id, req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan non trouvé' });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un plan (seulement si in_progress)
const update = async (req, res) => {
  try {
    const plan = await updateSavingPlan(req.user._id, req.params.id, req.body);
    if (!plan) return res.status(404).json({ error: 'Plan non trouvé ou non modifiable' });
    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un plan (seulement si in_progress)
const remove = async (req, res) => {
  try {
    const plan = await deleteSavingPlan(req.user._id, req.params.id);
    if (!plan) return res.status(404).json({ error: 'Plan non trouvé ou non supprimable' });
    res.status(200).json({ message: 'Plan supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Ajouter un dépôt manuel
const addDeposit = async (req, res) => {
  try {
    const plan = await addDepositToSavingPlan(req.user._id, req.params.id, req.body);
    if (!plan) return res.status(404).json({ error: 'Plan non trouvé ou non modifiable' });
    res.status(200).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { create, list, getById, update, remove, addDeposit }; 