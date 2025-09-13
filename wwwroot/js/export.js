// Export Page JavaScript - Système d'Export de Données
class ExportManager {
    constructor() {
        this.transactions = this.loadTransactions();
        this.accounts = this.loadAccounts();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateExportOptions();
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

    updateExportOptions() {
        const transactionCount = this.transactions.length;
        const accountCount = this.accounts.length;
        
        // Mettre à jour les compteurs
        const transactionCountElement = document.getElementById('transactionCount');
        const accountCountElement = document.getElementById('accountCount');
        
        if (transactionCountElement) transactionCountElement.textContent = transactionCount;
        if (accountCountElement) accountCountElement.textContent = accountCount;
    }

    exportToExcel() {
        try {
            this.showToast('Génération du fichier Excel...', 'info');
            
            // Préparer les données pour Excel
            const workbook = this.createExcelWorkbook();
            
            // Télécharger le fichier
            this.downloadFile(workbook, 'donnees-financieres.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            
            this.showToast('Fichier Excel téléchargé avec succès', 'success');
        } catch (error) {
            this.showToast('Erreur lors de l\'export Excel: ' + error.message, 'error');
        }
    }

    exportToCSV() {
        try {
            this.showToast('Génération du fichier CSV...', 'info');
            
            // Exporter les transactions
            const transactionsCSV = this.transactionsToCSV();
            this.downloadFile(transactionsCSV, 'transactions.csv', 'text/csv');
            
            // Exporter les comptes
            const accountsCSV = this.accountsToCSV();
            this.downloadFile(accountsCSV, 'comptes.csv', 'text/csv');
            
            this.showToast('Fichiers CSV téléchargés avec succès', 'success');
        } catch (error) {
            this.showToast('Erreur lors de l\'export CSV: ' + error.message, 'error');
        }
    }

    exportToPDF() {
        try {
            this.showToast('Génération du rapport PDF...', 'info');
            
            // Créer le contenu PDF
            const pdfContent = this.createPDFContent();
            
            // Ouvrir dans une nouvelle fenêtre pour impression
            const printWindow = window.open('', '_blank');
            printWindow.document.write(pdfContent);
            printWindow.document.close();
            
            // Déclencher l'impression
            setTimeout(() => {
                printWindow.print();
            }, 500);
            
            this.showToast('Rapport PDF généré', 'success');
        } catch (error) {
            this.showToast('Erreur lors de l\'export PDF: ' + error.message, 'error');
        }
    }

    exportToJSON() {
        try {
            this.showToast('Génération du fichier JSON...', 'info');
            
            const exportData = {
                accounts: this.accounts,
                transactions: this.transactions,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const jsonString = JSON.stringify(exportData, null, 2);
            this.downloadFile(jsonString, 'donnees-financieres.json', 'application/json');
            
            this.showToast('Fichier JSON téléchargé avec succès', 'success');
        } catch (error) {
            this.showToast('Erreur lors de l\'export JSON: ' + error.message, 'error');
        }
    }

    createExcelWorkbook() {
        // Simulation d'un workbook Excel simple
        const csvData = this.transactionsToCSV();
        return csvData;
    }

    transactionsToCSV() {
        if (this.transactions.length === 0) {
            return 'Aucune transaction trouvée';
        }

        const headers = ['Date', 'Description', 'Montant', 'Type', 'Catégorie', 'Compte', 'Notes', 'Tags'];
        const csvRows = [headers.join(',')];

        this.transactions.forEach(transaction => {
            const row = [
                transaction.date,
                `"${transaction.description}"`,
                transaction.amount,
                transaction.type,
                transaction.category,
                this.getAccountName(transaction.accountId),
                `"${transaction.notes || ''}"`,
                `"${transaction.tags ? transaction.tags.join(';') : ''}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    accountsToCSV() {
        if (this.accounts.length === 0) {
            return 'Aucun compte trouvé';
        }

        const headers = ['Nom', 'Type', 'Solde', 'Banque', 'Numéro', 'Devise', 'Date de création'];
        const csvRows = [headers.join(',')];

        this.accounts.forEach(account => {
            const row = [
                `"${account.name}"`,
                account.type,
                account.balance,
                `"${account.bank || ''}"`,
                `"${account.accountNumber || ''}"`,
                account.currency,
                account.createdAt
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    createPDFContent() {
        const currentDate = new Date().toLocaleDateString('fr-FR');
        const totalIncome = this.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = this.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const balance = totalIncome - totalExpenses;

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rapport Financier - ${currentDate}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .summary { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .section { margin: 30px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .positive { color: green; }
        .negative { color: red; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport Financier Personnel</h1>
        <p>Généré le ${currentDate}</p>
    </div>

    <div class="summary">
        <h2>Résumé Financier</h2>
        <p><strong>Total des revenus:</strong> <span class="positive">${totalIncome.toFixed(2)} €</span></p>
        <p><strong>Total des dépenses:</strong> <span class="negative">${totalExpenses.toFixed(2)} €</span></p>
        <p><strong>Solde:</strong> <span class="${balance >= 0 ? 'positive' : 'negative'}">${balance.toFixed(2)} €</span></p>
        <p><strong>Nombre de transactions:</strong> ${this.transactions.length}</p>
        <p><strong>Nombre de comptes:</strong> ${this.accounts.length}</p>
    </div>

    <div class="section">
        <h2>Liste des Comptes</h2>
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Solde</th>
                    <th>Banque</th>
                </tr>
            </thead>
            <tbody>
                ${this.accounts.map(account => `
                    <tr>
                        <td>${account.name}</td>
                        <td>${account.type}</td>
                        <td class="${account.balance >= 0 ? 'positive' : 'negative'}">${account.balance.toFixed(2)} €</td>
                        <td>${account.bank || 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Dernières Transactions</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Type</th>
                    <th>Catégorie</th>
                    <th>Compte</th>
                </tr>
            </thead>
            <tbody>
                ${this.transactions.slice(0, 20).map(transaction => `
                    <tr>
                        <td>${new Date(transaction.date).toLocaleDateString('fr-FR')}</td>
                        <td>${transaction.description}</td>
                        <td class="${transaction.amount >= 0 ? 'positive' : 'negative'}">${transaction.amount.toFixed(2)} €</td>
                        <td>${transaction.type}</td>
                        <td>${transaction.category}</td>
                        <td>${this.getAccountName(transaction.accountId)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="section">
        <p><em>Rapport généré automatiquement par Personal Finance App</em></p>
    </div>
</body>
</html>`;
    }

    getAccountName(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        return account?.name || 'Compte inconnu';
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    setupEventListeners() {
        // Boutons d'export
        const exportExcelBtn = document.getElementById('exportExcelBtn');
        const exportCSVBtn = document.getElementById('exportCSVBtn');
        const exportPDFBtn = document.getElementById('exportPDFBtn');
        const exportJSONBtn = document.getElementById('exportJSONBtn');

        if (exportExcelBtn) {
            exportExcelBtn.addEventListener('click', () => this.exportToExcel());
        }

        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', () => this.exportToCSV());
        }

        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', () => this.exportToPDF());
        }

        if (exportJSONBtn) {
            exportJSONBtn.addEventListener('click', () => this.exportToJSON());
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

// Fonctions d'export (compatibilité)
function exportToExcel() {
    if (window.exportManager) {
        window.exportManager.exportToExcel();
    }
}

function exportToCSV() {
    if (window.exportManager) {
        window.exportManager.exportToCSV();
    }
}

function exportToPDF() {
    if (window.exportManager) {
        window.exportManager.exportToPDF();
    }
}

// Initialisation
let exportManager;

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!window.authManager || !window.authManager.requireAuth()) {
        return;
    }

    // Initialiser les gestionnaires
    setupMobileNavigation();
    exportManager = new ExportManager();
    window.exportManager = exportManager; // Pour l'accès global
});