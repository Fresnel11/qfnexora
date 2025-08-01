import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Card from '../ui/Card';

const RecentActivity = () => {
  const { t } = useLanguage();

  const activities = [
    {
      user: 'Jamie Smith',
      action: t('jamieUpdated'),
      time: '16:05',
      avatar: 'JS',
      day: 'today'
    },
    {
      user: 'Alex Johnson',
      action: t('alexLoggedIn'),
      time: '15:05',
      avatar: 'AJ',
      day: 'today'
    },
    {
      user: 'Morgan Lee',
      action: t('morganAdded'),
      time: '12:05',
      avatar: 'ML',
      day: 'today'
    },
    {
      user: 'Taylor Green',
      action: t('taylorReviewed'),
      time: '09:05',
      avatar: 'TG',
      day: 'yesterday'
    },
    {
      user: 'Wilson Baptista',
      action: t('wilsonTransferred'),
      time: '09:05',
      avatar: 'WB',
      day: 'yesterday'
    }
  ];

  const groupedActivities = activities.reduce((acc, activity) => {
    const day = activity.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(activity);
    return acc;
  }, {});

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('recentActivity')}</h3>
        <MoreHorizontal className="w-5 h-5 text-gray-400 cursor-pointer" />
      </div>
      
      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([day, dayActivities]) => (
          <div key={day}>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 capitalize">
              {t(day)}
            </h4>
            <div className="space-y-3">
              {dayActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">{activity.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;