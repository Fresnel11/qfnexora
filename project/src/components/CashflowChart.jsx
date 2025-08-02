import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFinance } from '../store/FinanceContext';
import { formatCurrency } from '../utils/currency';
import Card from '../ui/Card';

const CashflowChart = () => {
  const { t } = useLanguage();
  const { transactions, loading } = useFinance();
  const [filterPeriod, setFilterPeriod] = useState('year'); // year, month, week

  // Fonction pour formater le montant
  const formatAmount = (amount) => {
    return formatCurrency(amount, 'XOF');
  };

  // Agréger les transactions selon la période sélectionnée
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      // Retourner des données vides selon la période
      if (filterPeriod === 'year') {
        return Array.from({ length: 12 }, (_, index) => {
          const monthNames = [
            t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun'),
            t('jul'), t('aug'), t('sep'), t('oct'), t('nov'), t('dec')
          ];
          return {
            period: monthNames[index],
            income: 0,
            expense: 0
          };
        });
      } else if (filterPeriod === 'month') {
        return Array.from({ length: 4 }, (_, index) => {
          const weekNames = [t('week1'), t('week2'), t('week3'), t('week4')];
          return {
            period: weekNames[index],
            income: 0,
            expense: 0
          };
        });
      } else if (filterPeriod === 'week') {
        return Array.from({ length: 7 }, (_, index) => {
          const dayNames = [
            t('monday'), t('tuesday'), t('wednesday'), t('thursday'), 
            t('friday'), t('saturday'), t('sunday')
          ];
          return {
            period: dayNames[index],
            income: 0,
            expense: 0
          };
        });
      }
    }

    const now = new Date();
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.createdAt);
      const diffTime = Math.abs(now - transactionDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filterPeriod) {
        case 'year':
          return transactionDate.getFullYear() === now.getFullYear();
        case 'month':
          return diffDays <= 30;
        case 'week':
          return diffDays <= 7;
        default:
          return true;
      }
    });

    if (filterPeriod === 'year') {
      // Agréger par mois pour l'année
      const monthlyData = {};
      for (let i = 0; i < 12; i++) {
        const monthNames = [
          t('jan'), t('feb'), t('mar'), t('apr'), t('may'), t('jun'),
          t('jul'), t('aug'), t('sep'), t('oct'), t('nov'), t('dec')
        ];
        monthlyData[i] = {
          period: monthNames[i],
          income: 0,
          expense: 0
        };
      }

      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        const month = transactionDate.getMonth();
        const amount = transaction.amount;

        if (transaction.nature === 'income') {
          monthlyData[month].income += amount;
        } else if (transaction.nature === 'expense') {
          monthlyData[month].expense += -amount;
        }
      });

      return Object.values(monthlyData);
    } else if (filterPeriod === 'month') {
      // Agréger par semaine pour le mois
      const weeklyData = {};
      for (let i = 0; i < 4; i++) {
        const weekNames = [t('week1'), t('week2'), t('week3'), t('week4')];
        weeklyData[i] = {
          period: weekNames[i],
          income: 0,
          expense: 0
        };
      }

      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        const dayOfMonth = transactionDate.getDate();
        const week = Math.floor((dayOfMonth - 1) / 7);
        const amount = transaction.amount;

        if (week < 4) {
          if (transaction.nature === 'income') {
            weeklyData[week].income += amount;
          } else if (transaction.nature === 'expense') {
            weeklyData[week].expense += -amount;
          }
        }
      });

      return Object.values(weeklyData);
    } else if (filterPeriod === 'week') {
      // Agréger par jour pour la semaine
      const dailyData = {};
      for (let i = 0; i < 7; i++) {
        const dayNames = [
          t('monday'), t('tuesday'), t('wednesday'), t('thursday'), 
          t('friday'), t('saturday'), t('sunday')
        ];
        dailyData[i] = {
          period: dayNames[i],
          income: 0,
          expense: 0
        };
      }

      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.createdAt);
        const dayOfWeek = transactionDate.getDay(); // 0 = dimanche, 1 = lundi, etc.
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convertir pour que lundi = 0
        const amount = transaction.amount;

        if (transaction.nature === 'income') {
          dailyData[adjustedDay].income += amount;
        } else if (transaction.nature === 'expense') {
          dailyData[adjustedDay].expense += -amount;
        }
      });

      return Object.values(dailyData);
    }

    return [];
  }, [transactions, filterPeriod, t]);

  // Calculer le total des revenus et dépenses pour la période
  const periodTotals = useMemo(() => {
    const totalIncome = chartData.reduce((sum, period) => sum + period.income, 0);
    const totalExpense = chartData.reduce((sum, period) => sum + Math.abs(period.expense), 0);
    return { totalIncome, totalExpense };
  }, [chartData]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('cashflow')}</h3>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filterPeriod === 'year' ? t('thisYear') : 
               filterPeriod === 'month' ? t('thisMonth') : 
               t('thisWeek')}
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {loading ? '...' : formatAmount(periodTotals.totalIncome - periodTotals.totalExpense)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select 
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="text-sm text-gray-600 dark:text-gray-400 bg-transparent border-none cursor-pointer focus:outline-none"
          >
            <option value="year">{t('thisYear')}</option>
            <option value="month">{t('thisMonth')}</option>
            <option value="week">{t('thisWeek')}</option>
          </select>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="period" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name={t('income')} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#a7f3d0" name={t('expense')} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CashflowChart;