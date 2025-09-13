// PWA Service Worker Registration and Features
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupNotificationPermission();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Écouter les mises à jour
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        // Écouter l'événement beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Afficher le bouton d'installation
            const installBtn = document.getElementById('installBtn');
            if (installBtn) {
                installBtn.classList.remove('hidden');
                installBtn.addEventListener('click', () => {
                    this.installApp();
                });
            }
        });

        // Écouter l'événement appinstalled
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.deferredPrompt = null;
            const installBtn = document.getElementById('installBtn');
            if (installBtn) {
                installBtn.classList.add('hidden');
            }
        });
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            this.deferredPrompt = null;
        }
    }

    setupNotificationPermission() {
        // Demander la permission pour les notifications
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                console.log('Notification permission:', permission);
            });
        }
    }

    showUpdateNotification() {
        if (window.app) {
            window.app.showToast('Une nouvelle version est disponible ! Rechargez la page.', 'info');
        }
    }

    // Fonction pour envoyer des notifications
    static showNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: options.body || '',
                icon: options.icon || '/images/icon-192x192.png',
                badge: '/images/icon-72x72.png',
                tag: 'finance-app-notification',
                requireInteraction: options.requireInteraction || false,
                silent: options.silent || false,
                ...options
            });

            // Gérer le clic sur la notification
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return notification;
        }
    }

    // Fonction pour synchroniser les données offline
    static async syncOfflineData() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('sync-finance-data');
                console.log('Background sync registered');
            } catch (error) {
                console.log('Background sync failed:', error);
            }
        }
    }
}

// Initialiser le gestionnaire PWA
document.addEventListener('DOMContentLoaded', () => {
    new PWAManager();
});

// Exposer les fonctions globalement
window.PWAManager = PWAManager;