import React, { useState } from 'react';
import { X, Calendar, Target, DollarSign, Clock, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFinance } from '../store/FinanceContext';
import { formatCurrency } from '../utils/currency';

const SavingPlanModal = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { createSavingPlan } = useFinance();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    autoSave: false,
    frequency: 'monthly',
    currency: 'XOF'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currencies = [
    { code: 'XOF', symbol: 'CFA', name: 'Franc CFA' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const frequencies = [
    { value: 'daily', label: t('daily') },
    { value: 'weekly', label: t('weekly') },
    { value: 'monthly', label: t('monthly') }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const savingPlanData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        autoSave: formData.autoSave,
        frequency: formData.autoSave ? formData.frequency : undefined
      };

      await createSavingPlan(savingPlanData);
      onClose();
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        autoSave: false,
        frequency: 'monthly',
        currency: 'XOF'
      });
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du plan d\'épargne');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('addSavingPlan')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('title')} *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t('enterTitle')}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder={t('enterDescription')}
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('targetAmount')} *
            </label>
            <div className="relative">
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
              <Target className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('currency')}
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('startDate')} *
            </label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('endDate')} *
            </label>
            <div className="relative">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                min={formData.startDate}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Auto Save */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="autoSave"
              checked={formData.autoSave}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('enableAutoSave')}
            </label>
          </div>

          {/* Frequency (only if auto save is enabled) */}
          {formData.autoSave && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('frequency')}
              </label>
              <div className="relative">
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {frequencies.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('creating')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('createPlan')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingPlanModal; 