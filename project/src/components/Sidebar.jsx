import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowLeftRight, 
  FileText, 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  Mail, 
  Tag, 
  BarChart3,
  X
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../ui/Button';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { t } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), active: true },
    { icon: CreditCard, label: t('payments') },
    { icon: ArrowLeftRight, label: t('transactions') },
    { icon: FileText, label: t('invoices') },
    { icon: Wallet, label: t('cards') },
    { icon: PiggyBank, label: t('savingPlans') },
    { icon: TrendingUp, label: t('investments') },
    { icon: Mail, label: t('inbox'), badge: 27 },
    { icon: Tag, label: t('promos') },
    { icon: BarChart3, label: t('insights') }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className={`w-64 bg-gray-50 dark:bg-gray-900 h-screen border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 z-50 overflow-y-auto transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8 pt-16">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">CASHTRACK</span>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <div key={index} className="relative animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                item.active 
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}>
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </nav>
      </div>
      </div>
    </>
  );
};

export default Sidebar;