import axios from 'axios';

// Configuration de l'URL de base pour toutes les requêtes axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configuration des en-têtes par défaut
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Intercepteur pour ajouter le token d'authentification à chaque requête
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs globalement
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Erreur API:', error.response || error);
    
    // Rediriger vers la page de connexion si l'erreur est 401 (non autorisé)
    if (error.response && error.response.status === 401) {
      // Vider le localStorage si le token est expiré ou invalide
      localStorage.removeItem('token');
      
      // Si nous ne sommes pas déjà sur la page de connexion, rediriger
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axios;