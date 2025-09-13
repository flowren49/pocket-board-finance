// API Service pour la communication avec le backend
class APIService {
    constructor() {
        this.baseURL = window.apiConfig?.baseURL || 'http://localhost:5000/api';
        this.timeout = 10000;
    }

    // Méthode générique pour les requêtes HTTP
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Ajouter le token d'authentification si disponible
        const token = localStorage.getItem('pf_auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Timeout: La requête a pris trop de temps');
            }
            throw error;
        }
    }

    // Méthodes GET
    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseURL}${endpoint}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        
        return this.request(url.pathname + url.search, { method: 'GET' });
    }

    // Méthodes POST
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // Méthodes PUT
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // Méthodes DELETE
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Tests de connexion
    async testConnection() {
        try {
            const startTime = Date.now();
            const response = await this.get('/health');
            const endTime = Date.now();
            
            return {
                success: true,
                responseTime: endTime - startTime,
                data: response,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Test d'authentification
    async testAuth() {
        try {
            const response = await this.get('/auth/me');
            return {
                success: true,
                data: response,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Test des endpoints principaux
    async testEndpoints() {
        const endpoints = [
            '/health',
            '/auth/me',
            '/accounts',
            '/transactions',
            '/statistics'
        ];

        const results = [];
        
        for (const endpoint of endpoints) {
            try {
                const startTime = Date.now();
                await this.get(endpoint);
                const endTime = Date.now();
                
                results.push({
                    endpoint,
                    success: true,
                    responseTime: endTime - startTime,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                results.push({
                    endpoint,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        return results;
    }

    // Authentification
    async login(email, password) {
        return this.post('/auth/login', { email, password });
    }

    async register(userData) {
        return this.post('/auth/register', userData);
    }

    async logout() {
        try {
            await this.post('/auth/logout');
        } catch (error) {
            console.warn('Logout request failed:', error);
        }
    }

    // Comptes
    async getAccounts() {
        return this.get('/accounts');
    }

    async createAccount(accountData) {
        return this.post('/accounts', accountData);
    }

    async updateAccount(id, accountData) {
        return this.put(`/accounts/${id}`, accountData);
    }

    async deleteAccount(id) {
        return this.delete(`/accounts/${id}`);
    }

    // Transactions
    async getTransactions(params = {}) {
        return this.get('/transactions', params);
    }

    async createTransaction(transactionData) {
        return this.post('/transactions', transactionData);
    }

    async updateTransaction(id, transactionData) {
        return this.put(`/transactions/${id}`, transactionData);
    }

    async deleteTransaction(id) {
        return this.delete(`/transactions/${id}`);
    }

    // Statistiques
    async getStatistics(params = {}) {
        return this.get('/statistics', params);
    }

    async getBalanceHistory(params = {}) {
        return this.get('/statistics/balance-history', params);
    }

    // Export
    async exportData(format = 'excel', params = {}) {
        return this.get(`/export/${format}`, params);
    }
}

// Instance globale
window.apiService = new APIService();