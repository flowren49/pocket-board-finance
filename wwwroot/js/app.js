// Personal Finance App - Main JavaScript
class PersonalFinanceApp {
    constructor() {
        this.accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        this.transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        this.isLoggedIn = !!this.currentUser;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.updateChart();
        this.updateTransactions();
        this.checkLoginStatus();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form
        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Add account form
        document.getElementById('addAccountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddAccount();
        });

        // Login button
        document.getElementById('loginBtn').addEventListener('click', () => {
            if (this.isLoggedIn) {
                this.logout();
            } else {
                this.showLoginModal();
            }
        });
    }

    checkLoginStatus() {
        if (this.isLoggedIn) {
            document.getElementById('loginBtn').innerHTML = 
                '<i class="fas fa-sign-out-alt mr-1"></i>Déconnexion';
            document.getElementById('loginBtn').textContent = 'Déconnexion';
        } else {
            document.getElementById('loginBtn').innerHTML = 
                '<i class="fas fa-sign-in-alt mr-1"></i>Connexion';
        }
    }

    handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Simuler une connexion (dans une vraie app, ceci serait une requête API)
        const user = {
            id: 1,
            firstName: 'Utilisateur',
            lastName: 'Demo',
            email: email
        };

        this.currentUser = user;
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.hideLoginModal();
        this.showToast('Connexion réussie !', 'success');
        this.checkLoginStatus();
    }

    handleRegister() {
        const firstName = document.getElementById('registerFirstName').value;
        const lastName = document.getElementById('registerLastName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        // Simuler un enregistrement
        const user = {
            id: Date.now(),
            firstName: firstName,
            lastName: lastName,
            email: email
        };

        this.currentUser = user;
        this.isLoggedIn = true;
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.hideRegisterModal();
        this.showToast('Compte créé avec succès !', 'success');
        this.checkLoginStatus();
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
        this.showToast('Déconnexion réussie', 'info');
        this.checkLoginStatus();
    }

    handleAddAccount() {
        const name = document.getElementById('accountName').value;
        const type = document.getElementById('accountType').value;
        const balance = parseFloat(document.getElementById('initialBalance').value);

        const account = {
            id: Date.now(),
            name: name,
            type: type,
            balance: balance,
            userId: this.currentUser?.id || 1,
            createdAt: new Date().toISOString()
        };

        this.accounts.push(account);
        localStorage.setItem('accounts', JSON.stringify(this.accounts));

        // Ajouter une transaction initiale
        const transaction = {
            id: Date.now(),
            accountId: account.id,
            amount: balance,
            description: 'Solde initial',
            type: 'Credit',
            date: new Date().toISOString()
        };

        this.transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(this.transactions));

        this.hideAddAccountModal();
        this.showToast('Compte ajouté avec succès !', 'success');
        this.updateDashboard();
        this.updateChart();
        this.updateAccountsList();
    }

    updateDashboard() {
        const totalBalance = this.accounts.reduce((sum, account) => sum + account.balance, 0);
        const accountCount = this.accounts.length;

        document.getElementById('totalBalance').textContent = 
            new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'EUR' 
            }).format(totalBalance);

        document.getElementById('accountCount').textContent = accountCount;

        // Calculer l'évolution mensuelle (simulation)
        const monthlyChange = totalBalance * 0.05; // +5% pour la démo
        document.getElementById('monthlyChange').textContent = 
            new Intl.NumberFormat('fr-FR', { 
                style: 'currency', 
                currency: 'EUR',
                signDisplay: 'always'
            }).format(monthlyChange);
    }

    updateChart() {
        const ctx = document.getElementById('balanceChart').getContext('2d');
        
        if (window.balanceChartInstance) {
            window.balanceChartInstance.destroy();
        }

        if (this.accounts.length === 0) {
            ctx.fillStyle = '#9CA3AF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Aucun compte disponible', ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
        
        window.balanceChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.accounts.map(account => account.name),
                datasets: [{
                    data: this.accounts.map(account => account.balance),
                    backgroundColor: colors.slice(0, this.accounts.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    updateAccountsList() {
        const accountsList = document.getElementById('accountsList');
        
        if (this.accounts.length === 0) {
            accountsList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-plus-circle text-4xl mb-2"></i>
                    <p>Ajoutez votre premier compte</p>
                </div>
            `;
            return;
        }

        accountsList.innerHTML = this.accounts.map(account => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <i class="fas fa-credit-card text-blue-600"></i>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">${account.name}</h4>
                        <p class="text-sm text-gray-500">${this.getAccountTypeLabel(account.type)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold text-gray-900">
                        ${new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: 'EUR' 
                        }).format(account.balance)}
                    </p>
                </div>
            </div>
        `).join('');
    }

    updateTransactions() {
        const transactionsList = document.getElementById('transactionsList');
        const recentTransactions = this.transactions.slice(-5).reverse();

        if (recentTransactions.length === 0) {
            transactionsList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-receipt text-4xl mb-2"></i>
                    <p>Aucune transaction récente</p>
                </div>
            `;
            return;
        }

        transactionsList.innerHTML = recentTransactions.map(transaction => {
            const account = this.accounts.find(acc => acc.id === transaction.accountId);
            const isCredit = transaction.type === 'Credit';
            
            return `
                <div class="flex items-center justify-between p-3 border-b border-gray-200 last:border-b-0">
                    <div class="flex items-center">
                        <div class="w-8 h-8 ${isCredit ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mr-3">
                            <i class="fas ${isCredit ? 'fa-plus' : 'fa-minus'} ${isCredit ? 'text-green-600' : 'text-red-600'} text-sm"></i>
                        </div>
                        <div>
                            <p class="font-medium text-gray-900">${transaction.description}</p>
                            <p class="text-sm text-gray-500">${account ? account.name : 'Compte inconnu'}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold ${isCredit ? 'text-green-600' : 'text-red-600'}">
                            ${isCredit ? '+' : '-'}${new Intl.NumberFormat('fr-FR', { 
                                style: 'currency', 
                                currency: 'EUR' 
                            }).format(Math.abs(transaction.amount))}
                        </p>
                        <p class="text-sm text-gray-500">
                            ${new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }

    getAccountTypeLabel(type) {
        const labels = {
            'BankAccount': 'Compte Bancaire',
            'CreditCard': 'Carte de Crédit',
            'Cash': 'Espèces',
            'Investment': 'Investissement',
            'Savings': 'Épargne'
        };
        return labels[type] || type;
    }

    showLoginModal() {
        document.getElementById('loginModal').classList.remove('hidden');
    }

    hideLoginModal() {
        document.getElementById('loginModal').classList.add('hidden');
        document.getElementById('loginForm').reset();
    }

    showRegisterModal() {
        document.getElementById('registerModal').classList.remove('hidden');
        document.getElementById('loginModal').classList.add('hidden');
    }

    hideRegisterModal() {
        document.getElementById('registerModal').classList.add('hidden');
        document.getElementById('registerForm').reset();
    }

    showAddAccountModal() {
        if (!this.isLoggedIn) {
            this.showLoginModal();
            return;
        }
        document.getElementById('addAccountModal').classList.remove('hidden');
    }

    hideAddAccountModal() {
        document.getElementById('addAccountModal').classList.add('hidden');
        document.getElementById('addAccountForm').reset();
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

        // Animation d'entrée
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Auto-remove après 5 secondes
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

// Fonctions globales pour les modales
function showLoginModal() {
    window.app.showLoginModal();
}

function hideLoginModal() {
    window.app.hideLoginModal();
}

function showRegisterModal() {
    window.app.showRegisterModal();
}

function hideRegisterModal() {
    window.app.hideRegisterModal();
}

function showAddAccountModal() {
    window.app.showAddAccountModal();
}

function hideAddAccountModal() {
    window.app.hideAddAccountModal();
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PersonalFinanceApp();
});