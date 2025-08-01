import React, { createContext, useContext, useReducer, useEffect } from 'react';
import transactionService, { TransactionError } from '../services/transactionService';
import savingPlanService, { SavingPlanError } from '../services/savingPlanService';

// Types d'actions
const FINANCE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_BALANCE: 'SET_BALANCE',
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_SAVING_PLANS: 'SET_SAVING_PLANS',
  SET_TOTAL_SAVINGS: 'SET_TOTAL_SAVINGS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION'
};

// État initial
const initialState = {
  balance: 0,
  totalIncome: 0,
  totalExpense: 0,
  transactionCount: 0,
  transactions: [],
  recentTransactions: [],
  savingPlans: [],
  totalSavings: {
    totalCurrent: 0,
    totalTarget: 0,
    totalPercentage: 0,
    activePlans: 0,
    totalPlans: 0
  },
  loading: false,
  error: null
};

// Reducer pour gérer les actions
const financeReducer = (state, action) => {
  switch (action.type) {
    case FINANCE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case FINANCE_ACTIONS.SET_BALANCE:
      return {
        ...state,
        balance: action.payload.balance,
        totalIncome: action.payload.totalIncome,
        totalExpense: action.payload.totalExpense,
        transactionCount: action.payload.transactionCount,
        error: null
      };
    
    case FINANCE_ACTIONS.SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
        error: null
      };
    
    case FINANCE_ACTIONS.SET_SAVING_PLANS:
      return {
        ...state,
        savingPlans: action.payload,
        error: null
      };
    
    case FINANCE_ACTIONS.SET_TOTAL_SAVINGS:
      return {
        ...state,
        totalSavings: action.payload,
        error: null
      };
    
    case FINANCE_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case FINANCE_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case FINANCE_ACTIONS.ADD_TRANSACTION:
      const newTransaction = action.payload;
      const updatedTransactions = [newTransaction, ...state.transactions];
      
      // Recalculer le solde
      let newBalance = state.balance;
      if (newTransaction.nature === 'income') {
        newBalance += newTransaction.amount;
      } else if (newTransaction.nature === 'expense') {
        newBalance -= newTransaction.amount;
      }
      
      return {
        ...state,
        transactions: updatedTransactions,
        balance: newBalance,
        transactionCount: state.transactionCount + 1
      };
    
    case FINANCE_ACTIONS.UPDATE_TRANSACTION:
      const { transactionId, updatedTransaction } = action.payload;
      const updatedTransactionsList = state.transactions.map(t => 
        t._id === transactionId ? updatedTransaction : t
      );
      
      // Recalculer le solde complet
      let totalIncome = 0;
      let totalExpense = 0;
      updatedTransactionsList.forEach(transaction => {
        if (transaction.nature === 'income') {
          totalIncome += transaction.amount;
        } else if (transaction.nature === 'expense') {
          totalExpense += transaction.amount;
        }
      });
      
      return {
        ...state,
        transactions: updatedTransactionsList,
        balance: totalIncome - totalExpense,
        totalIncome,
        totalExpense
      };
    
    case FINANCE_ACTIONS.DELETE_TRANSACTION:
      const { deletedTransactionId } = action.payload;
      const filteredTransactions = state.transactions.filter(t => t._id !== deletedTransactionId);
      
      // Recalculer le solde complet
      let newTotalIncome = 0;
      let newTotalExpense = 0;
      filteredTransactions.forEach(transaction => {
        if (transaction.nature === 'income') {
          newTotalIncome += transaction.amount;
        } else if (transaction.nature === 'expense') {
          newTotalExpense += transaction.amount;
        }
      });
      
      return {
        ...state,
        transactions: filteredTransactions,
        balance: newTotalIncome - newTotalExpense,
        totalIncome: newTotalIncome,
        totalExpense: newTotalExpense,
        transactionCount: state.transactionCount - 1
      };
    
    default:
      return state;
  }
};

// Créer le contexte
const FinanceContext = createContext();

