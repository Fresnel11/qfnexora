import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    payments: 'Payments',
    transactions: 'Transactions',
    invoices: 'Invoices',
    cards: 'Cards',
    savingPlans: 'Saving Plans',
    investments: 'Investments',
    inbox: 'Inbox',
    promos: 'Promos',
    insights: 'Insights',
    
    // Search
    searchPlaceholder: 'Search placeholder',
    
    // User Card
    balanceAmount: 'Balance Amount',
    
    // Metrics
    totalIncome: 'Total Income',
    totalExpense: 'Total Expense',
    totalSavings: 'Total Savings',
    
    // Quick Actions
    topUp: 'Top Up',
    transfer: 'Transfer',
    request: 'Request',
    history: 'History',
    
    // Daily Limit
    dailyLimit: 'Daily Limit',
    spent: 'spent',
    of: 'of',
    
    // Saving Plans
    addPlan: 'Add Plan',
    emergencyFund: 'Emergency Fund',
    vacationFund: 'Vacation Fund',
    homeDownPayment: 'Home Down Payment',
    target: 'Target',
    
    // Cashflow
    cashflow: 'Cashflow',
    totalBalance: 'Total Balance',
    thisYear: 'This Year',
    income: 'Income',
    expense: 'Expense',
    
    // Recent Transactions
    recentTransactions: 'Recent Transactions',
    thisMonth: 'This Month',
    transactionName: 'Transaction Name',
    dateTime: 'Date & Time',
    amount: 'Amount',
    note: 'Note',
    status: 'Status',
    
    // Transaction entries
    electricityBill: 'Electricity Bill',
    weeklyGroceries: 'Weekly Groceries',
    movieNight: 'Movie Night',
    medicalCheckup: 'Medical Check-up',
    dinnerItalian: 'Dinner at Italian Restaurant',
    
    // Transaction categories
    payments: 'Payments',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    healthcare: 'Healthcare',
    diningOut: 'Dining Out',
    
    // Transaction notes
    monthlyElectricityPayment: 'Payment for monthly electricity bill',
    groceriesLocal: 'Groceries shopping at local supermarket',
    movieTickets: 'Tickets for movies and snacks',
    healthCheckup: 'Routine health check-up and medications',
    familyDinner: 'Dining out with family at a local Italian restaurant',
    
    // Status
    failed: 'Failed',
    completed: 'Completed',
    pending: 'Pending',
    
    // Statistics
    statistic: 'Statistic',
    totalExpenseChart: 'Total Expense',
    rentLiving: 'Rent & Living',
    investment: 'Investment',
    education: 'Education',
    foodDrink: 'Food & Drink',
    entertainmentStat: 'Entertainment',
    
    // Recent Activity
    recentActivity: 'Recent Activity',
    today: 'Today',
    yesterday: 'Yesterday',
    
    // Activity entries
    jamieUpdated: 'Jamie Smith updated account settings',
    alexLoggedIn: 'Alex Johnson logged in',
    morganAdded: 'Morgan Lee added a new savings goal for vacation',
    taylorReviewed: 'Taylor Green reviewed recent transactions',
    wilsonTransferred: 'Wilson Baptista transferred funds to emergency fund',
    
    // Footer
    copyright: 'Copyright © 2024 Peterdraw',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms and Conditions',
    contact: 'Contact',
    
    // Pro card
    proTitle: 'Gain full access to your finances with detailed analytics and graphs',
    getPro: 'Get Pro',
    
    // Months
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec'
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de Bord',
    payments: 'Paiements',
    transactions: 'Transactions',
    invoices: 'Factures',
    cards: 'Cartes',
    savingPlans: 'Plans d\'Épargne',
    investments: 'Investissements',
    inbox: 'Boîte de Réception',
    promos: 'Promotions',
    insights: 'Analyses',
    
    // Search
    searchPlaceholder: 'Rechercher...',
    
    // User Card
    balanceAmount: 'Solde',
    
    // Metrics
    totalIncome: 'Revenus Totaux',
    totalExpense: 'Dépenses Totales',
    totalSavings: 'Épargne Totale',
    
    // Quick Actions
    topUp: 'Recharger',
    transfer: 'Transférer',
    request: 'Demander',
    history: 'Historique',
    
    // Daily Limit
    dailyLimit: 'Limite Quotidienne',
    spent: 'dépensé',
    of: 'sur',
    
    // Saving Plans
    addPlan: 'Ajouter un Plan',
    emergencyFund: 'Fonds d\'Urgence',
    vacationFund: 'Fonds Vacances',
    homeDownPayment: 'Acompte Maison',
    target: 'Objectif',
    
    // Cashflow
    cashflow: 'Flux de Trésorerie',
    totalBalance: 'Solde Total',
    thisYear: 'Cette Année',
    income: 'Revenus',
    expense: 'Dépenses',
    
    // Recent Transactions
    recentTransactions: 'Transactions Récentes',
    thisMonth: 'Ce Mois-ci',
    transactionName: 'Nom de la Transaction',
    dateTime: 'Date et Heure',
    amount: 'Montant',
    note: 'Note',
    status: 'Statut',
    
    // Transaction entries
    electricityBill: 'Facture d\'Électricité',
    weeklyGroceries: 'Courses Hebdomadaires',
    movieNight: 'Soirée Cinéma',
    medicalCheckup: 'Examen Médical',
    dinnerItalian: 'Dîner au Restaurant Italien',
    
    // Transaction categories
    payments: 'Paiements',
    shopping: 'Achats',
    entertainment: 'Divertissement',
    healthcare: 'Santé',
    diningOut: 'Restaurant',
    
    // Transaction notes
    monthlyElectricityPayment: 'Paiement de la facture mensuelle d\'électricité',
    groceriesLocal: 'Courses au supermarché local',
    movieTickets: 'Billets de cinéma et collations',
    healthCheckup: 'Examen de santé de routine et médicaments',
    familyDinner: 'Dîner en famille dans un restaurant italien local',
    
    // Status
    failed: 'Échec',
    completed: 'Terminé',
    pending: 'En Attente',
    
    // Statistics
    statistic: 'Statistiques',
    totalExpenseChart: 'Total des Dépenses',
    rentLiving: 'Loyer et Vie',
    investment: 'Investissement',
    education: 'Éducation',
    foodDrink: 'Nourriture et Boisson',
    entertainmentStat: 'Divertissement',
    
    // Recent Activity
    recentActivity: 'Activité Récente',
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    
    // Activity entries
    jamieUpdated: 'Jamie Smith a mis à jour les paramètres du compte',
    alexLoggedIn: 'Alex Johnson s\'est connecté',
    morganAdded: 'Morgan Lee a ajouté un nouvel objectif d\'épargne pour les vacances',
    taylorReviewed: 'Taylor Green a examiné les transactions récentes',
    wilsonTransferred: 'Wilson Baptista a transféré des fonds vers le fonds d\'urgence',
    
    // Footer
    copyright: 'Copyright © 2024 Peterdraw',
    privacyPolicy: 'Politique de Confidentialité',
    termsConditions: 'Termes et Conditions',
    contact: 'Contact',
    
    // Pro card
    proTitle: 'Accédez pleinement à vos finances avec des analyses et graphiques détaillés',
    getPro: 'Obtenir Pro',
    
    // Months
    jan: 'Jan',
    feb: 'Fév',
    mar: 'Mar',
    apr: 'Avr',
    may: 'Mai',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aoû',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Déc'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};