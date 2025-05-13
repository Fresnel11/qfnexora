import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { formatCurrency } from '../../utils/currency';
import { calculateBalance } from '../../utils/finance';

const BalanceCard: React.FC = () => {
  const { state } = useFinance();
  const { getTranslation } = useTranslation();
  const t = (key: any) => getTranslation(key, state.language);

  const balance = calculateBalance(state.transactions);
  const formattedBalance = formatCurrency(balance, state.currency);

  return (
    <motion.div 
      className="w-full bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 glass neon-border-primary"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-display text-gray-700 dark:text-gray-300 mb-2">
        {t('totalBalance')}
      </h2>
      
      <motion.div 
        className="text-4xl font-display font-bold mt-4 animate-float"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span className={balance >= 0 ? 'text-green-500' : 'text-tertiary'}>
          {formattedBalance}
        </span>
      </motion.div>
      
      <div className="w-full h-1 bg-gradient-to-r from-primary to-secondary mt-4 rounded-full animate-pulse"></div>
    </motion.div>
  );
};

export default BalanceCard;