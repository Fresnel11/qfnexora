import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import SettingsForm from './SettingsForm';

const Settings: React.FC = () => {
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
        {t('settings')}
      </h1>

      <SettingsForm />
    </motion.div>
  );
};

export default Settings;