import React, { useState } from 'react';
import { Plus, ArrowLeftRight, Download, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import TransactionModal from './TransactionModal';

const QuickActions = () => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actions = [
    { 
      icon: Plus, 
      label: t('topUp'), 
      color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400',
      onClick: () => setIsModalOpen(true)
    },
    { 
      icon: ArrowLeftRight, 
      label: t('transfer'), 
      color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      onClick: () => console.log('Transfer clicked')
    },
    { 
      icon: Download, 
      label: t('request'), 
      color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      onClick: () => console.log('Request clicked')
    },
    { 
      icon: Clock, 
      label: t('history'), 
      color: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
      onClick: () => console.log('History clicked')
    }
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg ${action.color}`}
              onClick={action.onClick}
            >
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{action.label}</span>
          </div>
        ))}
      </div>

      {/* Modal de transaction */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default QuickActions;