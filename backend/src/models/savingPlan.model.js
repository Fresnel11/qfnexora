const mongoose = require('mongoose');

// Sous-document pour l'historique des transactions d'épargne
const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String },
}, { _id: false });

const SavingPlanSchema = new mongoose.Schema({
  // Référence à l'utilisateur propriétaire du plan
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Titre du plan d'épargne
  title: {
    type: String,
    required: true,
  },
  // Description optionnelle
  description: String,
  // Montant cible à atteindre
  targetAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  // Montant déjà épargné (mis à jour à chaque dépôt)
  currentAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Date de début du plan
  startDate: {
    type: Date,
    required: true,
  },
  // Date d'échéance/fin du plan
  endDate: {
    type: Date,
    required: true,
  },
  // Statut du plan
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'cancelled'],
    default: 'in_progress',
  },
  // Activation de l'épargne automatique
  autoSave: {
    type: Boolean,
    default: false,
  },
  // Fréquence de l'épargne automatique (si activée)
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: function () {
      return this.autoSave === true;
    },
  },
  // Devise utilisée pour le plan
  currency: {
    type: String,
    default: 'XOF',
  },
  // IFU (pour les entreprises)
  IFU: {
    type: String,
  },
  // Historique des transactions/dépôts
  transactions: [TransactionSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('SavingPlan', SavingPlanSchema); 