// Provider du contexte
export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  // Actions financières
  const financeActions = {
    // Charger les données financières de l'utilisateur
    loadUserFinanceData: async () => {
      console.log('FinanceContext - Chargement des données financières...');
      dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_ACTIONS.CLEAR_ERROR });
      
      try {
        console.log('FinanceContext - Appel getUserBalance...');
        const balanceData = await transactionService.getUserBalance();
        console.log('FinanceContext - Balance data reçue:', balanceData);
        dispatch({ type: FINANCE_ACTIONS.SET_BALANCE, payload: balanceData });
        
        console.log('FinanceContext - Appel getUserTransactions...');
        const transactions = await transactionService.getUserTransactions();
        console.log('FinanceContext - Transactions reçues:', transactions);
        dispatch({ type: FINANCE_ACTIONS.SET_TRANSACTIONS, payload: transactions });
        
        dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: false });
      } catch (error) {
        console.error('FinanceContext - Erreur:', error);
        const message = error instanceof TransactionError ? error.message : 'Erreur lors du chargement des données financières';
        dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: message });
      }
    },

    // Créer une nouvelle transaction
    createTransaction: async (transactionData) => {
      dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_ACTIONS.CLEAR_ERROR });
      
      try {
        const newTransaction = await transactionService.createTransaction(transactionData);
        
        // Recharger les données complètes pour s'assurer de la cohérence
        const balanceData = await transactionService.getUserBalance();
        const transactions = await transactionService.getUserTransactions();
        
        dispatch({ type: FINANCE_ACTIONS.SET_BALANCE, payload: balanceData });
        dispatch({ type: FINANCE_ACTIONS.SET_TRANSACTIONS, payload: transactions });
        dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: false });
        
        return { success: true, transaction: newTransaction };
      } catch (error) {
        const message = error instanceof TransactionError ? error.message : 'Erreur lors de la création de la transaction';
        dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Mettre à jour une transaction
    updateTransaction: async (transactionId, transactionData) => {
      dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_ACTIONS.CLEAR_ERROR });
      
      try {
        const updatedTransaction = await transactionService.updateTransaction(transactionId, transactionData);
        dispatch({ 
          type: FINANCE_ACTIONS.UPDATE_TRANSACTION, 
          payload: { transactionId, updatedTransaction } 
        });
        dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: false });
        return { success: true, transaction: updatedTransaction };
      } catch (error) {
        const message = error instanceof TransactionError ? error.message : 'Erreur lors de la mise à jour de la transaction';
        dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Supprimer une transaction
    deleteTransaction: async (transactionId) => {
      dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: FINANCE_ACTIONS.CLEAR_ERROR });
      
      try {
        await transactionService.deleteTransaction(transactionId);
        dispatch({ type: FINANCE_ACTIONS.DELETE_TRANSACTION, payload: { deletedTransactionId: transactionId } });
        dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: false });
        return { success: true };
      } catch (error) {
        const message = error instanceof TransactionError ? error.message : 'Erreur lors de la suppression de la transaction';
        dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Effacer l'erreur
    clearError: () => {
      dispatch({ type: FINANCE_ACTIONS.CLEAR_ERROR });
    },

    // Recharger les données financières
    reloadData: async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: FINANCE_ACTIONS.CLEAR_ERROR });
        
        try {
          console.log('FinanceContext - Rechargement des données...');
          const [balanceData, transactions, savingPlans, totalSavings] = await Promise.all([
            transactionService.getUserBalance(),
            transactionService.getUserTransactions(),
            savingPlanService.getUserSavingPlans(),
            savingPlanService.getTotalSavings()
          ]);
          
          dispatch({ type: FINANCE_ACTIONS.SET_BALANCE, payload: balanceData });
          dispatch({ type: FINANCE_ACTIONS.SET_TRANSACTIONS, payload: transactions });
          dispatch({ type: FINANCE_ACTIONS.SET_SAVING_PLANS, payload: savingPlans });
          dispatch({ type: FINANCE_ACTIONS.SET_TOTAL_SAVINGS, payload: totalSavings });
          dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: false });
        } catch (error) {
          console.error('FinanceContext - Erreur lors du rechargement:', error);
          const message = error instanceof TransactionError || error instanceof SavingPlanError ? error.message : 'Erreur lors du rechargement des données';
          dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: message });
        }
      }
    }
  };

  const value = {
    ...state,
    ...financeActions
  };

  // Charger les données financières au montage du composant
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté avant de charger les données
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('FinanceProvider - Token trouvé, chargement des données...');
      // Appeler directement la fonction au lieu de passer par financeActions
      const loadData = async () => {
        dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: FINANCE_ACTIONS.CLEAR_ERROR });
        
        try {
          console.log('FinanceContext - Appel getUserBalance...');
          const balanceData = await transactionService.getUserBalance();
          console.log('FinanceContext - Balance data reçue:', balanceData);
          dispatch({ type: FINANCE_ACTIONS.SET_BALANCE, payload: balanceData });
          
          console.log('FinanceContext - Appel getUserTransactions...');
          const transactions = await transactionService.getUserTransactions();
          console.log('FinanceContext - Transactions reçues:', transactions);
          dispatch({ type: FINANCE_ACTIONS.SET_TRANSACTIONS, payload: transactions });
          
          console.log('FinanceContext - Appel getUserSavingPlans...');
          const savingPlans = await savingPlanService.getUserSavingPlans();
          console.log('FinanceContext - Plans d\'épargne reçus:', savingPlans);
          dispatch({ type: FINANCE_ACTIONS.SET_SAVING_PLANS, payload: savingPlans });
          
          console.log('FinanceContext - Appel getTotalSavings...');
          const totalSavings = await savingPlanService.getTotalSavings();
          console.log('FinanceContext - Total épargne reçu:', totalSavings);
          dispatch({ type: FINANCE_ACTIONS.SET_TOTAL_SAVINGS, payload: totalSavings });
          
          dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: false });
        } catch (error) {
          console.error('FinanceContext - Erreur:', error);
          const message = error instanceof TransactionError || error instanceof SavingPlanError ? error.message : 'Erreur lors du chargement des données financières';
          dispatch({ type: FINANCE_ACTIONS.SET_ERROR, payload: message });
        }
      };
      
      loadData();
    } else {
      console.log('FinanceProvider - Aucun token trouvé, pas de chargement des données');
    }
  }, []);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance doit être utilisé dans un FinanceProvider');
  }
  return context;
};

export { useFinance }; 