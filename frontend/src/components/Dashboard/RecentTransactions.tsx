import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/finance';
import { Trash2, Search, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const RecentTransactions: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { getTranslation } = useTranslation();
  const { showNotification } = useNotification();
  // Use a default language if state.language is undefined
  const language = state.language || 'en';
  // Handle translations with error handling
  const t = (key: string) => {
    try {
      return getTranslation(key as any, language) || key;
    } catch (e) {
      console.warn(`Translation error for key "${key}":`, e);
      return key;
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handleDelete = (id: number) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    showNotification(t('transactionDeleted'), 'success');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterDate('');
  };

  // Filter transactions
  const filteredTransactions = state.transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t(transaction.category).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = filterDate
      ? new Date(transaction.date).toISOString().split('T')[0] === filterDate
      : true;
    return matchesSearch && matchesDate;
  });

  // Sort and limit to 5 recent transactions
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-green-500',
      housing: 'bg-blue-500',
      transport: 'bg-yellow-500',
      entertainment: 'bg-purple-500',
      health: 'bg-red-500',
      education: 'bg-indigo-500',
      salary: 'bg-green-600',
      other: 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  return (
    <motion.div
      className="glass rounded-xl p-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-display text-gray-800 dark:text-gray-200">
          {t('transactions')}
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <label htmlFor="search" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {t('searchByDescriptionOrCategory')}
            </label>
            <input
              id="search"
              type="text"
              placeholder={`${t('search')}...`}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/90 text-gray-800 dark:text-gray-200 !important placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-10 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
              {t('filterByDate')}
            </label>
            <input
              id="dateFilter"
              type="date"
              value={filterDate}
              onChange={handleDateFilter}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-dark/90 text-gray-800 dark:text-gray-200 !important"
            />
          </div>

          {(searchTerm || filterDate) && (
            <motion.button
              onClick={handleResetFilters}
              className="mt-6 sm:mt-0 sm:self-end bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={18} />
            </motion.button>
          )}
        </div>
      </div>

      {recentTransactions.length === 0 ? (
        <motion.p
          className="text-center text-gray-500 dark:text-gray-400 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {t('noTransactionsFound')}
        </motion.p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
                <th className="pb-2 text-sm sm:text-base">{t('date')}</th>
                <th className="pb-2 text-sm sm:text-base">{t('description')}</th>
                <th className="pb-2 text-sm sm:text-base">{t('category')}</th>
                <th className="pb-2 text-sm sm:text-base">{t('amount')}</th>
                <th className="pb-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {recentTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-2 sm:py-3 text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                      {transaction.description}
                    </td>
                    <td className="py-2 sm:py-3 text-xs sm:text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white ${getCategoryColor(
                          transaction.category
                        )}`}
                      >
                        {t(transaction.category)}
                      </span>
                    </td>
                    <td
                      className={`py-2 sm:py-3 text-xs sm:text-sm font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-500'
                          : 'text-tertiary'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount, state.currency)}
                    </td>
                    <td className="py-2 sm:py-3">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-gray-400 dark:text-gray-300 hover:text-tertiary transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default RecentTransactions;