// Transactions Page JavaScript - Gestion Complète des Transactions
class TransactionManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.accounts = this.loadAccounts();
        this.categories = this.getDefaultCategories();
        this.currentEditingId = null;
        this.filters = {
            type: 'all',
            category: 'all',
            account: 'all',
            search: '',
            dateFrom: '',
            dateTo: ''
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTransactions();
        this.updateSummary();
    }

    loadTransactions() {
        const saved = localStorage.getItem('pf_transactions');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Transactions par défaut
        return [
            {
                id: 1,
                description: 'Salaire',
                amount: 3000.00,
                type: 'income',
                category: 'salary',
                accountId: 1,
                date: '2024-01-01',
                tags: ['salaire', 'revenus'],
                createdAt: new Date().toISOString(),
                notes: 'Salaire mensuel'
            },
            {
                id: 2,
                description: 'Loyer',
                amount: -800.00,
                type: 'expense',
                category: 'housing',
                accountId: 1,
                date: '2024-01-02',
                tags: ['logement', 'fixe'],
                createdAt: new Date().toISOString(),
                notes: 'Loyer mensuel'
            },
            {
                id: 3,
                description: 'Courses',
                amount: -120.50,
                type: 'expense',
                category: 'food',
                accountId: 1,
                date: '2024-01-03',
                tags: ['alimentation', 'courses'],
                createdAt: new Date().toISOString(),
                notes: 'Supermarket'
            },
            {
                id: 4,
                description: 'Restaurant',
                amount: -45.00,
                type: 'expense',
                category: 'food',
                accountId: 1,
                date: '2024-01-04',
                tags: ['restaurant', 'sortie'],
                createdAt: new Date().toISOString(),
                notes: 'Dîner entre amis'
            },
            {
                id: 5,
                description: 'Épargne',
                amount: -500.00,
                type: 'transfer',
                category: 'savings',
                accountId: 2,
                date: '2024-01-05',
                tags: ['épargne', 'transfert'],
                createdAt: new Date().toISOString(),
                notes: 'Virement vers livret A'
            }
        ];
    }

    loadAccounts() {
        const saved = localStorage.getItem('pf_accounts');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    getDefaultCategories() {
        return {
            income: [
                { id: 'salary', name: 'Salaire', icon: 'fa-briefcase', color: '#10B981' },
                { id: 'freelance', name: 'Freelance', icon: 'fa-laptop', color: '#3B82F6' },
                { id: 'investment', name: 'Investissements', icon: 'fa-chart-line', color: '#8B5CF6' },
                { id: 'bonus', name: 'Prime', icon: 'fa-gift', color: '#F59E0B' },
                { id: 'other', name: 'Autre', icon: 'fa-plus', color: '#6B7280' }
            ],
            expense: [
                { id: 'housing', name: 'Logement', icon: 'fa-home', color: '#EF4444' },
                { id: 'food', name: 'Alimentation', icon: 'fa-utensils', color: '#F59E0B' },
                { id: 'transport', name: 'Transport', icon: 'fa-car', color: '#3B82F6' },
                { id: 'health', name: 'Santé', icon: 'fa-heart', color: '#10B981' },
                { id: 'entertainment', name: 'Loisirs', icon: 'fa-gamepad', color: '#8B5CF6' },
                { id: 'shopping', name: 'Shopping', icon: 'fa-shopping-bag', color: '#EC4899' },
                { id: 'bills', name: 'Factures', icon: 'fa-file-invoice', color: '#6B7280' },
                { id: 'other', name: 'Autre', icon: 'fa-minus', color: '#6B7280' }
            ],
            transfer: [
                { id: 'savings', name: 'Épargne', icon: 'fa-piggy-bank', color: '#10B981' },
                { id: 'investment', name: 'Investissement', icon: 'fa-chart-line', color: '#8B5CF6' },
                { id: 'other', name: 'Autre', icon: 'fa-exchange-alt', color: '#6B7280' }
            ]
        };
    }

    saveTransactions() {
        localStorage.setItem('pf_transactions', JSON.stringify(this.transactions));
        this.renderTransactions();
        this.updateSummary();
    }

    addTransaction(transactionData) {
        const newTransaction = {
            id: Date.now(),
            ...transactionData,
            amount: parseFloat(transactionData.amount),
            createdAt: new Date().toISOString(),
            tags: transactionData.tags ? transactionData.tags.split(',').map(tag => tag.trim()) : []
        };
        
        this.transactions.unshift(newTransaction);
        this.updateAccountBalance(newTransaction);
        this.saveTransactions();
        this.showToast('Transaction ajoutée avec succès', 'success');
        return newTransaction;
    }

    updateTransaction(id, transactionData) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            const oldTransaction = this.transactions[index];
            this.transactions[index] = {
                ...this.transactions[index],
                ...transactionData,
                amount: parseFloat(transactionData.amount),
                tags: transactionData.tags ? transactionData.tags.split(',').map(tag => tag.trim()) : []
            };
            
            // Mettre à jour le solde du compte
            this.updateAccountBalance(this.transactions[index], oldTransaction);
            this.saveTransactions();
            this.showToast('Transaction mise à jour', 'success');
            return this.transactions[index];
        }
        return null;
    }

    deleteTransaction(id) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            const transaction = this.transactions[index];
            this.transactions.splice(index, 1);
            
            // Restaurer le solde du compte
            this.updateAccountBalance(transaction, null, true);
            this.saveTransactions();
            this.showToast(`Transaction "${transaction.description}" supprimée`, 'success');
            return true;
        }
        return false;
    }

    updateAccountBalance(transaction, oldTransaction = null, isDelete = false) {
        const accounts = this.loadAccounts();
        const accountIndex = accounts.findIndex(acc => acc.id === transaction.accountId);
        
        if (accountIndex !== -1) {
            let amountChange = transaction.amount;
            
            if (oldTransaction && oldTransaction.accountId === transaction.accountId) {
                // Annuler l'ancienne transaction
                amountChange -= oldTransaction.amount;
            } else if (oldTransaction && oldTransaction.accountId !== transaction.accountId) {
                // Transaction vers un autre compte
                const oldAccountIndex = accounts.findIndex(acc => acc.id === oldTransaction.accountId);
                if (oldAccountIndex !== -1) {
                    accounts[oldAccountIndex].balance -= oldTransaction.amount;
                }
            }
            
            if (isDelete) {
                amountChange = -transaction.amount;
            }
            
            accounts[accountIndex].balance += amountChange;
            localStorage.setItem('pf_accounts', JSON.stringify(accounts));
        }
    }

    getTransactionById(id) {
        return this.transactions.find(t => t.id === id);
    }

    getFilteredTransactions() {
        return this.transactions.filter(transaction => {
            // Filtre par type
            if (this.filters.type !== 'all' && transaction.type !== this.filters.type) {
                return false;
            }
            
            // Filtre par catégorie
            if (this.filters.category !== 'all' && transaction.category !== this.filters.category) {
                return false;
            }
            
            // Filtre par compte
            if (this.filters.account !== 'all' && transaction.accountId !== parseInt(this.filters.account)) {
                return false;
            }
            
            // Filtre par recherche
            if (this.filters.search && !transaction.description.toLowerCase().includes(this.filters.search.toLowerCase())) {
                return false;
            }
            
            // Filtre par date
            if (this.filters.dateFrom && transaction.date < this.filters.dateFrom) {
                return false;
            }
            
            if (this.filters.dateTo && transaction.date > this.filters.dateTo) {
                return false;
            }
            
            return true;
        });
    }

    updateSummary() {
        const filtered = this.getFilteredTransactions();
        const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const balance = totalIncome - totalExpenses;
        const transactionCount = filtered.length;

        // Mettre à jour les statistiques
        const balanceElement = document.getElementById('totalBalance');
        const incomeElement = document.getElementById('totalIncome');
        const expenseElement = document.getElementById('totalExpenses');
        const countElement = document.getElementById('transactionCount');

        if (balanceElement) balanceElement.textContent = `${balance.toFixed(2)} €`;
        if (incomeElement) incomeElement.textContent = `${totalIncome.toFixed(2)} €`;
        if (expenseElement) expenseElement.textContent = `${totalExpenses.toFixed(2)} €`;
        if (countElement) countElement.textContent = transactionCount.toString();
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        if (!container) return;

        const filtered = this.getFilteredTransactions();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-receipt text-4xl text-gray-400 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Aucune transaction</h3>
                    <p class="text-gray-600 mb-4">Commencez par ajouter votre première transaction</p>
                    <button onclick="transactionManager.showAddModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        <i class="fas fa-plus mr-2"></i>Ajouter une transaction
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(transaction => `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div class="p-4 sm:p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white mr-3" 
                                 style="background-color: ${this.getCategoryColor(transaction.category, transaction.type)}">
                                <i class="fas ${this.getCategoryIcon(transaction.category, transaction.type)}"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">${transaction.description}</h3>
                                <p class="text-sm text-gray-600">
                                    ${this.getAccountName(transaction.accountId)} • ${new Date(transaction.date).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}">
                                ${transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)} €
                            </p>
                            <span class="text-xs text-gray-500 capitalize">${this.getCategoryName(transaction.category, transaction.type)}</span>
                        </div>
                    </div>
                    
                    ${transaction.notes ? `<p class="text-sm text-gray-600 mb-3">${transaction.notes}</p>` : ''}
                    
                    ${transaction.tags && transaction.tags.length > 0 ? `
                        <div class="flex flex-wrap gap-1 mb-3">
                            ${transaction.tags.map(tag => `
                                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#${tag}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="flex items-center justify-between">
                        <div class="flex space-x-2">
                            <button onclick="transactionManager.showEditModal(${transaction.id})" 
                                    class="text-blue-600 hover:text-blue-800 text-sm">
                                <i class="fas fa-edit mr-1"></i>Modifier
                            </button>
                            <button onclick="transactionManager.showDetailsModal(${transaction.id})" 
                                    class="text-green-600 hover:text-green-800 text-sm">
                                <i class="fas fa-info-circle mr-1"></i>Détails
                            </button>
                        </div>
                        <button onclick="transactionManager.confirmDelete(${transaction.id})" 
                                class="text-red-600 hover:text-red-800 text-sm">
                            <i class="fas fa-trash mr-1"></i>Supprimer
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getCategoryColor(categoryId, type) {
        const category = this.categories[type]?.find(c => c.id === categoryId);
        return category?.color || '#6B7280';
    }

    getCategoryIcon(categoryId, type) {
        const category = this.categories[type]?.find(c => c.id === categoryId);
        return category?.icon || 'fa-circle';
    }

    getCategoryName(categoryId, type) {
        const category = this.categories[type]?.find(c => c.id === categoryId);
        return category?.name || categoryId;
    }

    getAccountName(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        return account?.name || 'Compte inconnu';
    }

    showAddModal() {
        this.currentEditingId = null;
        this.resetModalForm();
        document.getElementById('transactionModalTitle').textContent = 'Ajouter une transaction';
        document.getElementById('transactionModal').classList.remove('hidden');
    }

    showEditModal(id) {
        const transaction = this.getTransactionById(id);
        if (!transaction) return;

        this.currentEditingId = id;
        this.resetModalForm();
        
        // Remplir le formulaire
        document.getElementById('transactionDescription').value = transaction.description;
        document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
        document.getElementById('transactionType').value = transaction.type;
        document.getElementById('transactionCategory').value = transaction.category;
        document.getElementById('transactionAccount').value = transaction.accountId;
        document.getElementById('transactionDate').value = transaction.date;
        document.getElementById('transactionNotes').value = transaction.notes || '';
        document.getElementById('transactionTags').value = transaction.tags?.join(', ') || '';
        
        document.getElementById('transactionModalTitle').textContent = 'Modifier la transaction';
        document.getElementById('transactionModal').classList.remove('hidden');
        
        // Mettre à jour les catégories
        this.updateCategoryOptions();
    }

    showDetailsModal(id) {
        const transaction = this.getTransactionById(id);
        if (!transaction) return;

        const modal = document.getElementById('transactionDetailsModal');
        const content = modal.querySelector('.modal-content');
        
        content.innerHTML = `
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-semibold">Détails de la transaction</h3>
                <button onclick="this.closest('.modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center text-white mr-4" 
                         style="background-color: ${this.getCategoryColor(transaction.category, transaction.type)}">
                        <i class="fas ${this.getCategoryIcon(transaction.category, transaction.type)}"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg">${transaction.description}</h4>
                        <p class="text-gray-600">${this.getCategoryName(transaction.category, transaction.type)}</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-700">Montant</label>
                        <p class="text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}">
                            ${transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)} €
                        </p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700">Compte</label>
                        <p class="text-gray-900">${this.getAccountName(transaction.accountId)}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700">Date</label>
                        <p class="text-gray-900">${new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-700">Type</label>
                        <p class="text-gray-900 capitalize">${transaction.type}</p>
                    </div>
                </div>
                
                ${transaction.notes ? `
                    <div>
                        <label class="text-sm font-medium text-gray-700">Notes</label>
                        <p class="text-gray-900">${transaction.notes}</p>
                    </div>
                ` : ''}
                
                ${transaction.tags && transaction.tags.length > 0 ? `
                    <div>
                        <label class="text-sm font-medium text-gray-700">Tags</label>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${transaction.tags.map(tag => `
                                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#${tag}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div class="flex justify-end space-x-3 pt-4">
                    <button onclick="this.closest('.modal').classList.add('hidden')" 
                            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Fermer
                    </button>
                    <button onclick="transactionManager.showEditModal(${transaction.id}); this.closest('.modal').classList.add('hidden');" 
                            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-edit mr-2"></i>Modifier
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    resetModalForm() {
        document.getElementById('transactionForm').reset();
        document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        this.updateCategoryOptions();
    }

    updateCategoryOptions() {
        const typeSelect = document.getElementById('transactionType');
        const categorySelect = document.getElementById('transactionCategory');
        
        if (typeSelect && categorySelect) {
            const selectedType = typeSelect.value;
            const categories = this.categories[selectedType] || [];
            
            categorySelect.innerHTML = categories.map(cat => 
                `<option value="${cat.id}">${cat.name}</option>`
            ).join('');
        }
    }

    confirmDelete(id) {
        const transaction = this.getTransactionById(id);
        if (!transaction) return;

        if (confirm(`Êtes-vous sûr de vouloir supprimer la transaction "${transaction.description}" ?\n\nCette action est irréversible.`)) {
            this.deleteTransaction(id);
        }
    }

    applyFilters() {
        this.filters.type = document.getElementById('filterType')?.value || 'all';
        this.filters.category = document.getElementById('filterCategory')?.value || 'all';
        this.filters.account = document.getElementById('filterAccount')?.value || 'all';
        this.filters.search = document.getElementById('filterSearch')?.value || '';
        this.filters.dateFrom = document.getElementById('filterDateFrom')?.value || '';
        this.filters.dateTo = document.getElementById('filterDateTo')?.value || '';
        
        this.renderTransactions();
        this.updateSummary();
    }

    clearFilters() {
        this.filters = {
            type: 'all',
            category: 'all',
            account: 'all',
            search: '',
            dateFrom: '',
            dateTo: ''
        };
        
        // Reset form inputs
        document.getElementById('filterType').value = 'all';
        document.getElementById('filterCategory').value = 'all';
        document.getElementById('filterAccount').value = 'all';
        document.getElementById('filterSearch').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        
        this.renderTransactions();
        this.updateSummary();
    }

    setupEventListeners() {
        // Formulaire de transaction
        const form = document.getElementById('transactionForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Changement de type de transaction
        const typeSelect = document.getElementById('transactionType');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.updateCategoryOptions());
        }

        // Filtres
        const filterInputs = document.querySelectorAll('#filtersForm input, #filtersForm select');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.applyFilters());
            input.addEventListener('input', () => {
                if (input.type === 'text') {
                    this.applyFilters();
                }
            });
        });

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
            description: document.getElementById('transactionDescription').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            type: document.getElementById('transactionType').value,
            category: document.getElementById('transactionCategory').value,
            accountId: parseInt(document.getElementById('transactionAccount').value),
            date: document.getElementById('transactionDate').value,
            notes: document.getElementById('transactionNotes').value,
            tags: document.getElementById('transactionTags').value
        };

        // Ajuster le montant selon le type
        if (formData.type === 'expense') {
            formData.amount = -Math.abs(formData.amount);
        } else if (formData.type === 'income') {
            formData.amount = Math.abs(formData.amount);
        }

        // Validation
        if (!formData.description.trim()) {
            this.showToast('La description est requise', 'error');
            return;
        }

        if (isNaN(formData.amount) || formData.amount === 0) {
            this.showToast('Le montant doit être un nombre valide', 'error');
            return;
        }

        if (!formData.accountId) {
            this.showToast('Veuillez sélectionner un compte', 'error');
            return;
        }

        try {
            if (this.currentEditingId) {
                this.updateTransaction(this.currentEditingId, formData);
            } else {
                this.addTransaction(formData);
            }
            
            document.getElementById('transactionModal').classList.add('hidden');
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
function showAddTransactionModal() {
    if (window.transactionManager) {
        window.transactionManager.showAddModal();
    }
}

// Initialisation
let transactionManager;

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialiser les gestionnaires
    setupMobileNavigation();
    transactionManager = new TransactionManager();
    window.transactionManager = transactionManager; // Pour l'accès global
});