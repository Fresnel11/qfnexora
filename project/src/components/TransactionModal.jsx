import React, { useState } from 'react';
import { X, DollarSign, TrendingUp, TrendingDown, Calendar, FileText, Tag } from 'lucide-react';
import { useFinance } from '../store/FinanceContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const TransactionModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { createTransaction, loading, error, clearError } = useFinance();

  const [formData, setFormData] = useState({
    type: 'deposit',
    amount: '',
    category: '',
    description: '',
    status: 'pending',
    currency: 'XOF',
    date: new Date().toISOString().split('T')[0],
    source: 'manual',
    relatedSavingPlan: null,
    receiptUrl: '',
    nature: 'income'
  });

  // Catégories prédéfinies
  const categories = {
    income: [
      'Salaire',
      'Freelance',
      'Investissement',
      'Cadeau',
      'Remboursement',
      'Autre revenu'
    ],
    expense: [
      'Alimentation',
      'Transport',
      'Logement',
      'Santé',
      'Loisirs',
      'Shopping',
      'Factures',
      'Restaurant',
      'Autre dépense'
    ]
  };

  // Devises disponibles
  const currencies = [
    { code: 'XOF', name: 'Franc CFA (XOF)', symbol: 'CFA' },
    { code: 'USD', name: 'Dollar US (USD)', symbol: '$' },
    { code: 'EUR', name: 'Euro (EUR)', symbol: '€' },
    { code: 'GBP', name: 'Livre Sterling (GBP)', symbol: '£' },
    { code: 'JPY', name: 'Yen Japonais (JPY)', symbol: '¥' },
    { code: 'CAD', name: 'Dollar Canadien (CAD)', symbol: 'C$' },
    { code: 'AUD', name: 'Dollar Australien (AUD)', symbol: 'A$' },
    { code: 'CHF', name: 'Franc Suisse (CHF)', symbol: 'CHF' },
    { code: 'CNY', name: 'Yuan Chinois (CNY)', symbol: '¥' },
    { code: 'INR', name: 'Roupie Indienne (INR)', symbol: '₹' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mettre à jour la nature automatiquement selon le type
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        type: value,
        nature: value === 'deposit' ? 'income' : 'expense'
      }));
    }

    // Effacer les erreurs quand l'utilisateur modifie
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      const result = await createTransaction(transactionData);
      if (result.success) {
        // Réinitialiser le formulaire
        setFormData({
          type: 'deposit',
          amount: '',
          category: '',
          description: '',
          status: 'pending',
          currency: 'XOF',
          date: new Date().toISOString().split('T')[0],
          source: 'manual',
          relatedSavingPlan: null,
          receiptUrl: '',
          nature: 'income'
        });
        onClose();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      type: 'deposit',
      amount: '',
      category: '',
      description: '',
      status: 'pending',
      currency: 'XOF',
      date: new Date().toISOString().split('T')[0],
      source: 'manual',
      relatedSavingPlan: null,
      receiptUrl: '',
      nature: 'income'
    });
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {formData.type === 'deposit' ? 'Ajouter un revenu' : 'Ajouter une dépense'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type de transaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de transaction *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.type === 'deposit' 
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="deposit"
                  checked={formData.type === 'deposit'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Revenu</span>
              </label>
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                formData.type === 'withdrawal' 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="withdrawal"
                  checked={formData.type === 'withdrawal'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dépense</span>
              </label>
            </div>
          </div>

          {/* Montant et Devise */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Montant *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                  {currencies.find(c => c.code === formData.currency)?.symbol || '$'}
                </span>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Devise
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catégorie
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories[formData.nature].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                placeholder="Description de la transaction..."
              />
            </div>
          </div>

          {/* URL du reçu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL du reçu (optionnel)
            </label>
            <input
              type="url"
              name="receiptUrl"
              value={formData.receiptUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/receipt.pdf"
            />
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Création...' : 'Créer la transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal; 