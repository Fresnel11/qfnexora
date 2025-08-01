import api from './api';

// Types d'erreurs personnalisées
export class SavingPlanError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'SavingPlanError';
    this.status = status;
  }
}

// Service des plans d'épargne
const savingPlanService = {
  /**
   * Récupérer tous les plans d'épargne de l'utilisateur
   * @returns {Promise<Array>} Liste des plans d'épargne
   */
  async getUserSavingPlans() {
    try {
      console.log('savingPlanService - Appel GET /saving-plans');
      const response = await api.get('/saving-plans');
      console.log('savingPlanService - Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('savingPlanService - Erreur getUserSavingPlans:', error);
      if (error.response?.data?.error) {
        throw new SavingPlanError(error.response.data.error, error.response.status);
      }
      throw new SavingPlanError('Erreur lors de la récupération des plans d\'épargne', 500);
    }
  },

  /**
   * Calculer le total des plans d'épargne
   * @returns {Promise<Object>} Total des plans d'épargne
   */
  async getTotalSavings() {
    try {
      const savingPlans = await this.getUserSavingPlans();
      
      let totalCurrent = 0;
      let totalTarget = 0;
      let activePlans = 0;
      
      savingPlans.forEach(plan => {
        if (plan.status === 'active') {
          totalCurrent += plan.currentAmount || 0;
          totalTarget += plan.targetAmount || 0;
          activePlans++;
        }
      });
      
      const totalPercentage = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
      
      return {
        totalCurrent: totalCurrent,
        totalTarget: totalTarget,
        totalPercentage: totalPercentage,
        activePlans: activePlans,
        totalPlans: savingPlans.length
      };
    } catch (error) {
      console.error('Erreur lors du calcul du total d\'épargne:', error);
      // En cas d'erreur, retourner des valeurs par défaut
      return {
        totalCurrent: 0,
        totalTarget: 0,
        totalPercentage: 0,
        activePlans: 0,
        totalPlans: 0
      };
    }
  },

  /**
   * Créer un nouveau plan d'épargne
   * @param {Object} planData - Données du plan d'épargne
   * @returns {Promise<Object>} Plan d'épargne créé
   */
  async createSavingPlan(planData) {
    try {
      console.log('savingPlanService - Données envoyées:', planData);
      const response = await api.post('/saving-plans', planData);
      console.log('savingPlanService - Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('savingPlanService - Erreur createSavingPlan:', error);
      if (error.response?.data?.error) {
        throw new SavingPlanError(error.response.data.error, error.response.status);
      }
      throw new SavingPlanError('Erreur lors de la création du plan d\'épargne', 500);
    }
  },

  /**
   * Mettre à jour un plan d'épargne
   * @param {string} planId - ID du plan d'épargne
   * @param {Object} planData - Nouvelles données
   * @returns {Promise<Object>} Plan d'épargne mis à jour
   */
  async updateSavingPlan(planId, planData) {
    try {
      const response = await api.put(`/saving-plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new SavingPlanError(error.response.data.error, error.response.status);
      }
      throw new SavingPlanError('Erreur lors de la mise à jour du plan d\'épargne', 500);
    }
  },

  /**
   * Supprimer un plan d'épargne
   * @param {string} planId - ID du plan d'épargne
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteSavingPlan(planId) {
    try {
      const response = await api.delete(`/saving-plans/${planId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new SavingPlanError(error.response.data.error, error.response.status);
      }
      throw new SavingPlanError('Erreur lors de la suppression du plan d\'épargne', 500);
    }
  },

  /**
   * Ajouter un dépôt à un plan d'épargne
   * @param {string} planId - ID du plan d'épargne
   * @param {Object} depositData - Données du dépôt
   * @returns {Promise<Object>} Plan d'épargne mis à jour
   */
  async addDepositToSavingPlan(planId, depositData) {
    try {
      const response = await api.post(`/saving-plans/${planId}/deposits`, depositData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new SavingPlanError(error.response.data.error, error.response.status);
      }
      throw new SavingPlanError('Erreur lors de l\'ajout du dépôt', 500);
    }
  }
};

export default savingPlanService; 