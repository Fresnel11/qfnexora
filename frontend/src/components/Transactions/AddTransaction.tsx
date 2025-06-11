import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { useNotification } from '../../context/NotificationContext';
import { getCurrentDateISOString } from '../../utils/finance';
import { Transaction, TransactionType, TransactionCategory } from '../../types';

const AddTransaction: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { getTranslation } = useTranslation();
  const { showNotification } = useNotification();
  const t = (key: any) => getTranslation(key, state.language);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as TransactionType,
    category: 'food' as TransactionCategory,
    date: getCurrentDateISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount);
    if (!formData.description || isNaN(amount) || amount <= 0) {
      showNotification(t('invalidFields'), 'error');
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now(),
      description: formData.description,
      amount,
      type: formData.type,
      category: formData.category,
      date: formData.date,
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    showNotification(t('transactionAdded'), 'success');

    // Reset form
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'food',
      date: getCurrentDateISOString(),
    });
  };

  const categories: TransactionCategory[] = [
    'food',
    'housing',
    'transport',
    'entertainment',
    'health',
    'education',
    'salary',
    'other',
  ];

  return (
    <motion.div
      className="glass rounded-xl p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-display font-semibold text-gray-800 dark:text-gray-200 mb-6">
        {t('addTransaction')}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
            >
              {t('description')}
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/90 text-gray-800 dark:text-gray-200 !important placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label 
              htmlFor="amount" 
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
            >
              {t('amount')}
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/90 text-gray-800 dark:text-gray-200 !important placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label 
              htmlFor="type" 
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
            >
              {t('type')}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/90 text-gray-800 dark:text-gray-200 !important"
            >
              <option value="expense" className="text-gray-800 dark:text-gray-200">{t('expense')}</option>
              <option value="income" className="text-gray-800 dark:text-gray-200">{t('income')}</option>
            </select>
          </div>

          <div>
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
            >
              {t('category')}
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/90 text-gray-800 dark:text-gray-200 !important"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="text-gray-800 dark:text-gray-200">
                  {t(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label 
              htmlFor="date" 
              className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
            >
              {t('date')}
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/90 text-gray-800 dark:text-gray-200 !important"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-secondary text-dark dark:text-white font-display font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('add')}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddTransaction;