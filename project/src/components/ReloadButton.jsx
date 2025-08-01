import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useFinance } from '../store/FinanceContext';

const ReloadButton = () => {
  const { reloadData, loading } = useFinance();

  const handleReload = async () => {
    await reloadData();
  };

  return (
    <button
      onClick={handleReload}
      disabled={loading}
      className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
      title="Recharger les données"
    >
      <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
    </button>
  );
};

export default ReloadButton; 