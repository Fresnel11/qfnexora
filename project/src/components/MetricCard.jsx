import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';

const MetricCard = ({ title, amount, change, changeType, icon: Icon, iconColor, delay = 0 }) => {
  const { t } = useLanguage();
  
  const isPositive = changeType === 'positive';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <Card className="p-6 relative animate-slide-up hover:shadow-lg transition-all duration-300 hover:-translate-y-1" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor} transition-transform hover:scale-110`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-1">
              <TrendIcon className={`w-4 h-4 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change}
              </span>
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{amount}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t(title)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;