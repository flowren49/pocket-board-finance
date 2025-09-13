// Export JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialize PWA
    if (window.PWAManager) {
        new PWAManager();
    }
    
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

function exportToExcel() {
    showToast('Export Excel en cours de génération...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        showToast('Export Excel terminé ! Téléchargement démarré.', 'success');
        // In a real app, you would trigger the actual download
        simulateDownload('export_finances.xlsx');
    }, 2000);
}

function exportToCSV() {
    showToast('Export CSV en cours de génération...', 'info');
    
    setTimeout(() => {
        showToast('Export CSV terminé ! Téléchargement démarré.', 'success');
        simulateDownload('export_finances.csv');
    }, 1500);
}

function exportToPDF() {
    showToast('Génération du rapport PDF...', 'info');
    
    setTimeout(() => {
        showToast('Rapport PDF généré avec succès !', 'success');
        simulateDownload('rapport_finances.pdf');
    }, 3000);
}

function exportToJSON() {
    showToast('Export JSON en cours...', 'info');
    
    setTimeout(() => {
        showToast('Export JSON terminé !', 'success');
        simulateDownload('export_finances.json');
    }, 1000);
}

function simulateDownload(filename) {
    // Create a dummy file content
    const content = 'Données financières exportées\n' + 
                   'Date: ' + new Date().toLocaleDateString() + '\n' +
                   'Fichier: ' + filename + '\n' +
                   'Ceci est un exemple de contenu exporté.';
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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