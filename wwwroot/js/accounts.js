// Accounts Page JavaScript - Gestion Complète des Comptes
class AccountManager {
    constructor() {
        this.accounts = this.loadAccounts();
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAccounts();
        this.updateTotals();
    }

    loadAccounts() {
        const saved = localStorage.getItem('pf_accounts');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Comptes par défaut
        return [
            {
                id: 1,
                name: 'Compte Courant',
                type: 'checking',
                balance: 2500.00,
                currency: 'EUR',
                bank: 'Banque Principale',
                accountNumber: '****1234',
                color: '#3B82F6',
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                id: 2,
                name: 'Livret A',
                type: 'savings',
                balance: 5000.00,
                currency: 'EUR',
                bank: 'Banque Principale',
                accountNumber: '****5678',
                color: '#10B981',
                createdAt: new Date().toISOString(),
                isActive: true
            },
            {
                id: 3,
                name: 'Carte de Crédit',
                type: 'credit',
                balance: -1200.00,
                currency: 'EUR',
                bank: 'Banque Principale',
                accountNumber: '****9012',
                color: '#EF4444',
                createdAt: new Date().toISOString(),
                isActive: true
            }
        ];
    }

    saveAccounts() {
        localStorage.setItem('pf_accounts', JSON.stringify(this.accounts));
        this.updateTotals();
        this.renderAccounts();
    }

    addAccount(accountData) {
        const newAccount = {
            id: Date.now(),
            ...accountData,
            balance: parseFloat(accountData.balance) || 0,
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        this.accounts.push(newAccount);
        this.saveAccounts();
        this.showToast('Compte ajouté avec succès', 'success');
        return newAccount;
    }

    updateAccount(id, accountData) {
        const index = this.accounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
            this.accounts[index] = {
                ...this.accounts[index],
                ...accountData,
                balance: parseFloat(accountData.balance) || this.accounts[index].balance
            };
            this.saveAccounts();
            this.showToast('Compte mis à jour', 'success');
            return this.accounts[index];
        }
        return null;
    }

    deleteAccount(id) {
        const index = this.accounts.findIndex(acc => acc.id === id);
        if (index !== -1) {
            const account = this.accounts[index];
            this.accounts.splice(index, 1);
            this.saveAccounts();
            this.showToast(`Compte "${account.name}" supprimé`, 'success');
            return true;
        }
        return false;
    }

    getAccountById(id) {
        return this.accounts.find(acc => acc.id === id);
    }

    getActiveAccounts() {
        return this.accounts.filter(acc => acc.isActive);
    }

    calculateTotalBalance() {
        return this.getActiveAccounts().reduce((total, acc) => total + acc.balance, 0);
    }

    calculateTotalByType(type) {
        return this.getActiveAccounts()
            .filter(acc => acc.type === type)
            .reduce((total, acc) => total + acc.balance, 0);
    }

    updateTotals() {
        const totalBalance = this.calculateTotalBalance();
        const checkingTotal = this.calculateTotalByType('checking');
        const savingsTotal = this.calculateTotalByType('savings');
        const creditTotal = this.calculateTotalByType('credit');

        // Mettre à jour les totaux dans l'interface
        const totalElement = document.getElementById('totalBalance');
        const checkingElement = document.getElementById('checkingTotal');
        const savingsElement = document.getElementById('savingsTotal');
        const creditElement = document.getElementById('creditTotal');

        if (totalElement) totalElement.textContent = `${totalBalance.toFixed(2)} €`;
        if (checkingElement) checkingElement.textContent = `${checkingTotal.toFixed(2)} €`;
        if (savingsElement) savingsElement.textContent = `${savingsTotal.toFixed(2)} €`;
        if (creditElement) creditElement.textContent = `${creditTotal.toFixed(2)} €`;
    }

