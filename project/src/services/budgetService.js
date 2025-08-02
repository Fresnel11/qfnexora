import api from './api';

// Types d'erreurs personnalisées
export class BudgetError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'BudgetError';
    this.status = status;
  }
}

// Service des budgets
const budgetService = {
  /**
   * Récupérer tous les budgets de l'utilisateur
   * @returns {Promise<Array>} Liste des budgets
   */
  async getUserBudgets() {
    try {
      console.log('budgetService - Appel GET /budgets');
      const response = await api.get('/budgets');
      console.log('budgetService - Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('budgetService - Erreur getUserBudgets:', error);
      if (error.response?.data?.error) {
        throw new BudgetError(error.response.data.error, error.response.status);
      }
      throw new BudgetError('Erreur lors de la récupération des budgets', 500);
    }
  },

  /**
   * Récupérer un budget par ID
   * @param {string} budgetId - ID du budget
   * @returns {Promise<Object>} Budget
   */
  async getBudgetById(budgetId) {
    try {
      const response = await api.get(`/budgets/${budgetId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new BudgetError(error.response.data.error, error.response.status);
      }
      throw new BudgetError('Erreur lors de la récupération du budget', 500);
    }
  },

  /**
   * Créer un nouveau budget
   * @param {Object} budgetData - Données du budget
   * @returns {Promise<Object>} Budget créé
   */
  async createBudget(budgetData) {
    try {
      console.log('budgetService - Données envoyées:', budgetData);
      const response = await api.post('/budgets', budgetData);
      console.log('budgetService - Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('budgetService - Erreur createBudget:', error);
      if (error.response?.data?.error) {
        throw new BudgetError(error.response.data.error, error.response.status);
      }
      throw new BudgetError('Erreur lors de la création du budget', 500);
    }
  },

  /**
   * Mettre à jour un budget
   * @param {string} budgetId - ID du budget
   * @param {Object} budgetData - Nouvelles données
   * @returns {Promise<Object>} Budget mis à jour
   */
  async updateBudget(budgetId, budgetData) {
    try {
      const response = await api.put(`/budgets/${budgetId}`, budgetData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new BudgetError(error.response.data.error, error.response.status);
      }
      throw new BudgetError('Erreur lors de la mise à jour du budget', 500);
    }
  },

  /**
   * Supprimer un budget
   * @param {string} budgetId - ID du budget
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteBudget(budgetId) {
    try {
      const response = await api.delete(`/budgets/${budgetId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new BudgetError(error.response.data.error, error.response.status);
      }
      throw new BudgetError('Erreur lors de la suppression du budget', 500);
    }
  },

  /**
   * Récupérer le budget actif le plus pertinent
   * @returns {Promise<Object>} Budget actif
   */
  async getActiveBudget() {
    try {
      const budgets = await this.getUserBudgets();
      const now = new Date();
      
      // Filtrer les budgets avec status 'active' et dans la période valide
      const activeBudgets = budgets.filter(budget => 
        budget.status === 'active' &&
        new Date(budget.startDate) <= now &&
        new Date(budget.endDate) >= now
      );

      console.log('budgetService - Budgets trouvés:', budgets.length);
      console.log('budgetService - Budgets actifs:', activeBudgets.length);
      console.log('budgetService - Date actuelle:', now);

      if (activeBudgets.length === 0) {
        console.log('budgetService - Aucun budget actif trouvé');
        return null;
      }

      // Retourner le budget le plus récent
      const sortedBudgets = activeBudgets.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      console.log('budgetService - Budget actif sélectionné:', sortedBudgets[0]);
      return sortedBudgets[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du budget actif:', error);
      return null;
    }
  }
};

export default budgetService; 