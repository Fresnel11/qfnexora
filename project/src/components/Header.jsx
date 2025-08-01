import React from 'react';
import { Search, Bell, Sun, Moon, Globe, Menu } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 fixed top-0 left-0 right-0 z-40 lg:ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 lg:hidden mr-4"
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('dashboard')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className="pl-10 w-48 lg:w-64 transition-all duration-200 focus:w-64 lg:focus:w-80"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 transition-transform hover:scale-110"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="p-2 transition-transform hover:scale-110 hidden sm:flex"
          >
            <Globe className="w-5 h-5" />
            <span className="ml-1 text-sm">{language.toUpperCase()}</span>
          </Button>
          
          <div className="relative transition-transform hover:scale-110">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </div>
          
          <div className="flex items-center space-x-3 hidden sm:flex">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">Andrew Forbist</span>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <span className="text-white text-sm font-medium">AF</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;