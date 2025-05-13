import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { formatCurrency } from '../../utils/currency';
import { calculateBudgetProgress } from '../../utils/finance';
import ProgressBar from '../UI/ProgressBar';

const BudgetProgress: React.FC = () => {
  const { state } = useFinance();
  const { getTranslation } = useTranslation();
  const t = (key: any) => getTranslation(key, state.language);

  const { spent, remaining, percentage } = calculateBudgetProgress(
    state.transactions,
    state.budget
  );

  // Déterminer la couleur du cercle selon le pourcentage
  const getProgressColor = () => {
    if (percentage < 50) return '#22c55e'; // Vert
    if (percentage < 80) return '#f97316'; // Orange
    return '#ef4444'; // Rouge
  };

  // Propriétés du cercle
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  return (
    <motion.div
      className="glass rounded-xl p-6 mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-xl font-display text-gray-700 dark:text-gray-300 mb-4">
        {t('budgetProgress')}
      </h2>

      <div className="flex flex-col md:flex-row items-center">
        <div className="relative w-50 h-50 mb-6 md:mb-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Cercle de fond */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Cercle de progression */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getProgressColor()}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </svg>
          {/* Contenu centré */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <span className="text-4xl font-bold text-gray-700 dark:text-gray-200 ">
              {Math.round(percentage)}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('spent')}
            </span>
          </motion.div>
        </div>

        {/* Partie droite */}
        <div className="flex-1 md:ml-6 w-full">
          <div className="mb-4">
            <ProgressBar progress={percentage} isOverBudget={percentage >= 80} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">
                {t('spent')}
              </h3>
              <p
                className={`text-xl font-bold ${
                  percentage >= 80 ? 'text-tertiary' : 'text-primary'
                }`}
              >
                {formatCurrency(spent, state.currency)}
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 dark:text-gray-400">
                {t('remaining')}
              </h3>
              <p className="text-xl font-bold text-green-500">
                {formatCurrency(remaining, state.currency)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm text-gray-500 dark:text-gray-400">
              {t('budget')}
            </h3>
            <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
              {formatCurrency(state.budget, state.currency)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetProgress;