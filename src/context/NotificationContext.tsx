import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { NotificationState } from '../types';

// Define action types
type NotificationAction = 
  | { type: 'SHOW_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_NOTIFICATION' };

// Initial state
const initialState: NotificationState = {
  visible: false,
  message: '',
  type: 'info',
};

// Create context
const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case 'SHOW_NOTIFICATION':
      return {
        visible: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
};

// Provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotification = () => {
  const { state, dispatch } = useContext(NotificationContext);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    dispatch({ 
      type: 'SHOW_NOTIFICATION', 
      payload: { message, type } 
    });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION' });
    }, 3000);
  };

  return {
    notification: state,
    showNotification,
    hideNotification: () => dispatch({ type: 'HIDE_NOTIFICATION' }),
  };
};