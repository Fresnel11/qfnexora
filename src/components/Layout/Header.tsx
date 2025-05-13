import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { useTranslation } from '../../locales/translations';
import { Moon, Sun, Globe } from 'lucide-react';

const Header: React.FC = () => {
  const { state, dispatch } = useFinance();
  const { getTranslation } = useTranslation();
  const t = (key: any) => getTranslation(key, state.language);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const toggleLanguage = () => {
    dispatch({
      type: 'SET_LANGUAGE',
      payload: state.language === 'en' ? 'fr' : 'en',
    });
  };

  return (
    <header className="p-4 bg-gradient-to-r from-dark/80 to-black/80 dark:from-dark to-black text-white sticky top-0 z-10 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-3"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xl font-display font-bold">Q</span>
          </motion.div>
          <h1 className="text-xl font-display font-semibold tracking-wider">
            {t('appName')}
          </h1>
        </motion.div>

        <div className="flex space-x-4">
          <motion.button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Globe size={20} />
          </motion.button>
          
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {state.darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;