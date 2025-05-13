import { Currency } from '../types';

export const currencySymbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  CAD: '$',
  CHF: 'Fr',
  FCFA: 'XOF',
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const symbol = currencySymbols[currency];
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  // Special formatting for JPY and FCFA (no decimal places)
  if (currency === 'JPY' || currency === 'FCFA') {
    options.minimumFractionDigits = 0;
    options.maximumFractionDigits = 0;
  }

  const formattedAmount = new Intl.NumberFormat('en-US', options).format(amount);

  // Position symbol appropriately based on currency
  if (currency === 'USD' || currency === 'CAD') {
    return `${symbol}${formattedAmount}`;
  } else if (currency === 'JPY') {
    return `¥${formattedAmount}`;
  } else {
    return `${formattedAmount} ${symbol}`;
  }
};

export const getCurrencyName = (currency: Currency): string => {
  const currencyNames: Record<Currency, string> = {
    EUR: 'Euro',
    USD: 'US Dollar',
    GBP: 'British Pound',
    JPY: 'Japanese Yen',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    FCFA: 'CFA Franc',
  };
  
  return currencyNames[currency];
};