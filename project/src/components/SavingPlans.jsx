import React from 'react';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFinance } from '../store/FinanceContext';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

const SavingPlans = ({ onAddPlan }) => {
  const { t } = useLanguage();
  const { savingPlans, totalSavings, loading, error } = useFinance();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('savingPlans')}</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-2"
          onClick={onAddPlan}
        >
          <Plus className="w-4 h-4" />
          <span>{t('addPlan')}</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Chargement des plans d'épargne...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalSavings')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalSavings.totalCurrent.toLocaleString()} / {totalSavings.totalTarget.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalSavings.totalPercentage.toFixed(1)}% atteint
              </p>
            </div>
            
            <div className="space-y-4">
              {savingPlans.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aucun plan d'épargne créé</p>
                </div>
              ) : (
                savingPlans.map((plan, index) => {
                  const percentage = plan.targetAmount > 0 ? (plan.currentAmount / plan.targetAmount) * 100 : 0;
                  return (
                    <div key={plan._id || index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{plan.title}</span>
                        <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>
                      
                      <ProgressBar 
                        value={plan.currentAmount || 0} 
                        max={plan.targetAmount || 1} 
                        color="emerald" 
                      />
                      
                      <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                        <span>
                          {(plan.currentAmount || 0).toLocaleString()} {percentage.toFixed(1)}%
                        </span>
                        <span>{t('target')}: {(plan.targetAmount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default SavingPlans;