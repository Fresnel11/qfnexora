import axios from 'axios';

// Configuration de base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
console.log('API_BASE_URL configuré:', API_BASE_URL);

// Créer l'instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes
});

// Intercepteur pour ajouter le token Bearer automatiquement
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs communes
    if (error.response) {
      // Erreur de réponse du serveur (4xx, 5xx)
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expiré ou invalide
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // Rediriger vers login si nécessaire
          break;
        case 403:
          // Accès interdit
          console.error('Accès interdit');
          break;
        case 404:
          // Ressource non trouvée
          console.error('Ressource non trouvée');
          break;
        case 500:
          // Erreur serveur
          console.error('Erreur serveur');
          break;
        default:
          console.error(`Erreur ${status}:`, data);
      }
    } else if (error.request) {
      // Erreur de réseau (pas de réponse)
      console.error('Erreur de réseau - Impossible de joindre le serveur');
    } else {
      // Erreur de configuration
      console.error('Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 