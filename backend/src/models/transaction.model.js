const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  // Référence à l'utilisateur propriétaire de la transaction
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Type de transaction : dépôt, retrait ou transfert
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true,
  },
  // Montant de la transaction
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  // Catégorie (ex : Alimentation, Transport...)
  category: {
    type: String,
    default: 'Autre',
  },
  // Description optionnelle
  description: {
    type: String,
  },
  // Statut de la transaction
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success',
  },
  // Devise utilisée
  currency: {
    type: String,
    default: 'XOF',
  },
  // Date de la transaction
  date: {
    type: Date,
    default: Date.now,
  },
  // Source de la transaction (manuel ou future intégration)
  source: {
    type: String,
    enum: ['manual', 'future_integration'],
    default: 'manual',
  },
  // Nature de la transaction : revenu ou dépense
  nature: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  // Lien vers un plan d'épargne associé (optionnel)
  relatedSavingPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SavingPlan',
  },
  // URL d'un reçu (optionnel, pour le futur)
  receiptUrl: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Transaction', TransactionSchema); 