import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';

const Notification: React.FC = () => {
  const { notification, hideNotification } = useNotification();
  
  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <AnimatePresence>
      {notification.visible && (
        <motion.div
          className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-md text-white shadow-lg z-50 ${getBackgroundColor()}`}
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="flex justify-between items-center">
            <p className="pr-4">{notification.message}</p>
            <button
              onClick={hideNotification}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;