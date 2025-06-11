import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Notification from '../UI/Notification';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={`min-h-screen bg-light dark:bg-dark transition-colors duration-300`}>
      <Header />
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Sidebar />
          <main className="flex-1 p-4 bg-white dark:bg-dark glass rounded-lg shadow-md min-h-[calc(100vh-8rem)]">
            {children}
          </main>
        </div>
      </div>
      
      <Notification />
    </div>
  );
};

export default Layout;