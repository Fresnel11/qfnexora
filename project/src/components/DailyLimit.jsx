import React, { useMemo, useState } from 'react';
import { Calendar, TrendingDown, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFinance } from '../store/FinanceContext';
import { formatCurrency } from '../utils/currency';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const DailyLimit = () => {
  const { t } = useLanguage();
  const { transactions, budgets, loading } = useFinance();
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [showFilter, setShowFilter] = useState(false);

  // Debug: Afficher les données pour vérifier
  console.log('DailyLimit - budgets:', budgets);
  console.log('DailyLimit - transactions:', transactions);
  console.log('DailyLimit - selectedPeriod:', selectedPeriod);

  // Trouver le budget correspondant à la période sélectionnée
  const currentBudget = useMemo(() => {
    if (!budgets || budgets.length === 0) return null;
    
    const now = new Date();
    const matchingBudget = budgets.find(budget => 
      budget.period === selectedPeriod && 
      budget.status === 'active' &&
      new Date(budget.startDate) <= now &&
      new Date(budget.endDate) >= now
    );
    
    console.log('DailyLimit - Recherche budget:', {
      selectedPeriod,
      totalBudgets: budgets.length,
      matchingBudget: matchingBudget ? {
        id: matchingBudget._id,
        period: matchingBudget.period,
        amount: matchingBudget.amount,
        category: matchingBudget.category,
        startDate: matchingBudget.startDate,
        endDate: matchingBudget.endDate
      } : null
    });
    
    return matchingBudget;
  }, [budgets, selectedPeriod]);

  // Calculer les données de budget et dépenses
  const budgetData = useMemo(() => {
    if (!currentBudget) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        percentage: 0,
        period: selectedPeriod,
        category: t('noActiveBudget')
      };
    }

    const now = new Date();
    const budgetStartDate = new Date(currentBudget.startDate);
    const budgetEndDate = new Date(currentBudget.endDate);
    
    // Vérifier si le budget est actif
    if (now < budgetStartDate || now > budgetEndDate) {
      return {
        totalBudget: currentBudget.amount,
        totalSpent: 0,
        percentage: 0,
        period: selectedPeriod,
        category: currentBudget.category
      };
    }

    // Calculer la période de dépenses selon la période sélectionnée
    let startDate, endDate;
    const budgetPeriod = selectedPeriod;

    if (budgetPeriod === 'weekly') {
      // Calculer le début de la semaine actuelle (lundi)
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysToMonday);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else if (budgetPeriod === 'monthly') {
      // Calculer le début du mois actuel
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else if (budgetPeriod === 'yearly') {
      // Calculer le début de l'année actuelle
      startDate = new Date(now.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(now.getFullYear() + 1, 0, 1);
    } else {
      // Fallback: utiliser les dates du budget
      startDate = budgetStartDate;
      endDate = budgetEndDate;
    }

    console.log('DailyLimit - Période calculée:', {
      period: budgetPeriod,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      now: now.toISOString()
    });

    // Filtrer les transactions de la période (dépenses seulement)
    const periodExpenses = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      return transaction.nature === 'expense' && 
             transactionDate >= startDate &&
             transactionDate < endDate; // < au lieu de <= pour exclure la fin
    });

    const totalSpent = periodExpenses.reduce((sum, transaction) => sum + transaction.amount, 0);
    
    console.log('DailyLimit - Transactions filtrées:', {
      totalTransactions: transactions.length,
      periodExpenses: periodExpenses.length,
      totalSpent,
      periodExpenses: periodExpenses.map(t => ({
        amount: t.amount,
        date: t.createdAt,
        description: t.description
      }))
    });
    const totalBudget = currentBudget.amount;
    const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    return {
      totalBudget,
      totalSpent,
      percentage,
      period: budgetPeriod,
      category: currentBudget.category
    };
  }, [transactions, currentBudget, selectedPeriod, t]);

  // Fonction pour obtenir le nom de la période
  const getPeriodName = (period) => {
    switch (period) {
      case 'daily':
        return t('daily');
      case 'weekly':
        return t('weekly');
      case 'monthly':
        return t('monthly');
      case 'yearly':
        return t('yearly');
      default:
        return t('weekly');
    }
  };

  // Fonction pour déterminer la couleur selon le pourcentage
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 75) return 'orange';
    if (percentage >= 50) return 'yellow';
    return 'emerald';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('budgetLimit')}
          </h3>
        </div>
        
        {/* Filtre de période */}
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {getPeriodName(selectedPeriod)}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilter ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown des périodes */}
          {showFilter && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              {['weekly', 'monthly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setSelectedPeriod(period);
                    setShowFilter(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedPeriod === period 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getPeriodName(period)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Informations du budget */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(budgetData.totalSpent)} {t('spent')} {t('of')} {formatCurrency(budgetData.totalBudget)}
            </span>
          </div>
          <span className={`text-sm font-medium ${
            budgetData.percentage >= 90 ? 'text-red-600' :
            budgetData.percentage >= 75 ? 'text-orange-600' :
            budgetData.percentage >= 50 ? 'text-yellow-600' :
            'text-emerald-600'
          }`}>
            {budgetData.percentage.toFixed(1)}%
          </span>
        </div>
        
        {/* Barre de progression */}
        <ProgressBar 
          value={budgetData.totalSpent} 
          max={budgetData.totalBudget} 
          color={getProgressColor(budgetData.percentage)} 
        />

        {/* Catégorie du budget */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {budgetData.category}
        </div>
      </div>
    </Card>
  );
};

export default DailyLimit;