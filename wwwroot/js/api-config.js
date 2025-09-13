// API Configuration for Backend Connection
class APIConfig {
    constructor() {
        // Configuration de base pour l'API
        this.baseURL = 'https://your-backend-api.com/api'; // À remplacer par votre URL API
        this.timeout = 10000; // 10 secondes
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 seconde
    }

    // Configuration des endpoints
    get endpoints() {
        return {
            // Authentification
            login: '/auth/login',
            register: '/auth/register',
            refresh: '/auth/refresh',
            logout: '/auth/logout',
            
            // Comptes
            accounts: '/accounts',
            accountById: (id) => `/accounts/${id}`,
            
            // Transactions
            transactions: '/transactions',
            transactionById: (id) => `/transactions/${id}`,
            
            // Statistiques
            statistics: '/statistics',
            balanceHistory: '/statistics/balance-history',
            
            // Export
            export: '/export',
            exportExcel: '/export/excel',
            exportCSV: '/export/csv',
            exportPDF: '/export/pdf',
            
            // Utilisateurs
            profile: '/users/profile',
            updateProfile: '/users/profile'
        };
    }

    // Headers par défaut
    getDefaultHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };
    }

    // Headers avec authentification
    getAuthHeaders(token) {
        return {
            ...this.getDefaultHeaders(),
            'Authorization': `Bearer ${token}`
        };
    }

    // Configuration pour les requêtes
    getRequestConfig(options = {}) {
        const config = {
            timeout: this.timeout,
            headers: this.getDefaultHeaders(),
            ...options
        };

        // Ajouter le token si disponible
        const token = localStorage.getItem('pf_auth_token');
        if (token && this.isTokenValid(token)) {
            config.headers = this.getAuthHeaders(token);
        }

        return config;
    }

    // Vérifier la validité du token
    isTokenValid(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch (error) {
            return false;
        }
    }

    // Gestion des erreurs
    handleError(error) {
        console.error('API Error:', error);
        
        if (error.response) {
            // Erreur de réponse du serveur
            const status = error.response.status;
            const message = error.response.data?.message || 'Erreur serveur';
            
            switch (status) {
                case 401:
                    // Non autorisé - rediriger vers login
                    this.handleUnauthorized();
                    break;
                case 403:
                    // Interdit
                    throw new Error('Accès non autorisé');
                case 404:
                    // Non trouvé
                    throw new Error('Ressource non trouvée');
                case 422:
                    // Erreur de validation
                    throw new Error(message);
                case 500:
                    // Erreur serveur
                    throw new Error('Erreur interne du serveur');
                default:
                    throw new Error(message);
            }
        } else if (error.request) {
            // Erreur de réseau
            throw new Error('Erreur de connexion au serveur');
        } else {
            // Autre erreur
            throw new Error(error.message || 'Une erreur est survenue');
        }
    }

    // Gérer les erreurs 401 (non autorisé)
    handleUnauthorized() {
        localStorage.removeItem('pf_auth_token');
        localStorage.removeItem('pf_user_data');
        
        if (window.authManager) {
            window.authManager.showToast('Session expirée, veuillez vous reconnecter', 'warning');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        }
    }

    // Retry logic
    async retryRequest(requestFn, attempt = 1) {
        try {
            return await requestFn();
        } catch (error) {
            if (attempt < this.retryAttempts && this.isRetryableError(error)) {
                await this.delay(this.retryDelay * attempt);
                return this.retryRequest(requestFn, attempt + 1);
            }
            throw error;
        }
    }

    // Vérifier si l'erreur est récupérable
    isRetryableError(error) {
        return error.code === 'NETWORK_ERROR' || 
               (error.response && error.response.status >= 500);
    }

    // Délai
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Instance globale
window.apiConfig = new APIConfig();