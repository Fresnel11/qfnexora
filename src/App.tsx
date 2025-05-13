import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Transactions from './components/Transactions/Transactions';
import Settings from './components/Settings/Settings';

function App() {
  return (
    <Router>
      <FinanceProvider>
        <NotificationProvider>
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </NotificationProvider>
      </FinanceProvider>
    </Router>
  );
}

export default App;