import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';

const CashflowChart = () => {
  const { t } = useLanguage();

  const data = [
    { month: t('jan'), income: 6000, expense: -4000 },
    { month: t('feb'), income: 5500, expense: -4500 },
    { month: t('mar'), income: 6200, expense: -4200 },
    { month: t('apr'), income: 7000, expense: -4800 },
    { month: t('may'), income: 6800, expense: -4300 },
    { month: t('jun'), income: 7200, expense: -4600 },
    { month: t('jul'), income: 6900, expense: -4100 },
    { month: t('aug'), income: 7500, expense: -4700 },
    { month: t('sep'), income: 8000, expense: -4900 },
    { month: t('oct'), income: 7300, expense: -4400 },
    { month: t('nov'), income: 6700, expense: -4200 },
    { month: t('dec'), income: 7100, expense: -4600 }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('cashflow')}</h3>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalBalance')}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">$562,000</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <span>{t('thisYear')}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name={t('income')} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#a7f3d0" name={t('expense')} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CashflowChart;