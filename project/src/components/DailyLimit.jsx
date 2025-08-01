import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

const DailyLimit = () => {
  const { t } = useLanguage();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dailyLimit')}</h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            $2,500.00 {t('spent')} {t('of')} $20,000.00
          </span>
          <span className="text-sm font-medium text-emerald-600">12.5%</span>
        </div>
        
        <ProgressBar value={2500} max={20000} color="emerald" />
      </div>
    </Card>
  );
};

export default DailyLimit;