import React from 'react';
import { DollarSign, TrendingUp, PiggyBank } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useFinance } from '../store/FinanceContext';
import UserCard from './UserCard';
import MetricCard from './MetricCard';
import QuickActions from './QuickActions';
import DailyLimit from './DailyLimit';
import SavingPlans from './SavingPlans';
import CashflowChart from './CashflowChart';
import RecentTransactions from './RecentTransactions';
import StatisticsChart from './StatisticsChart';
import RecentActivity from './RecentActivity';
import ProCard from './ProCard';
import ProgressBar from '../ui/ProgressBar';
import ReloadButton from './ReloadButton';

const Dashboard = () => {
  const { t } = useLanguage();
  const { totalIncome, totalExpense, balance, loading } = useFinance();

  // Fonction pour formater le montant
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const metrics = [
    {
      title: 'totalIncome',
      amount: loading ? '...' : formatAmount(totalIncome),
      change: '+0%',
      changeType: 'positive',
      icon: TrendingUp,
      iconColor: 'bg-emerald-500'
    },
    {
      title: 'totalExpense',
      amount: loading ? '...' : formatAmount(totalExpense),
      change: '+0%',
      changeType: 'negative',
      icon: DollarSign,
      iconColor: 'bg-red-500'
    },
    {
      title: 'totalBalance',
      amount: loading ? '...' : formatAmount(balance),
      change: '+0%',
      changeType: 'positive',
      icon: PiggyBank,
      iconColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto pt-20">
      {/* Indicateur de chargement global */}
      {loading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Chargement des données...</span>
        </div>
      )}
      
      <div className="w-full px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-3 space-y-6">
            {/* Top Section - All cards on same line */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
              <div className="xl:col-span-2">
                <UserCard />
              </div>
              {metrics.map((metric, index) => (
                <div key={index} className="xl:col-span-1">
                  <MetricCard {...metric} delay={(index + 1) * 100} />
                </div>
              ))}

              <div className="hidden xl:block xl:col-start-3 xl:col-span-3 -mt-[80px]">
                <QuickActions />
              </div>
            </div>



            {/* Cashflow Chart */}
            <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
              <CashflowChart />
            </div>

            {/* Recent Transactions */}
            <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
              <RecentTransactions />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 xl:col-span-1">
            <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
              <DailyLimit />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
              <SavingPlans />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
              <StatisticsChart />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
              <RecentActivity />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
              <ProCard />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bouton de rechargement */}
      <ReloadButton />
    </div>
  );
};

export default Dashboard;