import React from 'react';
import { DollarSign, TrendingUp, PiggyBank } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
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

const Dashboard = () => {
  const { t } = useLanguage();

  const metrics = [
    {
      title: 'totalIncome',
      amount: '$78,000',
      change: '+17.8%',
      changeType: 'positive',
      icon: TrendingUp,
      iconColor: 'bg-emerald-500'
    },
    {
      title: 'totalExpense',
      amount: '$43,000',
      change: '-17.8%',
      changeType: 'negative',
      icon: DollarSign,
      iconColor: 'bg-red-500'
    },
    {
      title: 'totalSavings',
      amount: '$56,000',
      change: '+13.6%',
      changeType: 'positive',
      icon: PiggyBank,
      iconColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto pt-20">
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
    </div>
  );
};

export default Dashboard;