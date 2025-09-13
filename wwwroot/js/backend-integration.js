// Backend Integration - Synchronisation des données avec l'API
class BackendIntegration {
    constructor() {
        this.apiService = window.apiService;
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.syncInProgress = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkConnection();
        this.startPeriodicSync();
    }

    setupEventListeners() {
        // Écouter les changements de statut de connexion
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showToast('Connexion rétablie - Synchronisation en cours...', 'info');
            this.syncAllData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showToast('Mode hors ligne activé', 'warning');
        });

        // Écouter les changements dans localStorage
        window.addEventListener('storage', (e) => {
            if (e.key && (e.key.includes('pf_') || e.key.includes('transactions') || e.key.includes('accounts'))) {
                this.addToSyncQueue(e.key, 'update');
            }
        });
    }

    checkConnection() {
        if (this.apiService) {
            this.apiService.testConnection().then(result => {
                this.isOnline = result.success;
                if (this.isOnline) {
                    this.syncAllData();
                }
            }).catch(() => {
                this.isOnline = false;
            });
        }
    }

    startPeriodicSync() {
        // Synchronisation automatique toutes les 5 minutes
        setInterval(() => {
            if (this.isOnline && !this.syncInProgress) {
                this.syncAllData();
            }
        }, 5 * 60 * 1000);
    }

    async syncAllData() {
        if (!this.isOnline || this.syncInProgress) return;

        this.syncInProgress = true;
        this.showToast('Synchronisation avec le serveur...', 'info');

        try {
            await Promise.all([
                this.syncAccounts(),
                this.syncTransactions(),
                this.syncUserProfile()
            ]);

            this.showToast('Synchronisation terminée', 'success');
        } catch (error) {
            this.showToast('Erreur de synchronisation: ' + error.message, 'error');
        } finally {
            this.syncInProgress = false;
        }
    }

    async syncAccounts() {
        try {
            // Récupérer les comptes du serveur
            const serverAccounts = await this.apiService.getAccounts();
            
            // Fusionner avec les comptes locaux
            const localAccounts = this.getLocalAccounts();
            const mergedAccounts = this.mergeAccounts(localAccounts, serverAccounts);
            
            // Sauvegarder localement
            localStorage.setItem('pf_accounts', JSON.stringify(mergedAccounts));
            
            // Mettre à jour l'interface
            this.updateAccountsUI(mergedAccounts);
            
        } catch (error) {
            console.error('Erreur sync comptes:', error);
        }
    }

    async syncTransactions() {
        try {
            // Récupérer les transactions du serveur
            const serverTransactions = await this.apiService.getTransactions();
            
            // Fusionner avec les transactions locales
            const localTransactions = this.getLocalTransactions();
            const mergedTransactions = this.mergeTransactions(localTransactions, serverTransactions);
            
            // Sauvegarder localement
            localStorage.setItem('pf_transactions', JSON.stringify(mergedTransactions));
            
            // Mettre à jour l'interface
            this.updateTransactionsUI(mergedTransactions);
            
        } catch (error) {
            console.error('Erreur sync transactions:', error);
        }
    }

    async syncUserProfile() {
        try {
            const profile = await this.apiService.get('/users/profile');
            localStorage.setItem('pf_user_profile', JSON.stringify(profile));
        } catch (error) {
            console.error('Erreur sync profil:', error);
        }
    }

    mergeAccounts(localAccounts, serverAccounts) {
        const merged = [...localAccounts];
        
        serverAccounts.forEach(serverAccount => {
            const existingIndex = merged.findIndex(local => local.id === serverAccount.id);
            
            if (existingIndex !== -1) {
                // Fusionner les données (priorité au serveur pour les données sensibles)
                merged[existingIndex] = {
                    ...merged[existingIndex],
                    ...serverAccount,
                    // Garder les données locales spécifiques
                    localData: merged[existingIndex].localData
                };
            } else {
                merged.push(serverAccount);
            }
        });
        
        return merged;
    }

    mergeTransactions(localTransactions, serverTransactions) {
        const merged = [...localTransactions];
        
        serverTransactions.forEach(serverTransaction => {
            const existingIndex = merged.findIndex(local => local.id === serverTransaction.id);
            
            if (existingIndex !== -1) {
                // Fusionner les données
                merged[existingIndex] = {
                    ...merged[existingIndex],
                    ...serverTransaction,
                    // Garder les données locales spécifiques
                    localData: merged[existingIndex].localData
                };
            } else {
                merged.push(serverTransaction);
            }
        });
        
        // Trier par date (plus récent en premier)
        return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getLocalAccounts() {
        const saved = localStorage.getItem('pf_accounts');
        return saved ? JSON.parse(saved) : [];
    }

    getLocalTransactions() {
        const saved = localStorage.getItem('pf_transactions');
        return saved ? JSON.parse(saved) : [];
    }

    updateAccountsUI(accounts) {
        // Notifier les managers locaux du changement
        if (window.accountManager) {
            window.accountManager.accounts = accounts;
            window.accountManager.renderAccounts();
            window.accountManager.updateTotals();
        }
    }

    updateTransactionsUI(transactions) {
        // Notifier les managers locaux du changement
        if (window.transactionManager) {
            window.transactionManager.transactions = transactions;
            window.transactionManager.renderTransactions();
            window.transactionManager.updateSummary();
        }
        
        if (window.statisticsManager) {
            window.statisticsManager.transactions = transactions;
            window.statisticsManager.renderStatistics();
            window.statisticsManager.updateCharts();
        }
    }

    // Méthodes pour les opérations CRUD avec synchronisation
    async createAccount(accountData) {
        try {
            if (this.isOnline) {
                // Créer sur le serveur
                const serverAccount = await this.apiService.createAccount(accountData);
                
                // Ajouter localement
                const localAccounts = this.getLocalAccounts();
                localAccounts.push(serverAccount);
                localStorage.setItem('pf_accounts', JSON.stringify(localAccounts));
                
                this.updateAccountsUI(localAccounts);
                return serverAccount;
            } else {
                // Mode hors ligne - ajouter localement avec flag de synchronisation
                const localAccount = {
                    ...accountData,
                    id: Date.now(),
                    needsSync: true,
                    createdAt: new Date().toISOString()
                };
                
                const localAccounts = this.getLocalAccounts();
                localAccounts.push(localAccount);
                localStorage.setItem('pf_accounts', JSON.stringify(localAccounts));
                
                this.addToSyncQueue('accounts', 'create', localAccount);
                this.updateAccountsUI(localAccounts);
                return localAccount;
            }
        } catch (error) {
            throw new Error('Erreur lors de la création du compte: ' + error.message);
        }
    }

    async updateAccount(id, accountData) {
        try {
            if (this.isOnline) {
                // Mettre à jour sur le serveur
                const serverAccount = await this.apiService.updateAccount(id, accountData);
                
                // Mettre à jour localement
                const localAccounts = this.getLocalAccounts();
                const index = localAccounts.findIndex(acc => acc.id === id);
                if (index !== -1) {
                    localAccounts[index] = serverAccount;
                    localStorage.setItem('pf_accounts', JSON.stringify(localAccounts));
                    this.updateAccountsUI(localAccounts);
                }
                
                return serverAccount;
            } else {
                // Mode hors ligne
                const localAccounts = this.getLocalAccounts();
                const index = localAccounts.findIndex(acc => acc.id === id);
                if (index !== -1) {
                    localAccounts[index] = {
                        ...localAccounts[index],
                        ...accountData,
                        needsSync: true,
                        updatedAt: new Date().toISOString()
                    };
                    localStorage.setItem('pf_accounts', JSON.stringify(localAccounts));
                    this.updateAccountsUI(localAccounts);
                    
                    this.addToSyncQueue('accounts', 'update', localAccounts[index]);
                }
            }
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour du compte: ' + error.message);
        }
    }

    async deleteAccount(id) {
        try {
            if (this.isOnline) {
                // Supprimer sur le serveur
                await this.apiService.deleteAccount(id);
                
                // Supprimer localement
                const localAccounts = this.getLocalAccounts();
                const filtered = localAccounts.filter(acc => acc.id !== id);
                localStorage.setItem('pf_accounts', JSON.stringify(filtered));
                this.updateAccountsUI(filtered);
            } else {
                // Mode hors ligne
                const localAccounts = this.getLocalAccounts();
                const filtered = localAccounts.filter(acc => acc.id !== id);
                localStorage.setItem('pf_accounts', JSON.stringify(filtered));
                this.updateAccountsUI(filtered);
                
                this.addToSyncQueue('accounts', 'delete', { id });
            }
        } catch (error) {
            throw new Error('Erreur lors de la suppression du compte: ' + error.message);
        }
    }

    async createTransaction(transactionData) {
        try {
            if (this.isOnline) {
                // Créer sur le serveur
                const serverTransaction = await this.apiService.createTransaction(transactionData);
                
                // Ajouter localement
                const localTransactions = this.getLocalTransactions();
                localTransactions.unshift(serverTransaction);
                localStorage.setItem('pf_transactions', JSON.stringify(localTransactions));
                
                this.updateTransactionsUI(localTransactions);
                return serverTransaction;
            } else {
                // Mode hors ligne
                const localTransaction = {
                    ...transactionData,
                    id: Date.now(),
                    needsSync: true,
                    createdAt: new Date().toISOString()
                };
                
                const localTransactions = this.getLocalTransactions();
                localTransactions.unshift(localTransaction);
                localStorage.setItem('pf_transactions', JSON.stringify(localTransactions));
                
                this.addToSyncQueue('transactions', 'create', localTransaction);
                this.updateTransactionsUI(localTransactions);
                return localTransaction;
            }
        } catch (error) {
            throw new Error('Erreur lors de la création de la transaction: ' + error.message);
        }
    }

    async updateTransaction(id, transactionData) {
        try {
            if (this.isOnline) {
                // Mettre à jour sur le serveur
                const serverTransaction = await this.apiService.updateTransaction(id, transactionData);
                
                // Mettre à jour localement
                const localTransactions = this.getLocalTransactions();
                const index = localTransactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    localTransactions[index] = serverTransaction;
                    localStorage.setItem('pf_transactions', JSON.stringify(localTransactions));
                    this.updateTransactionsUI(localTransactions);
                }
                
                return serverTransaction;
            } else {
                // Mode hors ligne
                const localTransactions = this.getLocalTransactions();
                const index = localTransactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    localTransactions[index] = {
                        ...localTransactions[index],
                        ...transactionData,
                        needsSync: true,
                        updatedAt: new Date().toISOString()
                    };
                    localStorage.setItem('pf_transactions', JSON.stringify(localTransactions));
                    this.updateTransactionsUI(localTransactions);
                    
                    this.addToSyncQueue('transactions', 'update', localTransactions[index]);
                }
            }
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de la transaction: ' + error.message);
        }
    }

    async deleteTransaction(id) {
        try {
            if (this.isOnline) {
                // Supprimer sur le serveur
                await this.apiService.deleteTransaction(id);
                
                // Supprimer localement
                const localTransactions = this.getLocalTransactions();
                const filtered = localTransactions.filter(t => t.id !== id);
                localStorage.setItem('pf_transactions', JSON.stringify(filtered));
                this.updateTransactionsUI(filtered);
            } else {
                // Mode hors ligne
                const localTransactions = this.getLocalTransactions();
                const filtered = localTransactions.filter(t => t.id !== id);
                localStorage.setItem('pf_transactions', JSON.stringify(filtered));
                this.updateTransactionsUI(filtered);
                
                this.addToSyncQueue('transactions', 'delete', { id });
            }
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la transaction: ' + error.message);
        }
    }

    addToSyncQueue(type, action, data) {
        const syncItem = {
            id: Date.now(),
            type,
            action,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.syncQueue.push(syncItem);
        localStorage.setItem('pf_sync_queue', JSON.stringify(this.syncQueue));
    }

    async processSyncQueue() {
        if (!this.isOnline || this.syncQueue.length === 0) return;

        const queue = [...this.syncQueue];
        this.syncQueue = [];

        for (const item of queue) {
            try {
                switch (item.type) {
                    case 'accounts':
                        await this.processAccountSync(item);
                        break;
                    case 'transactions':
                        await this.processTransactionSync(item);
                        break;
                }
            } catch (error) {
                console.error('Erreur sync item:', error);
                // Remettre en queue en cas d'erreur
                this.syncQueue.push(item);
            }
        }

        localStorage.setItem('pf_sync_queue', JSON.stringify(this.syncQueue));
    }

    async processAccountSync(item) {
        switch (item.action) {
            case 'create':
                await this.apiService.createAccount(item.data);
                break;
            case 'update':
                await this.apiService.updateAccount(item.data.id, item.data);
                break;
            case 'delete':
                await this.apiService.deleteAccount(item.data.id);
                break;
        }
    }

    async processTransactionSync(item) {
        switch (item.action) {
            case 'create':
                await this.apiService.createTransaction(item.data);
                break;
            case 'update':
                await this.apiService.updateTransaction(item.data.id, item.data);
                break;
            case 'delete':
                await this.apiService.deleteTransaction(item.data.id);
                break;
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };

        toast.className = `${colors[type]} text-white px-4 py-2 rounded shadow-lg mb-2 transform transition-all duration-300`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-times' : type === 'warning' ? 'fa-exclamation' : 'fa-info'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }
}

// Initialisation de l'intégration backend
let backendIntegration;

document.addEventListener('DOMContentLoaded', function() {
    // Attendre que l'API service soit disponible
    setTimeout(() => {
        if (window.apiService) {
            backendIntegration = new BackendIntegration();
            window.backendIntegration = backendIntegration;
        }
    }, 1000);
});