export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'food'
  | 'housing'
  | 'transport'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'salary'
  | 'other';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CAD' | 'CHF' | 'FCFA';

export type LanguageCode = 'en' | 'fr';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
}

export interface FinanceState {
  transactions: Transaction[];
  currency: Currency;
  budget: number;
  language: LanguageCode;
  darkMode: boolean;
}

export interface NotificationState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}