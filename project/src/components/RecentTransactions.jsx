import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ArrowUpDown, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFinance } from '../store/FinanceContext';
import { formatCurrency } from '../utils/currency';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const RecentTransactions = () => {
  const { t } = useLanguage();
  const { transactions, loading, deleteTransaction } = useFinance();
  const [filterPeriod, setFilterPeriod] = useState('month'); // day, week, month, year
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // desc = plus récent en premier, asc = plus ancien en premier
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  // Debug: Afficher les transactions pour vérifier
  console.log('RecentTransactions - Transactions reçues:', transactions);
  console.log('RecentTransactions - Tri actuel:', sortOrder);
  console.log('RecentTransactions - Page actuelle:', currentPage);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour formater l'heure
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Fonction pour obtenir le nom de la catégorie
  const getCategoryName = (category) => {
    const categoryMap = {
      'Alimentation': t('food'),
      'Transport': t('transport'),
      'Santé': t('healthcare'),
      'Loisirs': t('entertainment'),
      'Shopping': t('shopping'),
      'Logement': t('housing'),
      'Éducation': t('education'),
      'Autre': t('other')
    };
    return categoryMap[category] || category;
  };

  // Fonction pour filtrer et trier les transactions
  const filteredTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const now = new Date();
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      const diffTime = Math.abs(now - transactionDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filterPeriod) {
        case 'day':
          return diffDays <= 1;
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        case 'year':
          return diffDays <= 365;
        default:
          return true;
      }
    });

    console.log('RecentTransactions - Transactions filtrées:', filtered.length);

    // Trier par createdAt (heure de création réelle) selon l'ordre choisi
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    console.log('RecentTransactions - Première transaction après tri:', sorted[0]);
    console.log('RecentTransactions - Dernière transaction après tri:', sorted[sorted.length - 1]);

    return sorted;
  }, [transactions, filterPeriod, sortOrder]);

  // Réinitialiser la pagination quand les transactions changent
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Fonction pour changer de page
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Fonction pour basculer l'ordre de tri
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    setCurrentPage(1); // Retourner à la première page
  };

  // Fonction pour supprimer une transaction
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };



  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentTransactions')}</h3>
        <div className="flex items-center space-x-4">
          {/* Filtres de période */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select 
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none cursor-pointer focus:outline-none"
            >
              <option value="day">{t('today')}</option>
              <option value="week">{t('thisWeek')}</option>
              <option value="month">{t('thisMonth')}</option>
              <option value="year">{t('thisYear')}</option>
            </select>
          </div>
          <button
            onClick={toggleSortOrder}
            className="flex items-center space-x-1 text-gray-400 hover:text-gray-600 transition-colors"
            title={sortOrder === 'desc' ? t('sortOldestFirst') : t('sortNewestFirst')}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="text-xs">{sortOrder === 'desc' ? t('newest') : t('oldest')}</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('transactionName')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dateTime')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('amount')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('note')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    <span>{t('loading')}</span>
                  </div>
                </td>
              </tr>
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400">
                  {t('noTransactions')}
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description || t('transaction')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{getCategoryName(transaction.category)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{formatDate(transaction.createdAt)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(transaction.createdAt)}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${
                      transaction.nature === 'income' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.nature === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.description || '-'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {showDeleteConfirm === transaction._id ? (
                        <>
                          <button
                            onClick={() => handleDeleteTransaction(transaction._id)}
                            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                          >
                            {t('confirm')}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                          >
                            {t('cancel')}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(transaction._id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title={t('deleteTransaction')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('showing')} {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} {t('of')} {filteredTransactions.length} {t('transactions')}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {/* Numéros de page */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;