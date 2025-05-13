import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { formatCurrency } from '../../utils/currency';
import { calculateMonthlyTotals } from '../../utils/finance';
import { TrendingUp, TrendingDown } from 'lucide-react';

const IncomeExpenseCards: React.FC = () => {
  const { state } = useFinance();
  const { getTranslation } = useTranslation();
  const t = (key: any) => getTranslation(key, state.language);

  const { income, expense } = calculateMonthlyTotals(state.transactions);
  
  const formattedIncome = formatCurrency(income, state.currency);
  const formattedExpense = formatCurrency(expense, state.currency);

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <motion.div
        className="glass rounded-xl p-4 neon-border-secondary"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 mr-4">
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              {t('monthlyIncome')}
            </h3>
            <p className="text-xl font-display font-bold text-green-500 mt-1">
              {formattedIncome}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="glass rounded-xl p-4 neon-border-tertiary"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30 mr-4">
            <TrendingDown className="text-tertiary" size={24} />
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm">
              {t('monthlyExpenses')}
            </h3>
            <p className="text-xl font-display font-bold text-tertiary mt-1">
              {formattedExpense}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IncomeExpenseCards;