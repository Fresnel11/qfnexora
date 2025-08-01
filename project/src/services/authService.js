import api from './api';

// Types d'erreurs personnalisées
export class AuthError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

// Service d'authentification
const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   * @param {Object} userData - Données utilisateur
   * @returns {Promise<Object>} Réponse du serveur
   */
  async register(userData) {
    try {
      console.log('authService.register - URL:', api.defaults.baseURL + '/auth/register');
      console.log('authService.register - Données:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('authService.register - Réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error('authService.register - Erreur:', error);
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de l\'inscription', 500);
    }
  },

  /**
   * Connexion utilisateur
   * @param {string} email - Email utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Données utilisateur et tokens
   */
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      // Stocker les tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      return { user, accessToken, refreshToken };
    } catch (error) {
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de la connexion', 500);
    }
  },

  /**
   * Vérification de l'email avec OTP
   * @param {string} email - Email utilisateur
   * @param {string} otpCode - Code OTP
   * @returns {Promise<Object>} Réponse du serveur
   */
  async verifyEmail(email, otpCode) {
    try {
      const response = await api.post('/auth/verify-email', { email, otpCode });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de la vérification', 500);
    }
  },

  /**
   * Renvoi du code OTP
   * @param {string} email - Email utilisateur
   * @returns {Promise<Object>} Réponse du serveur
   */
  async resendOtp(email) {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de l\'envoi du code', 500);
    }
  },

  /**
   * Déconnexion utilisateur
   * @returns {Promise<Object>} Réponse du serveur
   */
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      
      // Supprimer les tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      return response.data;
    } catch (error) {
      // Même en cas d'erreur, supprimer les tokens locaux
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de la déconnexion', 500);
    }
  },

  /**
   * Changement de mot de passe
   * @param {string} currentPassword - Mot de passe actuel
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise<Object>} Réponse du serveur
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors du changement de mot de passe', 500);
    }
  },

  /**
   * Demande de réinitialisation de mot de passe
   * @param {string} email - Email utilisateur
   * @returns {Promise<Object>} Réponse du serveur
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de la demande de réinitialisation', 500);
    }
  },

  /**
   * Réinitialisation de mot de passe avec OTP
   * @param {string} email - Email utilisateur
   * @param {string} otpCode - Code OTP
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise<Object>} Réponse du serveur
   */
  async resetPassword(email, otpCode, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otpCode,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de la réinitialisation', 500);
    }
  },

  /**
   * Actualisation du token
   * @returns {Promise<Object>} Nouveaux tokens
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new AuthError('Aucun refresh token disponible', 401);
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { accessToken, newRefreshToken } = response.data;
      
      // Mettre à jour les tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // Supprimer les tokens en cas d'erreur
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      if (error.response?.data?.error) {
        throw new AuthError(error.response.data.error, error.response.status);
      }
      throw new AuthError('Erreur lors de l\'actualisation du token', 500);
    }
  },

  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} True si connecté
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Obtenir les informations utilisateur depuis le token
   * @returns {Object|null} Informations utilisateur
   */
  getCurrentUser() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      // Décoder le token JWT (partie payload)
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('authService - Token payload décodé:', payload);
      return payload;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  },

  /**
   * Récupérer les informations complètes de l'utilisateur depuis la base de données
   * @returns {Promise<Object|null>} Informations complètes de l'utilisateur
   */
  async getCurrentUserDetails() {
    try {
      const response = await api.get('/auth/me');
      console.log('authService - Détails utilisateur récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails utilisateur:', error);
      return null;
    }
  }
};

export default authService; 