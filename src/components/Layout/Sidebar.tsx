import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { LayoutDashboard, ListOrdered, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { state } = useFinance();
  const { getTranslation } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
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

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { id: 'transactions', label: t('transactions'), icon: <ListOrdered size={20} />, path: '/transactions' },
    { id: 'settings', label: t('settings'), icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <motion.aside
      className="w-full sm:w-64 bg-white dark:bg-dark glass p-4 shadow-md rounded-lg sm:h-[calc(100vh-2rem)] mb-4 sm:mb-0"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <nav className="flex flex-row sm:flex-col justify-around sm:justify-start gap-2 sm:mt-8">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full py-2 px-4 rounded-lg mb-2 transition-colors border ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-primary/30 to-secondary/30 text-gray-800 dark:text-primary border-primary/50 dark:border-primary neon-border-primary'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/20 text-gray-700 dark:text-gray-300 border-transparent'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;