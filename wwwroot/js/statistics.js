// Statistics Page JavaScript - Graphiques et Statistiques Fonctionnels
class StatisticsManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.accounts = this.loadAccounts();
        this.currentPeriod = 'month';
        this.charts = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePeriodSelector();
        this.renderStatistics();
        this.initCharts();
    }

    loadTransactions() {
        const saved = localStorage.getItem('pf_transactions');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    loadAccounts() {
        const saved = localStorage.getItem('pf_accounts');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    updatePeriodSelector() {
        const periodSelect = document.getElementById('periodSelect');
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                this.currentPeriod = e.target.value;
                this.renderStatistics();
                this.updateCharts();
            });
        }
    }

    getDateRange() {
        const now = new Date();
        let startDate, endDate;

        switch (this.currentPeriod) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                endDate = now;
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                endDate = now;
        }

        return { startDate, endDate };
    }

    getFilteredTransactions() {
        const { startDate, endDate } = this.getDateRange();
        
        return this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= endDate;
        });
    }

    calculateStatistics() {
        const filtered = this.getFilteredTransactions();
        
        const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const balance = income - expenses;
        
        const categoryStats = this.getCategoryStatistics(filtered);
        const accountStats = this.getAccountStatistics(filtered);
        const monthlyTrend = this.getMonthlyTrend();
        
        return {
            totalIncome: income,
            totalExpenses: expenses,
            balance: balance,
            transactionCount: filtered.length,
            categoryStats,
            accountStats,
            monthlyTrend
        };
    }

    getCategoryStatistics(transactions) {
        const categories = {};
        
        transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
                const category = transaction.category;
                if (!categories[category]) {
                    categories[category] = {
                        name: this.getCategoryName(category, 'expense'),
                        amount: 0,
                        count: 0,
                        color: this.getCategoryColor(category, 'expense')
                    };
                }
                categories[category].amount += Math.abs(transaction.amount);
                categories[category].count++;
            }
        });

        return Object.values(categories).sort((a, b) => b.amount - a.amount);
    }

    getAccountStatistics(transactions) {
        const accounts = {};
        
        transactions.forEach(transaction => {
            const accountId = transaction.accountId;
            if (!accounts[accountId]) {
                const account = this.accounts.find(acc => acc.id === accountId);
                accounts[accountId] = {
                    name: account?.name || 'Compte inconnu',
                    income: 0,
                    expenses: 0,
                    balance: 0,
                    color: account?.color || '#6B7280'
                };
            }
            
            if (transaction.type === 'income') {
                accounts[accountId].income += transaction.amount;
            } else if (transaction.type === 'expense') {
                accounts[accountId].expenses += Math.abs(transaction.amount);
            }
            
            accounts[accountId].balance = accounts[accountId].income - accounts[accountId].expenses;
        });

        return Object.values(accounts);
    }

    getMonthlyTrend() {
        const { startDate, endDate } = this.getDateRange();
        const months = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            
            const monthTransactions = this.transactions.filter(t => {
                const transactionDate = new Date(t.date);
                return transactionDate >= monthStart && transactionDate <= monthEnd;
            });
            
            const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
            
            months.push({
                month: currentDate.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }),
                income,
                expenses,
                balance: income - expenses
            });
            
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        return months;
    }

    getCategoryName(categoryId, type) {
        const categories = {
            income: {
                salary: 'Salaire',
                freelance: 'Freelance',
                investment: 'Investissements',
                bonus: 'Prime',
                other: 'Autre'
            },
            expense: {
                housing: 'Logement',
                food: 'Alimentation',
                transport: 'Transport',
                health: 'Santé',
                entertainment: 'Loisirs',
                shopping: 'Shopping',
                bills: 'Factures',
                other: 'Autre'
            }
        };
        return categories[type]?.[categoryId] || categoryId;
    }

    getCategoryColor(categoryId, type) {
        const colors = {
            income: {
                salary: '#10B981',
                freelance: '#3B82F6',
                investment: '#8B5CF6',
                bonus: '#F59E0B',
                other: '#6B7280'
            },
            expense: {
                housing: '#EF4444',
                food: '#F59E0B',
                transport: '#3B82F6',
                health: '#10B981',
                entertainment: '#8B5CF6',
                shopping: '#EC4899',
                bills: '#6B7280',
                other: '#6B7280'
            }
        };
        return colors[type]?.[categoryId] || '#6B7280';
    }

    renderStatistics() {
        const stats = this.calculateStatistics();
        
        // Mettre à jour les cartes de statistiques
        this.updateStatsCards(stats);
        
        // Mettre à jour les graphiques
        this.updateCharts();
    }

    updateStatsCards(stats) {
        const incomeCard = document.getElementById('totalIncome');
        const expenseCard = document.getElementById('totalExpenses');
        const balanceCard = document.getElementById('totalBalance');
        const countCard = document.getElementById('transactionCount');

        if (incomeCard) incomeCard.textContent = `${stats.totalIncome.toFixed(2)} €`;
        if (expenseCard) expenseCard.textContent = `${stats.totalExpenses.toFixed(2)} €`;
        if (balanceCard) balanceCard.textContent = `${stats.balance.toFixed(2)} €`;
        if (countCard) countCard.textContent = stats.transactionCount.toString();

        // Mettre à jour les couleurs selon le solde
        if (balanceCard) {
            balanceCard.className = `text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`;
        }
    }

    initCharts() {
        this.initIncomeExpensesChart();
        this.initCategoryChart();
        this.initAccountChart();
        this.initTrendChart();
    }

    initIncomeExpensesChart() {
        const ctx = document.getElementById('incomeExpensesChart');
        if (!ctx) return;

        if (this.charts.incomeExpenses) {
            this.charts.incomeExpenses.destroy();
        }

        const stats = this.calculateStatistics();
        
        this.charts.incomeExpenses = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Revenus', 'Dépenses'],
                datasets: [{
                    data: [stats.totalIncome, stats.totalExpenses],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderWidth: 0
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

    initCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        const stats = this.calculateStatistics();
        const categoryStats = stats.categoryStats.slice(0, 5); // Top 5 catégories

        this.charts.category = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categoryStats.map(cat => cat.name),
                datasets: [{
                    label: 'Montant (€)',
                    data: categoryStats.map(cat => cat.amount),
                    backgroundColor: categoryStats.map(cat => cat.color),
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(0) + ' €';
                            }
                        }
                    }
                }
            }
        });
    }

    initAccountChart() {
        const ctx = document.getElementById('accountChart');
        if (!ctx) return;

        if (this.charts.account) {
            this.charts.account.destroy();
        }

        const stats = this.calculateStatistics();

        this.charts.account = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: stats.accountStats.map(acc => acc.name),
                datasets: [{
                    data: stats.accountStats.map(acc => acc.balance),
                    backgroundColor: stats.accountStats.map(acc => acc.color),
                    borderWidth: 0
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

    initTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        if (this.charts.trend) {
            this.charts.trend.destroy();
        }

        const monthlyTrend = this.getMonthlyTrend();

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyTrend.map(m => m.month),
                datasets: [
                    {
                        label: 'Revenus',
                        data: monthlyTrend.map(m => m.income),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Dépenses',
                        data: monthlyTrend.map(m => m.expenses),
                        borderColor: '#EF4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(0) + ' €';
                            }
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        this.initIncomeExpensesChart();
        this.initCategoryChart();
        this.initAccountChart();
        this.initTrendChart();
    }

    setupEventListeners() {
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

        // Redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.updateCharts();
            }, 100);
        });
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

// Initialisation
let statisticsManager;

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialiser les gestionnaires
    setupMobileNavigation();
    statisticsManager = new StatisticsManager();
    window.statisticsManager = statisticsManager; // Pour l'accès global
});