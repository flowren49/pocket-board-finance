// Accounts JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialize PWA
    if (window.PWAManager) {
        new PWAManager();
    }
    
    // Setup form handler
    document.getElementById('addAccountForm').addEventListener('submit', handleAddAccount);
    
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

function showAddAccountModal() {
    document.getElementById('addAccountModal').classList.remove('hidden');
}

function hideAddAccountModal() {
    document.getElementById('addAccountModal').classList.add('hidden');
    document.getElementById('addAccountForm').reset();
}

function handleAddAccount(e) {
    e.preventDefault();
    
    const name = document.getElementById('accountName').value;
    const type = document.getElementById('accountType').value;
    const bank = document.getElementById('accountBank').value;
    const balance = parseFloat(document.getElementById('initialBalance').value);
    
    // Simulate adding account
    showToast(`Compte "${name}" ajouté avec succès !`, 'success');
    hideAddAccountModal();
    
    // In a real app, you would send this to your backend
    console.log('New account:', { name, type, bank, balance });
}

function editAccount(id) {
    showToast('Fonctionnalité d\'édition à venir', 'info');
    // In a real app, you would open an edit modal
}

function deleteAccount(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
        showToast('Compte supprimé avec succès', 'success');
        // In a real app, you would send a delete request to your backend
    }
}

// Toast notification system
function showToast(message, type = 'info') {
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