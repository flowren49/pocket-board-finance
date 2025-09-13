// Authentication and Security Management
class AuthManager {
    constructor() {
        this.apiBaseUrl = 'https://your-backend-api.com/api'; // À remplacer par votre API
        this.tokenKey = 'pf_auth_token';
        this.userKey = 'pf_user_data';
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.initializePWA();
    }

    checkAuthStatus() {
        const token = this.getToken();
        const user = this.getUser();
        
        if (token && user && this.isTokenValid(token)) {
            this.showAuthenticatedUI();
        } else {
            this.showPublicUI();
            if (token) {
                this.logout(); // Token expiré
            }
        }
    }

    setupEventListeners() {
        // Boutons de connexion
        document.getElementById('loginBtn')?.addEventListener('click', () => this.redirectToLogin());
        document.getElementById('loginBtnHero')?.addEventListener('click', () => this.redirectToLogin());
        document.getElementById('loginBtnCTA')?.addEventListener('click', () => this.redirectToLogin());
        
        // Boutons d'inscription
        document.getElementById('registerBtnHero')?.addEventListener('click', () => this.redirectToRegister());
        document.getElementById('registerBtnCTA')?.addEventListener('click', () => this.redirectToRegister());
    }

    redirectToLogin() {
        // Redirection vers la page de connexion
        window.location.href = '/login.html';
    }

    redirectToRegister() {
        // Redirection vers la page d'inscription
        window.location.href = '/register.html';
    }

    showAuthenticatedUI() {
        // Cacher les éléments publics et montrer l'interface connectée
        const publicElements = document.querySelectorAll('[data-public]');
        const privateElements = document.querySelectorAll('[data-private]');
        
        publicElements.forEach(el => el.style.display = 'none');
        privateElements.forEach(el => el.style.display = 'block');

        // Mettre à jour les boutons de navigation
        const loginBtns = document.querySelectorAll('#loginBtn, #loginBtnHero, #loginBtnCTA');
        loginBtns.forEach(btn => {
            if (btn) {
                btn.innerHTML = '<i class="fas fa-sign-out-alt mr-1"></i>Déconnexion';
                btn.onclick = () => this.logout();
            }
        });

        // Ne rediriger que depuis la page vitrine
        if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);
        }
    }

    showPublicUI() {
        // Afficher l'interface publique
        const publicElements = document.querySelectorAll('[data-public]');
        const privateElements = document.querySelectorAll('[data-private]');
        
        publicElements.forEach(el => el.style.display = 'block');
        privateElements.forEach(el => el.style.display = 'none');
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Échec de la connexion');
            }

            const data = await response.json();
            
            // Stocker le token et les données utilisateur
            this.setToken(data.token);
            this.setUser(data.user);
            
            this.showToast('Connexion réussie !', 'success');
            
            // Rediriger vers le dashboard
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);

            return true;
        } catch (error) {
            this.showToast('Erreur de connexion: ' + error.message, 'error');
            return false;
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Échec de l\'inscription');
            }

            const data = await response.json();
            
            this.showToast('Compte créé avec succès !', 'success');
            
            // Auto-login après inscription
            await this.login(userData.email, userData.password);
            
            return true;
        } catch (error) {
            this.showToast('Erreur d\'inscription: ' + error.message, 'error');
            return false;
        }
    }

    logout() {
        // Supprimer les données d'authentification
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        
        this.showToast('Déconnexion réussie', 'info');
        
        // Rediriger vers la page d'accueil
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    getUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    isTokenValid(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Date.now() / 1000;
            return payload.exp > now;
        } catch (error) {
            return false;
        }
    }

    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();
        
        if (!token) {
            throw new Error('Non authentifié');
        }

        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const response = await fetch(url, { ...options, ...defaultOptions });
        
        if (response.status === 401) {
            this.logout();
            throw new Error('Session expirée');
        }

        return response;
    }

    requireAuth() {
        if (!this.getToken() || !this.isTokenValid(this.getToken())) {
            this.showToast('Veuillez vous connecter', 'warning');
            this.redirectToLogin();
            return false;
        }
        return true;
    }

    initializePWA() {
        // Initialiser PWA seulement pour les utilisateurs connectés
        if (this.getToken() && this.isTokenValid(this.getToken())) {
            if (window.PWAManager) {
                new PWAManager();
            }
        }
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const bgColors = {
            success: 'bg-green-50 border-green-200',
            error: 'bg-red-50 border-red-200',
            warning: 'bg-yellow-50 border-yellow-200',
            info: 'bg-blue-50 border-blue-200'
        };

        const textColors = {
            success: 'text-green-800',
            error: 'text-red-800',
            warning: 'text-yellow-800',
            info: 'text-blue-800'
        };

        const iconColors = {
            success: 'text-green-400',
            error: 'text-red-400',
            warning: 'text-yellow-400',
            info: 'text-blue-400'
        };

        toast.className = `max-w-sm w-full sm:w-auto mx-4 sm:mx-0 ${bgColors[type]} border rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 translate-x-full`;
        
        toast.innerHTML = `
            <div class="p-4">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="fas ${icons[type]} ${iconColors[type]} text-lg"></i>
                    </div>
                    <div class="ml-3 w-0 flex-1">
                        <p class="text-sm font-medium ${textColors[type]}">${message}</p>
                    </div>
                    <div class="ml-4 flex-shrink-0 flex">
                        <button onclick="this.closest('div').remove()" class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Initialiser l'authentification
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});