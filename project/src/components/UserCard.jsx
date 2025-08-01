import React from 'react';
import { Wifi, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';

const UserCard = () => {
  const { t } = useLanguage();

  return (
    <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 relative overflow-hidden animate-fade-in h-full w-full lg:w-[450px]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
      </div>
      
      <div className="absolute top-6 right-6">
        <Wifi className="w-6 h-6 text-white/80" />
      </div>
      
      <div className="absolute top-6 left-6">
        <CreditCard className="w-8 h-8 text-white/60" />
      </div>
      
      <div className="space-y-4 relative z-10">
        <div className="pt-8">
          <h2 className="text-xl font-semibold tracking-wide">Andrew Forbist</h2>
        </div>
        
        <div>
          <p className="text-emerald-100 text-sm">{t('balanceAmount')}</p>
          <p className="text-2xl font-bold tracking-wider">$562.000</p>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="flex space-x-8">
            <div>
              <p className="text-emerald-100 text-xs">EXP</p>
              <p className="text-base font-medium tracking-widest">11/29</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs">CVV</p>
              <p className="text-base font-medium tracking-widest">323</p>
            </div>
          </div>
          <div className="text-right">
            <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
              <div className="w-8 h-5 bg-white rounded-sm opacity-80"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;