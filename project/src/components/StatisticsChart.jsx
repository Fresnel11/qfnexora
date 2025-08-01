import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';

const StatisticsChart = () => {
  const { t } = useLanguage();

  const data = [
    { name: t('rentLiving'), value: 60, amount: 2100, color: '#10b981' },
    { name: t('investment'), value: 15, amount: 525, color: '#a7f3d0' },
    { name: t('education'), value: 12, amount: 420, color: '#6ee7b7' },
    { name: t('foodDrink'), value: 8, amount: 280, color: '#34d399' },
    { name: t('entertainmentStat'), value: 5, amount: 175, color: '#059669' }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('statistic')}</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <span>{t('thisMonth')}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalExpenseChart')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$3,500</p>
        </div>
        
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full space-y-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">${item.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StatisticsChart;