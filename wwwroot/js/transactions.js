// Transactions Management JavaScript
class TransactionManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.categories = this.getCategories();
        this.accounts = this.getAccounts();
        this.init();
    }

    init() {
        this.renderTransactions();
        this.setupEventListeners();
        this.updateSummary();
    }

    loadTransactions() {
        // Charger depuis localStorage ou simuler des données
        const saved = localStorage.getItem('pf_transactions');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Données de démo
        return [
            {
                id: 1,
                date: new Date('2024-01-15'),
                description: 'Salaire',
                amount: 3500,
                type: 'income',
                category: 'salary',
                account: 'compte-courant',
                tags: ['salaire', 'mensuel']
            },
            {
                id: 2,
                date: new Date('2024-01-14'),
                description: 'Courses Carrefour',
                amount: -85.50,
                type: 'expense',
                category: 'groceries',
                account: 'compte-courant',
                tags: ['alimentation']
            },
            {
                id: 3,
                date: new Date('2024-01-13'),
                description: 'Essence',
                amount: -65,
                type: 'expense',
                category: 'transport',
                account: 'compte-courant',
                tags: ['transport', 'essence']
            },
            {
                id: 4,
                date: new Date('2024-01-12'),
                description: 'Netflix',
                amount: -15.99,
                type: 'expense',
                category: 'entertainment',
                account: 'compte-courant',
                tags: ['abonnement', 'streaming']
            },
            {
                id: 5,
                date: new Date('2024-01-11'),
                description: 'Transfert Épargne',
                amount: -500,
                type: 'transfer',
                category: 'savings',
                account: 'compte-courant',
                tags: ['épargne', 'transfert']
            }
        ];
    }

    getCategories() {
        return {
            income: {
                salary: { name: 'Salaire', icon: 'fas fa-money-bill-wave', color: 'text-green-600' },
                freelance: { name: 'Freelance', icon: 'fas fa-laptop-code', color: 'text-green-600' },
                investment: { name: 'Investissement', icon: 'fas fa-chart-line', color: 'text-green-600' },
                other: { name: 'Autre', icon: 'fas fa-plus', color: 'text-green-600' }
            },
            expense: {
                groceries: { name: 'Courses', icon: 'fas fa-shopping-cart', color: 'text-red-600' },
                transport: { name: 'Transport', icon: 'fas fa-car', color: 'text-red-600' },
                entertainment: { name: 'Loisirs', icon: 'fas fa-film', color: 'text-red-600' },
                bills: { name: 'Factures', icon: 'fas fa-file-invoice', color: 'text-red-600' },
                health: { name: 'Santé', icon: 'fas fa-heartbeat', color: 'text-red-600' },
                other: { name: 'Autre', icon: 'fas fa-minus', color: 'text-red-600' }
            },
            transfer: {
                savings: { name: 'Épargne', icon: 'fas fa-piggy-bank', color: 'text-blue-600' },
                investment: { name: 'Investissement', icon: 'fas fa-chart-line', color: 'text-blue-600' },
                other: { name: 'Autre', icon: 'fas fa-exchange-alt', color: 'text-blue-600' }
            }
        };
    }

    getAccounts() {
        return [
            { id: 'compte-courant', name: 'Compte Courant', balance: 2849.51, color: 'bg-blue-500' },
            { id: 'livret-a', name: 'Livret A', balance: 5000, color: 'bg-green-500' },
            { id: 'carte-credit', name: 'Carte Crédit', balance: -250, color: 'bg-red-500' }
        ];
    }

    setupEventListeners() {
        // Filtres
        document.getElementById('filterType')?.addEventListener('change', () => this.renderTransactions());
        document.getElementById('filterCategory')?.addEventListener('change', () => this.renderTransactions());
        document.getElementById('filterAccount')?.addEventListener('change', () => this.renderTransactions());
        document.getElementById('searchInput')?.addEventListener('input', () => this.renderTransactions());
        
        // Formulaires
        document.getElementById('addTransactionForm')?.addEventListener('submit', (e) => this.handleAddTransaction(e));
        
        // Boutons
        document.getElementById('addTransactionBtn')?.addEventListener('click', () => this.showAddModal());
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');
        if (!container) return;

        const filtered = this.getFilteredTransactions();
        
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-receipt text-4xl mb-4"></i>
                    <p>Aucune transaction trouvée</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(transaction => this.renderTransactionCard(transaction)).join('');
    }

    getFilteredTransactions() {
        let filtered = [...this.transactions];
        
        const type = document.getElementById('filterType')?.value;
        const category = document.getElementById('filterCategory')?.value;
        const account = document.getElementById('filterAccount')?.value;
        const search = document.getElementById('searchInput')?.value.toLowerCase();

        if (type && type !== 'all') {
            filtered = filtered.filter(t => t.type === type);
        }

        if (category && category !== 'all') {
            filtered = filtered.filter(t => t.category === category);
        }

        if (account && account !== 'all') {
            filtered = filtered.filter(t => t.account === account);
        }

        if (search) {
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(search) ||
                t.tags.some(tag => tag.toLowerCase().includes(search))
            );
        }

        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderTransactionCard(transaction) {
        const category = this.categories[transaction.type][transaction.category];
        const account = this.accounts.find(a => a.id === transaction.account);
        const isIncome = transaction.type === 'income';
        const isExpense = transaction.type === 'expense';
        const isTransfer = transaction.type === 'transfer';

        return `
            <div class="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 rounded-full ${isIncome ? 'bg-green-100' : isExpense ? 'bg-red-100' : 'bg-blue-100'} flex items-center justify-center">
                            <i class="${category.icon} ${category.color}"></i>
                        </div>
                        <div>
                            <h3 class="font-medium text-gray-900">${transaction.description}</h3>
                            <div class="flex items-center space-x-2 text-sm text-gray-500">
                                <span>${category.name}</span>
                                <span>•</span>
                                <span>${account.name}</span>
                                <span>•</span>
                                <span>${this.formatDate(transaction.date)}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-semibold ${isIncome ? 'text-green-600' : isExpense ? 'text-red-600' : 'text-blue-600'}">
                            ${isIncome ? '+' : ''}${this.formatAmount(transaction.amount)}€
                        </div>
                        <div class="flex space-x-1 mt-1">
                            ${transaction.tags.map(tag => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-100">
                    <button onclick="transactionManager.editTransaction(${transaction.id})" class="text-blue-600 hover:text-blue-800 text-sm">
                        <i class="fas fa-edit mr-1"></i>Modifier
                    </button>
                    <button onclick="transactionManager.deleteTransaction(${transaction.id})" class="text-red-600 hover:text-red-800 text-sm">
                        <i class="fas fa-trash mr-1"></i>Supprimer
                    </button>
                </div>
            </div>
        `;
    }

    showAddModal() {
        document.getElementById('addTransactionModal').classList.remove('hidden');
    }

    hideAddModal() {
        document.getElementById('addTransactionModal').classList.add('hidden');
        document.getElementById('addTransactionForm').reset();
    }

    async handleAddTransaction(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const transaction = {
            id: Date.now(),
            date: new Date(formData.get('date')),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            type: formData.get('type'),
            category: formData.get('category'),
            account: formData.get('account'),
            tags: formData.get('tags').split(',').map(t => t.trim()).filter(t => t)
        };

        this.transactions.unshift(transaction);
        this.saveTransactions();
        this.renderTransactions();
        this.updateSummary();
        this.hideAddModal();
        
        this.showToast('Transaction ajoutée', 'success');
    }

    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;

        // Pré-remplir le formulaire
        document.getElementById('editDate').value = transaction.date.toISOString().split('T')[0];
        document.getElementById('editDescription').value = transaction.description;
        document.getElementById('editAmount').value = Math.abs(transaction.amount);
        document.getElementById('editType').value = transaction.type;
        document.getElementById('editCategory').value = transaction.category;
        document.getElementById('editAccount').value = transaction.account;
        document.getElementById('editTags').value = transaction.tags.join(', ');

        document.getElementById('editTransactionModal').classList.remove('hidden');
        
        // Stocker l'ID pour la mise à jour
        document.getElementById('editTransactionModal').dataset.transactionId = id;
    }

    deleteTransaction(id) {
        if (confirm('Supprimer cette transaction ?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.renderTransactions();
            this.updateSummary();
            this.showToast('Transaction supprimée', 'info');
        }
    }

    updateSummary() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const balance = totalIncome - totalExpense;

        document.getElementById('totalIncome').textContent = this.formatAmount(totalIncome);
        document.getElementById('totalExpense').textContent = this.formatAmount(totalExpense);
        document.getElementById('balance').textContent = this.formatAmount(balance);
    }

    saveTransactions() {
        localStorage.setItem('pf_transactions', JSON.stringify(this.transactions));
    }

    formatAmount(amount) {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(new Date(date));
    }

    showToast(message, type = 'info') {
        if (window.authManager && window.authManager.showToast) {
            window.authManager.showToast(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialiser le gestionnaire de transactions
let transactionManager;

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialiser le gestionnaire de transactions
    transactionManager = new TransactionManager();
    
    // Setup logout button
    setupLogoutButton();
});

function setupLogoutButton() {
    const logoutBtn = document.getElementById('loginBtn');
    if (logoutBtn) {
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-1"></i>Déconnexion';
        logoutBtn.onclick = () => window.authManager.logout();
    }
}