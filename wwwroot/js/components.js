// Components system for reusable HTML elements - Avoid code repetition

// Header component for landing pages
function createHeader(currentPage = '') {
    const pages = [
        { name: 'Accueil', href: 'index.html', icon: 'fas fa-home' },
        { name: 'Fonctionnalités', href: 'features.html', icon: 'fas fa-star' },
        { name: 'Tarifs', href: 'pricing.html', icon: 'fas fa-euro-sign' },
        { name: 'À Propos', href: 'about.html', icon: 'fas fa-info-circle' },
        { name: 'Contact', href: 'contact.html', icon: 'fas fa-envelope' },
        { name: 'Aide', href: 'help.html', icon: 'fas fa-question-circle' }
    ];

    const isActive = (page) => currentPage === page ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600';

    return `
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div class="max-w-7xl mx-auto container-padding">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <a href="index.html" class="text-xl sm:text-2xl font-bold gradient-text flex items-center">
                            <i class="fas fa-wallet mr-2 sm:mr-3 text-blue-600"></i>
                            <span class="hidden sm:inline">Pocket Board Finance</span>
                            <span class="sm:hidden">PBF</span>
                        </a>
                    </div>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="desktop-nav hidden md:flex items-center space-x-8">
                    ${pages.map(page => `
                        <a href="${page.href}" class="${isActive(page.href)} font-medium transition-colors">
                            <i class="${page.icon} mr-2"></i>${page.name}
                        </a>
                    `).join('')}
                    <a href="login.html" class="btn-primary text-white px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base">
                        <i class="fas fa-sign-in-alt mr-2"></i>
                        Connexion
                    </a>
                    <a href="register.html" class="btn-primary text-white px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base">
                        Commencer
                    </a>
                    
                    <!-- Mobile Menu Button -->
                    <button class="hamburger md:hidden p-2" onclick="toggleMobileNav()">
                        <i class="fas fa-bars text-gray-700 text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Mobile Navigation -->
        <div class="mobile-nav" id="mobileNav">
            <div class="mobile-nav-content">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center">
                            <i class="fas fa-wallet text-blue-600 text-2xl mr-3"></i>
                            <span class="text-xl font-bold text-gray-800">Pocket Board Finance</span>
                        </div>
                        <button onclick="toggleMobileNav()" class="p-2">
                            <i class="fas fa-times text-gray-600 text-xl"></i>
                        </button>
                    </div>
                    
                    <nav class="space-y-4">
                        ${pages.map(page => `
                            <a href="${page.href}" class="block py-3 px-4 ${isActive(page.href)} hover:bg-blue-50 rounded-lg transition-colors">
                                <i class="${page.icon} mr-3"></i>${page.name}
                            </a>
                        `).join('')}
                    </nav>
                    
                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <a href="login.html" class="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium mb-3">
                            <i class="fas fa-sign-in-alt mr-2"></i>
                            Connexion
                        </a>
                        <a href="register.html" class="block w-full bg-gray-900 text-white text-center py-3 px-4 rounded-lg font-medium">
                            <i class="fas fa-user-plus mr-2"></i>
                            S'inscrire
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
}

// Footer component for landing pages
function createFooter() {
    return `
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto container-padding">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Brand -->
                <div class="col-span-1 md:col-span-2">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-wallet text-blue-400 text-2xl mr-3"></i>
                        <span class="text-xl font-bold">Pocket Board Finance</span>
                    </div>
                    <p class="text-gray-400 mb-6 max-w-md">
                        L'application de gestion financière personnelle la plus simple et sécurisée. 
                        Développée par Florian Anthony en 2024.
                    </p>
                    <div class="flex space-x-4">
                        <a href="https://linkedin.com/in/florian-anthony" class="text-gray-400 hover:text-blue-400 transition-colors">
                            <i class="fab fa-linkedin text-xl"></i>
                        </a>
                    </div>
                </div>
                
                <!-- Links -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Navigation</h3>
                    <ul class="space-y-2">
                        <li><a href="index.html" class="text-gray-400 hover:text-white transition-colors">Accueil</a></li>
                        <li><a href="features.html" class="text-gray-400 hover:text-white transition-colors">Fonctionnalités</a></li>
                        <li><a href="pricing.html" class="text-gray-400 hover:text-white transition-colors">Tarifs</a></li>
                        <li><a href="about.html" class="text-gray-400 hover:text-white transition-colors">À Propos</a></li>
                    </ul>
                </div>
                
                <!-- Support -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Support</h3>
                    <ul class="space-y-2">
                        <li><a href="contact.html" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                        <li><a href="help.html" class="text-gray-400 hover:text-white transition-colors">Aide</a></li>
                        <li><a href="privacy.html" class="text-gray-400 hover:text-white transition-colors">Confidentialité</a></li>
                        <li><a href="login.html" class="text-gray-400 hover:text-white transition-colors">Connexion</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-8 pt-8 text-center">
                <p class="text-gray-400">
                    © 2024 Pocket Board Finance. Développé par Florian Anthony. Tous droits réservés.
                </p>
            </div>
        </div>
    </footer>`;
}

// Protected pages header component
function createProtectedHeader(currentPage = '') {
    const pages = [
        { name: 'Tableau de bord', href: 'dashboard.html', icon: 'fas fa-chart-line' },
        { name: 'Comptes', href: 'accounts.html', icon: 'fas fa-wallet' },
        { name: 'Transactions', href: 'transactions.html', icon: 'fas fa-exchange-alt' },
        { name: 'Statistiques', href: 'statistics.html', icon: 'fas fa-chart-bar' },
        { name: 'Export', href: 'export.html', icon: 'fas fa-download' }
    ];

    const isActive = (page) => currentPage === page ? 'nav-link-active' : 'nav-link-inactive';

    return `
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div class="max-w-7xl mx-auto container-padding">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <a href="dashboard.html" class="text-xl sm:text-2xl font-bold gradient-text flex items-center">
                            <i class="fas fa-wallet mr-2 sm:mr-3 text-blue-600"></i>
                            <span class="hidden sm:inline">Pocket Board Finance</span>
                            <span class="sm:hidden">PBF</span>
                        </a>
                    </div>
                </div>
                
                <!-- Desktop Navigation -->
                <div class="desktop-nav hidden md:flex items-center space-x-6">
                    ${pages.map(page => `
                        <a href="${page.href}" class="nav-link ${isActive(page.href)}">
                            <i class="${page.icon} mr-2"></i>${page.name}
                        </a>
                    `).join('')}
                    <button onclick="logout()" class="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        <i class="fas fa-sign-out-alt mr-2"></i>
                        Déconnexion
                    </button>
                    
                    <!-- Mobile Menu Button -->
                    <button class="hamburger md:hidden p-2 rounded-xl shadow-xl hover:shadow-2xl border border-gray-200" onclick="toggleMobileNav()">
                        <span class="hamburger-line bg-gray-700"></span>
                        <span class="hamburger-line bg-gray-700"></span>
                        <span class="hamburger-line bg-gray-700"></span>
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Mobile Sidebar -->
        <div class="mobile-sidebar fixed inset-0 z-50 hidden" id="sidebar">
            <div class="absolute inset-0 bg-black bg-opacity-50" onclick="toggleMobileNav()"></div>
            <div class="relative ml-auto w-72 h-full bg-white shadow-xl">
                <div class="flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between p-6 border-b border-gray-200">
                        <div class="flex items-center">
                            <i class="fas fa-wallet text-blue-600 text-2xl mr-3"></i>
                            <span class="text-xl font-bold text-gray-800">PBF</span>
                        </div>
                        <button onclick="toggleMobileNav()" class="p-2 hover:bg-gray-100 rounded-lg">
                            <i class="fas fa-times text-gray-600 text-xl"></i>
                        </button>
                    </div>
                    
                    <!-- Navigation -->
                    <nav class="flex-1 p-6">
                        <div class="space-y-2">
                            ${pages.map(page => `
                                <a href="${page.href}" class="nav-link ${isActive(page.href)} block py-3 px-4 rounded-lg">
                                    <i class="${page.icon} mr-3"></i>${page.name}
                                </a>
                            `).join('')}
                        </div>
                        
                        <!-- Separator -->
                        <div class="my-6 border-t border-gray-200"></div>
                        
                        <!-- Quick Actions -->
                        <div class="space-y-2">
                            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Actions rapides</h3>
                            <button onclick="showQuickAdd()" class="nav-link-inactive block w-full text-left py-3 px-4 rounded-lg">
                                <i class="fas fa-plus mr-3"></i>Ajout rapide
                            </button>
                            <button onclick="showSettings()" class="nav-link-inactive block w-full text-left py-3 px-4 rounded-lg">
                                <i class="fas fa-cog mr-3"></i>Paramètres
                            </button>
                        </div>
                    </nav>
                    
                    <!-- User Info -->
                    <div class="p-6 border-t border-gray-200 bg-gray-50">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-user text-white"></i>
                            </div>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900" id="userName">Utilisateur</p>
                                <p class="text-xs text-gray-500">Connecté</p>
                            </div>
                            <button onclick="logout()" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
}

// Function to inject header into page
function injectHeader(currentPage = '') {
    const headerElement = document.querySelector('#header-placeholder');
    if (headerElement) {
        headerElement.innerHTML = createHeader(currentPage);
    }
}

// Function to inject footer into page
function injectFooter() {
    const footerElement = document.querySelector('#footer-placeholder');
    if (footerElement) {
        footerElement.innerHTML = createFooter();
    }
}

// Function to inject protected header into page
function injectProtectedHeader(currentPage = '') {
    const headerElement = document.querySelector('#header-placeholder');
    if (headerElement) {
        headerElement.innerHTML = createProtectedHeader(currentPage);
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Auto-inject components if placeholders exist
    if (document.querySelector('#header-placeholder')) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage.includes('dashboard') || currentPage.includes('accounts') || 
            currentPage.includes('transactions') || currentPage.includes('statistics') || 
            currentPage.includes('export')) {
            injectProtectedHeader(currentPage);
        } else {
            injectHeader(currentPage);
        }
    }
    
    if (document.querySelector('#footer-placeholder')) {
        injectFooter();
    }
});