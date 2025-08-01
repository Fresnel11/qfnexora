import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col lg:ml-64">
              <Dashboard />
              <Footer />
            </div>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;