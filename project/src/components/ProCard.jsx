import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../ui/Button';

const ProCard = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 rounded-lg">
      <div className="space-y-4">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-sm"></div>
        </div>
        
        <p className="text-sm leading-relaxed">
          {t('proTitle')}
        </p>
        
        <Button 
          variant="secondary" 
          className="w-full bg-white text-emerald-700 hover:bg-gray-100"
        >
          {t('getPro')}
        </Button>
      </div>
    </div>
  );
};

export default ProCard;