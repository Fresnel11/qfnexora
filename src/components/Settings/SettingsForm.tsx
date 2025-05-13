import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { useNotification } from '../../context/NotificationContext';
import { Currency, LanguageCode } from '../../types';
import { getCurrencyName } from '../../utils/currency';
import { ExportPdfModal } from './ExportPdfModal';
import { AlertTriangle } from 'lucide-react';

const SettingsForm: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { getTranslation } = useTranslation();
  const { showNotification } = useNotification();
  const t = (key: any) => getTranslation(key, state.language);

  const [formData, setFormData] = useState({
    currency: state.currency,
    budget: state.budget.toString(),
  });

  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currencies: Currency[] = ['EUR', 'USD', 'GBP', 'JPY', 'CAD', 'CHF', 'FCFA'];
  const languages: LanguageCode[] = ['en', 'fr'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (language: LanguageCode) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const budget = parseFloat(formData.budget);
    if (isNaN(budget) || budget <= 0) {
      showNotification(t('invalidFields'), 'error');
      return;
    }

    dispatch({ type: 'SET_CURRENCY', payload: formData.currency as Currency });
    dispatch({ type: 'SET_BUDGET', payload: budget });
    
    showNotification(t('settingsSaved'), 'success');
  };

  const handleDeleteAllData = () => {
    dispatch({ type: 'DELETE_ALL_DATA' });
    setShowDeleteConfirm(false);
    showNotification(t('transactionDeleted'), 'success');
  };

  return (
    <motion.div
      className="glass rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-display font-semibold text-gray-700 dark:text-gray-300 mb-6">
        {t('settings')}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label 
            htmlFor="currency" 
            className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
          >
            {t('currency')}
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/50"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency} - {getCurrencyName(currency)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label 
            htmlFor="budget" 
            className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
          >
            {t('monthlyBudget')}
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full p-3 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/50"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {t('language')}
          </label>
          <div className="flex space-x-4">
            {languages.map((lang) => (
              <motion.button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`px-4 py-2 rounded-md ${
                  state.language === lang
                    ? 'bg-gradient-to-r from-primary to-secondary text-dark font-bold'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t(lang === 'en' ? 'english' : 'french')}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary text-dark font-display font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('save')}
          </motion.button>
          
          <motion.button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="bg-secondary text-white font-display font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('exportPdf')}
          </motion.button>
        </div>
      </form>

      <hr className="my-8 border-gray-300 dark:border-gray-700" />

      <div className="mt-6">
        <h3 className="text-lg font-display font-semibold text-tertiary mb-2">
          {t('deleteAllData')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('confirmDeleteAll')}
        </p>
        
        {showDeleteConfirm ? (
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <AlertTriangle className="text-tertiary mr-2 flex-shrink-0" size={20} />
              <p className="text-red-800 dark:text-red-200 text-sm">
                {t('confirmDeleteAll')}
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <motion.button
                onClick={handleDeleteAllData}
                className="bg-tertiary text-white py-2 px-4 rounded-md font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('confirmDelete')}
              </motion.button>
              <motion.button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('cancel')}
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-tertiary/10 text-tertiary border border-tertiary py-2 px-4 rounded-md font-semibold hover:bg-tertiary/20 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('deleteAllData')}
          </motion.button>
        )}
      </div>

      {showExportModal && (
        <ExportPdfModal onClose={() => setShowExportModal(false)} />
      )}
    </motion.div>
  );
};

export default SettingsForm;