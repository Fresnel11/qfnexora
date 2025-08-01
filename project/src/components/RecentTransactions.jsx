import React from 'react';
import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const RecentTransactions = () => {
  const { t } = useLanguage();

  const transactions = [
    {
      name: t('electricityBill'),
      category: t('payments'),
      date: '2028-03-01',
      time: '04:28:48',
      amount: '$295.81',
      note: t('monthlyElectricityPayment'),
      status: 'failed'
    },
    {
      name: t('weeklyGroceries'),
      category: t('shopping'),
      date: '2028-03-04',
      time: '04:28:48',
      amount: '$204.07',
      note: t('groceriesLocal'),
      status: 'completed'
    },
    {
      name: t('movieNight'),
      category: t('entertainment'),
      date: '2028-02-27',
      time: '04:28:48',
      amount: '$97.84',
      note: t('movieTickets'),
      status: 'pending'
    },
    {
      name: t('medicalCheckup'),
      category: t('healthcare'),
      date: '2028-02-07',
      time: '04:28:48',
      amount: '$323.33',
      note: t('healthCheckup'),
      status: 'pending'
    },
    {
      name: t('dinnerItalian'),
      category: t('diningOut'),
      date: '2028-02-11',
      time: '04:28:48',
      amount: '$226.25',
      note: t('familyDinner'),
      status: 'pending'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">{t('completed')}</Badge>;
      case 'failed':
        return <Badge variant="error">{t('failed')}</Badge>;
      case 'pending':
        return <Badge variant="warning">{t('pending')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentTransactions')}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
            <span>{t('thisMonth')}</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <ArrowUpDown className="w-4 h-4 text-gray-400 cursor-pointer" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('transactionName')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('dateTime')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('amount')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('note')}
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                {t('status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{transaction.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.category}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">{transaction.date}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.time}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{transaction.amount}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{transaction.note}</span>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(transaction.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentTransactions;