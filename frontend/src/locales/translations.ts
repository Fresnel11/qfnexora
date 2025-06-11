import { LanguageCode } from '../types';

type TranslationKey =
  | 'appName'
  | 'dashboard'
  | 'transactions'
  | 'settings'
  | 'totalBalance'
  | 'income'
  | 'expense'
  | 'monthlyIncome'
  | 'monthlyExpenses'
  | 'budget'
  | 'budgetProgress'
  | 'remaining'
  | 'spent'
  | 'addTransaction'
  | 'description'
  | 'amount'
  | 'type'
  | 'category'
  | 'date'
  | 'add'
  | 'search'
  | 'noTransactionsFound'
  | 'delete'
  | 'darkMode'
  | 'lightMode'
  | 'currency'
  | 'language'
  | 'english'
  | 'french'
  | 'monthlyBudget'
  | 'save'
  | 'exportPdf'
  | 'deleteAllData'
  | 'confirmDelete'
  | 'cancel'
  | 'selectMonthYear'
  | 'month'
  | 'year'
  | 'generate'
  | 'transactionAdded'
  | 'transactionDeleted'
  | 'settingsSaved'
  | 'invalidFields'
  | 'confirmDeleteAll'
  | 'food'
  | 'housing'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'salary'
  | 'other'
  | 'financialReport'
  | 'searchByDescriptionOrCategory'
  | 'filterByDate';

type TranslationTable = {
  [key in TranslationKey]: {
    [code in LanguageCode]: string;
  };
};

export const translations: TranslationTable = {
  appName: {
    en: 'Quantum Finance',
    fr: 'Finance Quantique',
  },
  dashboard: {
    en: 'Dashboard',
    fr: 'Tableau de bord',
  },
  transactions: {
    en: 'Transactions',
    fr: 'Transactions',
  },
  settings: {
    en: 'Settings',
    fr: 'Paramètres',
  },
  totalBalance: {
    en: 'Total Balance',
    fr: 'Solde Total',
  },
  income: {
    en: 'Income',
    fr: 'Revenus',
  },
  expense: {
    en: 'Expense',
    fr: 'Dépense',
  },
  monthlyIncome: {
    en: 'Monthly Income',
    fr: 'Revenus Mensuels',
  },
  monthlyExpenses: {
    en: 'Monthly Expenses',
    fr: 'Dépenses Mensuelles',
  },
  budget: {
    en: 'Budget',
    fr: 'Budget',
  },
  budgetProgress: {
    en: 'Budget Progress',
    fr: 'Progression du Budget',
  },
  remaining: {
    en: 'Remaining',
    fr: 'Restant',
  },
  spent: {
    en: 'Spent',
    fr: 'Dépensé',
  },
  addTransaction: {
    en: 'Add Transaction',
    fr: 'Ajouter une Transaction',
  },
  description: {
    en: 'Description',
    fr: 'Description',
  },
  amount: {
    en: 'Amount',
    fr: 'Montant',
  },
  type: {
    en: 'Type',
    fr: 'Type',
  },
  category: {
    en: 'Category',
    fr: 'Catégorie',
  },
  date: {
    en: 'Date',
    fr: 'Date',
  },
  add: {
    en: 'Add',
    fr: 'Ajouter',
  },
  search: {
    en: 'Search',
    fr: 'Rechercher',
  },
  noTransactionsFound: {
    en: 'No transactions found',
    fr: 'Aucune transaction trouvée',
  },
  delete: {
    en: 'Delete',
    fr: 'Supprimer',
  },
  darkMode: {
    en: 'Dark Mode',
    fr: 'Mode Sombre',
  },
  lightMode: {
    en: 'Light Mode',
    fr: 'Mode Clair',
  },
  currency: {
    en: 'Currency',
    fr: 'Devise',
  },
  language: {
    en: 'Language',
    fr: 'Langue',
  },
  english: {
    en: 'English',
    fr: 'Anglais',
  },
  french: {
    en: 'French',
    fr: 'Français',
  },
  monthlyBudget: {
    en: 'Monthly Budget',
    fr: 'Budget Mensuel',
  },
  save: {
    en: 'Save',
    fr: 'Enregistrer',
  },
  exportPdf: {
    en: 'Export PDF',
    fr: 'Exporter en PDF',
  },
  deleteAllData: {
    en: 'Delete All Data',
    fr: 'Supprimer Toutes les Données',
  },
  confirmDelete: {
    en: 'Confirm Delete',
    fr: 'Confirmer la Suppression',
  },
  cancel: {
    en: 'Cancel',
    fr: 'Annuler',
  },
  selectMonthYear: {
    en: 'Select Month and Year',
    fr: 'Sélectionner le Mois et l\'Année',
  },
  month: {
    en: 'Month',
    fr: 'Mois',
  },
  year: {
    en: 'Year',
    fr: 'Année',
  },
  generate: {
    en: 'Generate',
    fr: 'Générer',
  },
  transactionAdded: {
    en: 'Transaction added successfully',
    fr: 'Transaction ajoutée avec succès',
  },
  transactionDeleted: {
    en: 'Transaction deleted successfully',
    fr: 'Transaction supprimée avec succès',
  },
  settingsSaved: {
    en: 'Settings saved successfully',
    fr: 'Paramètres enregistrés avec succès',
  },
  invalidFields: {
    en: 'Please fill in all fields correctly',
    fr: 'Veuillez remplir tous les champs correctement',
  },
  confirmDeleteAll: {
    en: 'Are you sure you want to delete all data? This action cannot be undone.',
    fr: 'Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action ne peut pas être annulée.',
  },
  food: {
    en: 'Food',
    fr: 'Alimentation',
  },
  housing: {
    en: 'Housing',
    fr: 'Logement',
  },
  transport: {
    en: 'Transport',
    fr: 'Transport',
  },
  entertainment: {
    en: 'Entertainment',
    fr: 'Divertissement',
  },
  health: {
    en: 'Health',
    fr: 'Santé',
  },
  education: {
    en: 'Education',
    fr: 'Éducation',
  },
  salary: {
    en: 'Salary',
    fr: 'Salaire',
  },
  other: {
    en: 'Other',
    fr: 'Autre',
  },
  financialReport: {
    en: 'Financial Report',
    fr: 'Rapport Financier',
  },
  searchByDescriptionOrCategory: {
    en: 'Search by description or category',
    fr: 'Rechercher par description ou catégorie',
  },
  filterByDate: {
    en: 'Filter by date',
    fr: 'Filtrer par date',
  },
};

export const useTranslation = () => {
  const getTranslation = (key: TranslationKey, language: LanguageCode): string => {
    // Default to 'en' if language is undefined or not supported
    const validLanguage = language && translations[key][language] ? language : 'en';
    // Return the translation or the key if not found
    return translations[key][validLanguage] || key;
  };

  return { getTranslation };
};