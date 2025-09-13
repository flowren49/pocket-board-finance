// Statistics JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialize PWA
    if (window.PWAManager) {
        new PWAManager();
    }
    
    // Initialize charts
    initIncomeExpensesChart();
    initSpendingCategoriesChart();
    initMonthlyTrendChart();
    initAccountPerformanceChart();
    
    // Setup logout button
    setupLogoutButton();
    
    // Setup mobile navigation
    setupMobileNavigation();
});

function setupLogoutButton() {
    const logoutBtn = document.getElementById('loginBtn');
    if (logoutBtn) {
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt mr-1"></i>Déconnexion';
        logoutBtn.onclick = () => window.authManager.logout();
    }
}

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

function initIncomeExpensesChart() {
    const ctx = document.getElementById('incomeExpensesChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            datasets: [
                {
                    label: 'Revenus',
                    data: [800, 1200, 900, 350],
                    backgroundColor: '#10B981',
                    borderRadius: 4
                },
                {
                    label: 'Dépenses',
                    data: [600, 850, 720, 480],
                    backgroundColor: '#EF4444',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function initSpendingCategoriesChart() {
    const ctx = document.getElementById('spendingCategoriesChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Alimentation', 'Transport', 'Logement', 'Loisirs', 'Santé', 'Autres'],
            datasets: [{
                data: [450, 320, 800, 180, 100, 200],
                backgroundColor: [
                    '#3B82F6',
                    '#10B981',
                    '#F59E0B',
                    '#EF4444',
                    '#8B5CF6',
                    '#6B7280'
                ],
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

function initMonthlyTrendChart() {
    const ctx = document.getElementById('monthlyTrendChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct'],
            datasets: [{
                label: 'Solde (€)',
                data: [12000, 12500, 13100, 12800, 13500, 14200, 14800, 15420, 15100, 15420],
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
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
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

function initAccountPerformanceChart() {
    const ctx = document.getElementById('accountPerformanceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Croissance', 'Stabilité', 'Liquidité', 'Rendement', 'Sécurité'],
            datasets: [
                {
                    label: 'Compte Principal',
                    data: [3, 5, 5, 2, 5],
                    borderColor: '#3B82F6',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    pointBackgroundColor: '#3B82F6'
                },
                {
                    label: 'Investissements',
                    data: [5, 3, 2, 5, 3],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    pointBackgroundColor: '#10B981'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}