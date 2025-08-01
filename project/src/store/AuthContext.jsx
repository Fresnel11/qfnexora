import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService, { AuthError } from '../services/authService';

// Types d'actions
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  VERIFY_EMAIL_SUCCESS: 'VERIFY_EMAIL_SUCCESS'
};

// État initial
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registerSuccess: false
};

// Reducer pour gérer les actions
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState
      };
    
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        registerSuccess: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case AUTH_ACTIONS.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        registerSuccess: false,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

// Créer le contexte
const AuthContext = createContext();

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        if (user) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        } else {
          // Token invalide, déconnecter
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };

    checkAuth();
  }, []);

  // Actions d'authentification
  const authActions = {
    // Inscription
    register: async (userData) => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      try {
        await authService.register(userData);
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
        return { success: true };
      } catch (error) {
        const message = error instanceof AuthError ? error.message : 'Erreur lors de l\'inscription';
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Connexion
    login: async (email, password) => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      try {
        const result = await authService.login(email, password);
        dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: result });
        return { success: true, user: result.user };
      } catch (error) {
        const message = error instanceof AuthError ? error.message : 'Erreur lors de la connexion';
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Vérification email
    verifyEmail: async (email, otpCode) => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      try {
        await authService.verifyEmail(email, otpCode);
        dispatch({ type: AUTH_ACTIONS.VERIFY_EMAIL_SUCCESS });
        return { success: true };
      } catch (error) {
        const message = error instanceof AuthError ? error.message : 'Erreur lors de la vérification';
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Renvoi OTP
    resendOtp: async (email) => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      try {
        await authService.resendOtp(email);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true };
      } catch (error) {
        const message = error instanceof AuthError ? error.message : 'Erreur lors de l\'envoi du code';
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Déconnexion
    logout: async () => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      try {
        await authService.logout();
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    },

    // Changement de mot de passe
    changePassword: async (currentPassword, newPassword) => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      try {
        await authService.changePassword(currentPassword, newPassword);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true };
      } catch (error) {
        const message = error instanceof AuthError ? error.message : 'Erreur lors du changement de mot de passe';
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Mot de passe oublié
    forgotPassword: async (email) => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      try {
        await authService.forgotPassword(email);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true };
      } catch (error) {
        const message = error instanceof AuthError ? error.message : 'Erreur lors de la demande de réinitialisation';
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Réinitialisation de mot de passe
    resetPassword: async (email, otpCode, newPassword) => {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
      
      try {
        await authService.resetPassword(email, otpCode, newPassword);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return { success: true };
      } catch (error) {
        const message = error instanceof AuthError ? error.message : 'Erreur lors de la réinitialisation';
        dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: message });
        return { success: false, error: message };
      }
    },

    // Actualisation du token
    refreshToken: async () => {
      try {
        const result = await authService.refreshToken();
        const user = authService.getCurrentUser();
        if (user) {
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
        }
        return result;
      } catch (error) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        throw error;
      }
    },

    // Effacer l'erreur
    clearError: () => {
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }
  };

  const value = {
    ...state,
    ...authActions
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}; 