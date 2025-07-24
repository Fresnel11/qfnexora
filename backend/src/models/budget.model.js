const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  // Référence à l'utilisateur propriétaire du budget
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Période du budget : hebdomadaire, mensuel, annuel
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true,
  },
  // Montant du budget
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  // Catégorie du budget (optionnel, global ou spécifique)
  category: {
    type: String,
    default: 'Global',
  },
  // Date de début de validité du budget
  startDate: {
    type: Date,
    required: true,
  },
  // Date de fin de validité du budget
  endDate: {
    type: Date,
    required: true,
  },
  // Devise utilisée
  currency: {
    type: String,
    default: 'XOF',
  },
  // Statut du budget
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  // Notifications activées (optionnel)
  notifications: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Budget', BudgetSchema); 