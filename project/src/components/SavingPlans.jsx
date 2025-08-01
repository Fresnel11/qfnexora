import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

const SavingPlans = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('emergencyFund'),
      current: 5000,
      target: 50000,
      percentage: 50,
      color: 'emerald'
    },
    {
      name: t('vacationFund'),
      current: 3000,
      target: 5000,
      percentage: 60,
      color: 'emerald'
    },
    {
      name: t('homeDownPayment'),
      current: 7250,
      target: 200000,
      percentage: 36.25,
      color: 'emerald'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('savingPlans')}</h3>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>{t('addPlan')}</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalSavings')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$84,500</p>
        </div>
        
        <div className="space-y-4">
          {plans.map((plan, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{plan.name}</span>
                <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
              </div>
              
              <ProgressBar value={plan.current} max={plan.target} color={plan.color} />
              
              <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <span>${plan.current.toLocaleString()} {plan.percentage}%</span>
                <span>{t('target')}: ${plan.target.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default SavingPlans;