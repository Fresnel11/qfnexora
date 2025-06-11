import React, { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { FinanceState, Transaction, Currency, LanguageCode } from '../types';

// Define action types
type ActionType = 
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: number }
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'SET_BUDGET'; payload: number }
  | { type: 'SET_LANGUAGE'; payload: LanguageCode }
  | { type: 'TOGGLE_THEME' }
  | { type: 'DELETE_ALL_DATA' };

// Initial state
const initialState: FinanceState = {
  transactions: [],
  currency: 'EUR',
  budget: 1000,
  language: 'fr',
  darkMode: true,
};

// Load state from localStorage
const loadState = (): FinanceState => {
  try {
    const savedState = localStorage.getItem('financeState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error);
  }
  return initialState;
};

// Create context
const FinanceContext = createContext<{
  state: FinanceState;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const financeReducer = (state: FinanceState, action: ActionType): FinanceState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload,
      };
    case 'SET_BUDGET':
      return {
        ...state,
        budget: action.payload,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    case 'DELETE_ALL_DATA':
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, loadState());

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('financeState', JSON.stringify(state));
    
    // Apply dark mode class to body
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook to use finance context
export const useFinance = () => useContext(FinanceContext);