    renderAccounts() {
        const container = document.getElementById('accountsList');
        if (!container) return;

        if (this.accounts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-wallet text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucun compte</h3>
                    <p class="text-gray-600 mb-4">Commencez par ajouter votre premier compte</p>
                    <button onclick="accountManager.showAddModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <i class="fas fa-plus mr-2"></i>Ajouter un compte
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.accounts.map(account => `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div class="p-4 sm:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3" style="background-color: ${account.color}">
                                <i class="fas ${this.getAccountIcon(account.type)}"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">${account.name}</h3>
                                <p class="text-sm text-gray-600">${account.bank} • ${account.accountNumber}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}">
                                ${account.balance.toFixed(2)} €
                            </p>
                            <span class="text-xs text-gray-500 capitalize">${this.getAccountTypeLabel(account.type)}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex space-x-2">
                            <button onclick="accountManager.showEditModal(${account.id})" 
                                    class="text-blue-600 hover:text-blue-800 text-sm">
                                <i class="fas fa-edit mr-1"></i>Modifier
                            </button>
                            <button onclick="accountManager.showDetailsModal(${account.id})" 
                                    class="text-green-600 hover:text-green-800 text-sm">
                                <i class="fas fa-info-circle mr-1"></i>Détails
                            </button>
                        </div>
                        <button onclick="accountManager.confirmDelete(${account.id})" 
                                class="text-red-600 hover:text-red-800 text-sm">
                            <i class="fas fa-trash mr-1"></i>Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getAccountIcon(type) {
        const icons = {
            checking: 'fa-university',
            savings: 'fa-piggy-bank',
            credit: 'fa-credit-card',
            investment: 'fa-chart-line',
            cash: 'fa-money-bill-wave'
        };
        return icons[type] || 'fa-wallet';
    }

    getAccountTypeLabel(type) {
        const labels = {
            checking: 'Compte courant',
            savings: 'Épargne',
            credit: 'Crédit',
            investment: 'Investissement',
            cash: 'Espèces'
        };
        return labels[type] || type;
    }

    showAddModal() {
        this.currentEditingId = null;
        this.resetModalForm();
        document.getElementById('accountModalTitle').textContent = 'Ajouter un compte';
        document.getElementById('accountModal').classList.remove('hidden');
    }

    showEditModal(id) {
        const account = this.getAccountById(id);
        if (!account) return;

        this.currentEditingId = id;
        this.resetModalForm();
        
        // Remplir le formulaire
        document.getElementById('accountName').value = account.name;
        document.getElementById('accountType').value = account.type;
        document.getElementById('accountBalance').value = account.balance;
        document.getElementById('accountBank').value = account.bank || '';
        document.getElementById('accountNumber').value = account.accountNumber || '';
        document.getElementById('accountCurrency').value = account.currency || 'EUR';
        document.getElementById('accountColor').value = account.color || '#3B82F6';
        
        document.getElementById('accountModalTitle').textContent = 'Modifier le compte';
        document.getElementById('accountModal').classList.remove('hidden');
    }

    showDetailsModal(id) {
        const account = this.getAccountById(id);
        if (!account) return;

        const modal = document.getElementById('accountDetailsModal');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold">Détails du compte</h3>
                <button onclick="this.closest('.modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-white mr-4" style="background-color: ${account.color}">
                        <i class="fas ${this.getAccountIcon(account.type)}"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg">${account.name}</h4>
                        <p class="text-gray-600">${this.getAccountTypeLabel(account.type)}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700">Solde actuel</label>
                        <p class="text-lg font-bold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ${account.balance.toFixed(2)} ${account.currency}
                        </p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700">Banque</label>
                        <p class="text-gray-900">${account.bank || 'Non spécifié'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700">Numéro de compte</label>
                        <p class="text-gray-900">${account.accountNumber || 'Non spécifié'}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700">Date de création</label>
                        <p class="text-gray-900">${new Date(account.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                </div>
                
                <div class="flex justify-end space-x-3 pt-4">
                    <button onclick="this.closest('.modal').classList.add('hidden')" 
                            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Fermer
                    </button>
                    <button onclick="accountManager.showEditModal(${account.id}); this.closest('.modal').classList.add('hidden');" 
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-edit mr-2"></i>Modifier
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    resetModalForm() {
        document.getElementById('accountForm').reset();
        document.getElementById('accountColor').value = '#3B82F6';
    }

    confirmDelete(id) {
        const account = this.getAccountById(id);
        if (!account) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer le compte "${account.name}" ?\n\nCette action est irréversible.`)) {
            this.deleteAccount(id);
        }
    }

    setupEventListeners() {
        // Formulaire de compte
        const form = document.getElementById('accountForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Boutons de fermeture de modal
        const closeButtons = document.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        // Clic sur overlay pour fermer
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('accountName').value,
            type: document.getElementById('accountType').value,
            balance: parseFloat(document.getElementById('accountBalance').value),
            bank: document.getElementById('accountBank').value,
            accountNumber: document.getElementById('accountNumber').value,
            currency: document.getElementById('accountCurrency').value,
            color: document.getElementById('accountColor').value
        };

        // Validation
        if (!formData.name.trim()) {
            this.showToast('Le nom du compte est requis', 'error');
            return;
        }

        if (isNaN(formData.balance)) {
            this.showToast('Le solde doit être un nombre valide', 'error');
            return;
        }

        try {
            if (this.currentEditingId) {
                this.updateAccount(this.currentEditingId, formData);
            } else {
                this.addAccount(formData);
            }
            
            document.getElementById('accountModal').classList.add('hidden');
        } catch (error) {
            this.showToast('Erreur lors de la sauvegarde: ' + error.message, 'error');
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

// Navigation mobile
function setupMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebar = document.getElementById('closeSidebar');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        let isOpen = false;

        // Open sidebar
        mobileMenuBtn.addEventListener('click', () => {
            if (!isOpen) {
                sidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.remove('hidden');
                mobileMenuBtn.classList.add('hamburger-open');
                isOpen = true;
            } else {
                closeSidebarFn();
            }
        });

        // Close sidebar
        const closeSidebarFn = () => {
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('hidden');
            mobileMenuBtn.classList.remove('hamburger-open');
            isOpen = false;
        };

        closeSidebar?.addEventListener('click', closeSidebarFn);
        sidebarOverlay.addEventListener('click', closeSidebarFn);

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                closeSidebarFn();
            }
        });
    }
}

// Fonction pour afficher le modal d'ajout (compatibilité)
function showAddAccountModal() {
    if (window.accountManager) {
        window.accountManager.showAddModal();
    }
}

// Initialisation
let accountManager;

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialiser les gestionnaires
    setupMobileNavigation();
    accountManager = new AccountManager();
    window.accountManager = accountManager; // Pour l'accès global
});