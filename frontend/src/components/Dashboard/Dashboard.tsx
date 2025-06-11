import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import BalanceCard from './BalanceCard';
import IncomeExpenseCards from './IncomeExpenseCards';
import BudgetProgress from './BudgetProgress';
import RecentTransactions from './RecentTransactions';

const Dashboard: React.FC = () => {
  const { state } = useFinance();
  const { getTranslation } = useTranslation();
  const t = (key: any) => getTranslation(key, state.language);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white mb-6">
        {t('dashboard')}
      </h1>

      <BalanceCard />
      <IncomeExpenseCards />
      <BudgetProgress />
      <RecentTransactions />
    </motion.div>
  );
};

export default Dashboard;