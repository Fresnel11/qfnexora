import { Transaction, TransactionType } from '../types';

export const getCurrentMonthYear = (): { month: number; year: number } => {
  const date = new Date();
  return {
    month: date.getMonth() + 1, // January is 0
    year: date.getFullYear(),
  };
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const getCurrentDateISOString = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const filterTransactionsByMonth = (
  transactions: Transaction[],
  month: number,
  year: number
): Transaction[] => {
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });
};

export const calculateTotalByType = (
  transactions: Transaction[],
  type: TransactionType
): number => {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((acc, transaction) => acc + transaction.amount, 0);
};

export const calculateBalance = (transactions: Transaction[]): number => {
  const totalIncome = calculateTotalByType(transactions, 'income');
  const totalExpense = calculateTotalByType(transactions, 'expense');
  return totalIncome - totalExpense;
};

export const calculateMonthlyTotals = (
  transactions: Transaction[]
): { income: number; expense: number } => {
  const { month, year } = getCurrentMonthYear();
  const monthlyTransactions = filterTransactionsByMonth(transactions, month, year);

  return {
    income: calculateTotalByType(monthlyTransactions, 'income'),
    expense: calculateTotalByType(monthlyTransactions, 'expense'),
  };
};

export const calculateBudgetProgress = (
  transactions: Transaction[],
  budget: number
): { spent: number; remaining: number; percentage: number } => {
  const { month, year } = getCurrentMonthYear();
  const monthlyTransactions = filterTransactionsByMonth(transactions, month, year);
  const spent = calculateTotalByType(monthlyTransactions, 'expense');
  const remaining = Math.max(0, budget - spent);
  const percentage = Math.min(100, (spent / budget) * 100);

  return { spent, remaining, percentage };
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};