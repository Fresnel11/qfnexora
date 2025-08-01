import api from './api';

// Types d'erreurs personnalisées
export class TransactionError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'TransactionError';
    this.status = status;
  }
}

// Service des transactions
const transactionService = {
  /**
   * Récupérer toutes les transactions de l'utilisateur
   * @returns {Promise<Array>} Liste des transactions
   */
  async getUserTransactions() {
    try {
      console.log('transactionService - Appel GET /transactions');
      const response = await api.get('/transactions');
      console.log('transactionService - Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('transactionService - Erreur getUserTransactions:', error);
      if (error.response?.data?.error) {
        throw new TransactionError(error.response.data.error, error.response.status);
      }
      throw new TransactionError('Erreur lors de la récupération des transactions', 500);
    }
  },

  /**
   * Calculer le solde total de l'utilisateur
   * @returns {Promise<Object>} Solde total avec détails
   */
  async getUserBalance() {
    try {
      const transactions = await this.getUserTransactions();
      
      let totalIncome = 0;
      let totalExpense = 0;
      
      transactions.forEach(transaction => {
        if (transaction.nature === 'income') {
          totalIncome += transaction.amount;
        } else if (transaction.nature === 'expense') {
          totalExpense += transaction.amount;
        }
      });
      
      const balance = totalIncome - totalExpense;
      
      return {
        balance: balance,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        transactionCount: transactions.length
      };
    } catch (error) {
      console.error('Erreur lors du calcul du solde:', error);
      // En cas d'erreur, retourner un solde de 0
      return {
        balance: 0,
        totalIncome: 0,
        totalExpense: 0,
        transactionCount: 0
      };
    }
  },

  /**
   * Récupérer les transactions récentes (limitées)
   * @param {number} limit - Nombre de transactions à récupérer
   * @returns {Promise<Array>} Liste des transactions récentes
   */
  async getRecentTransactions(limit = 5) {
    try {
      const response = await api.get(`/transactions?limit=${limit}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new TransactionError(error.response.data.error, error.response.status);
      }
      throw new TransactionError('Erreur lors de la récupération des transactions récentes', 500);
    }
  },

  /**
   * Créer une nouvelle transaction
   * @param {Object} transactionData - Données de la transaction
   * @returns {Promise<Object>} Transaction créée
   */
  async createTransaction(transactionData) {
    try {
      // Nettoyer les données avant envoi
      const cleanData = {
        ...transactionData,
        relatedSavingPlan: transactionData.relatedSavingPlan || null,
        receiptUrl: transactionData.receiptUrl || null,
        description: transactionData.description || null
      };

      console.log('transactionService - Données envoyées:', cleanData);
      const response = await api.post('/transactions', cleanData);
      console.log('transactionService - Réponse reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('transactionService - Erreur createTransaction:', error);
      if (error.response?.data?.error) {
        throw new TransactionError(error.response.data.error, error.response.status);
      }
      throw new TransactionError('Erreur lors de la création de la transaction', 500);
    }
  },

  /**
   * Mettre à jour une transaction
   * @param {string} transactionId - ID de la transaction
   * @param {Object} transactionData - Nouvelles données
   * @returns {Promise<Object>} Transaction mise à jour
   */
  async updateTransaction(transactionId, transactionData) {
    try {
      const response = await api.put(`/transactions/${transactionId}`, transactionData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new TransactionError(error.response.data.error, error.response.status);
      }
      throw new TransactionError('Erreur lors de la mise à jour de la transaction', 500);
    }
  },

  /**
   * Supprimer une transaction
   * @param {string} transactionId - ID de la transaction
   * @returns {Promise<Object>} Confirmation de suppression
   */
  async deleteTransaction(transactionId) {
    try {
      const response = await api.delete(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        throw new TransactionError(error.response.data.error, error.response.status);
      }
      throw new TransactionError('Erreur lors de la suppression de la transaction', 500);
    }
  }
};

export default transactionService; 