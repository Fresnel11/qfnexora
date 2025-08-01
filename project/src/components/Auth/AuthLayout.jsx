import React from 'react';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import ThemeSwitcher from '../UI/ThemeSwitcher';
// import logo from '../../img/logo.png'; // Décommente si tu as un logo

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
      <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col items-center">
        {/* Logo */}
        {/* <img src={logo} alt="Nexora CashTrack" className="h-12 mb-4" /> */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nexora CashTrack</h1>
        <div className="w-full mt-2">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout; 