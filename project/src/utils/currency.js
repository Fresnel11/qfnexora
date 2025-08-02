// Configuration des devises supportées
export const currencies = [
  { code: 'XOF', symbol: 'CFA', name: 'Franc CFA' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
];

// Fonction pour formater un montant selon la devise
export const formatCurrency = (amount, currency = 'XOF') => {
  if (amount === null || amount === undefined) return '0';
  
  const currencyConfig = currencies.find(c => c.code === currency) || currencies[0];
  
  // Formatage spécial pour XOF (pas de décimales)
  if (currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  // Formatage standard pour les autres devises
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Fonction pour obtenir le symbole d'une devise
export const getCurrencySymbol = (currency = 'XOF') => {
  const currencyConfig = currencies.find(c => c.code === currency);
  return currencyConfig ? currencyConfig.symbol : 'CFA';
};

// Fonction pour obtenir le nom d'une devise
export const getCurrencyName = (currency = 'XOF') => {
  const currencyConfig = currencies.find(c => c.code === currency);
  return currencyConfig ? currencyConfig.name : 'Franc CFA';
}; 