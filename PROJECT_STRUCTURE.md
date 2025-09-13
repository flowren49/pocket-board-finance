# Structure du Projet - Pocket Board Finance

## 📁 Structure Générale

```
/workspace/
├── 📄 README.md                    # Documentation principale
├── 📄 MOBILE_IMPROVEMENTS.md       # Documentation améliorations mobile
├── 📄 PROJECT_STRUCTURE.md         # Ce fichier
├── 📄 DEPLOYMENT_GUIDE.md          # Guide de déploiement
├── 📄 VERCEL_DEPLOYMENT.md         # Déploiement Vercel
├── 📄 vercel.json                  # Configuration Vercel
├── 📄 package.json                 # Dépendances Node.js
├── 📄 tailwind.config.js           # Configuration Tailwind CSS
├── 📄 build.sh                     # Script de build
├── 📄 deploy-to-vercel.sh          # Script de déploiement
├── 📄 start-dev.sh                 # Script de développement
│
├── 🔧 Backend ASP.NET Core/
│   ├── 📄 PersonalFinanceApp.csproj
│   ├── 📄 Program.cs
│   ├── 📄 appsettings.json
│   ├── 📄 Dockerfile
│   ├── 📄 docker-compose.yml
│   │
│   ├── 📁 Controllers/             # API Controllers
│   │   ├── AuthController.cs
│   │   ├── AccountsController.cs
│   │   ├── ExportController.cs
│   │   ├── HealthController.cs
│   │   └── HomeController.cs
│   │
│   ├── 📁 Models/                  # Modèles de données
│   │   ├── Account.cs
│   │   ├── ApplicationUser.cs
│   │   ├── BalanceHistory.cs
│   │   ├── ErrorViewModel.cs
│   │   └── 📁 DTOs/
│   │
│   ├── 📁 Services/                # Services métier
│   │   ├── AuthService.cs
│   │   ├── AccountService.cs
│   │   └── ExportService.cs
│   │
│   ├── 📁 Data/                    # Accès aux données
│   │   ├── ApplicationDbContext.cs
│   │   └── DbInitializer.cs
│   │
│   ├── 📁 Hubs/                    # SignalR Hubs
│   │   └── BalanceHub.cs
│   │
│   ├── 📁 Migrations/              # Migrations EF Core
│   │   ├── ApplicationDbContextModelSnapshot.cs
│   │   └── InitialCreate.cs
│   │
│   ├── 📁 Tests/                   # Tests unitaires
│   │   ├── PersonalFinanceApp.Tests.csproj
│   │   ├── 📁 Controllers/
│   │   └── 📁 Services/
│   │
│   ├── 📁 Views/                   # Vues MVC
│   │   ├── 📁 Home/
│   │   └── 📁 Shared/
│   │
│   ├── 📁 Pages/                   # Pages Blazor
│   │
│   ├── 📁 Components/              # Composants Blazor
│   │   └── SignalRNotificationComponent.razor
│   │
│   └── 📁 Shared/                  # Composants partagés
│       └── MainLayout.razor
│
└── 🌐 Frontend (wwwroot)/
    ├── 📄 index.html               # Page d'accueil (landing page)
    ├── 📄 login.html               # Page de connexion
    ├── 📄 register.html            # Page d'inscription
    ├── 📄 dashboard.html           # Tableau de bord
    ├── 📄 accounts.html            # Gestion des comptes
    ├── 📄 transactions.html        # Gestion des transactions
    ├── 📄 statistics.html          # Statistiques et graphiques
    ├── 📄 export.html              # Export de données
    ├── 📄 test-final.html          # Page de tests finaux
    │
    ├── 📁 js/                      # JavaScript
    │   ├── 📄 auth.js              # Authentification
    │   ├── 📄 api-config.js        # Configuration API
    │   ├── 📄 api-service.js       # Service API
    │   ├── 📄 backend-integration.js # Intégration backend
    │   ├── 📄 dashboard.js         # Dashboard
    │   ├── 📄 accounts.js          # Gestion comptes
    │   ├── 📄 transactions.js      # Gestion transactions
    │   ├── 📄 statistics.js        # Statistiques
    │   ├── 📄 export.js            # Export
    │   ├── 📄 login.js             # Connexion
    │   ├── 📄 register.js          # Inscription
    │   ├── 📄 pwa.js               # PWA
    │   └── 📄 improve-mobile-content.js # Améliorations mobile
    │
    ├── 📁 css/                     # Styles
    │   ├── 📄 tailwind.css         # Tailwind CSS compilé
    │   ├── 📄 input.css            # Fichier source Tailwind
    │   └── 📄 site.css             # Styles personnalisés
    │
    ├── 📁 images/                  # Images
    │   ├── 📄 icon-192x192.png     # Icône PWA
    │   └── 📄 icon-192x192.svg     # Icône PWA SVG
    │
    ├── 📄 manifest.json            # Manifest PWA
    └── 📄 sw.js                    # Service Worker
```

## 🎯 Pages Frontend

### Pages Publiques
- **`index.html`** - Landing page avec présentation de l'application
- **`login.html`** - Page de connexion avec authentification JWT
- **`register.html`** - Page d'inscription pour nouveaux utilisateurs

### Pages Protégées (Authentification requise)
- **`dashboard.html`** - Vue d'ensemble avec graphiques et résumé
- **`accounts.html`** - Gestion complète des comptes (CRUD)
- **`transactions.html`** - Gestion des transactions avec filtres
- **`statistics.html`** - Graphiques et analyses détaillées
- **`export.html`** - Export de données (Excel, CSV, PDF)

### Pages Utilitaires
- **`test-final.html`** - Tests complets de l'application

## 🔧 JavaScript Modulaire

### Authentification & API
- **`auth.js`** - Gestion de l'authentification JWT
- **`api-config.js`** - Configuration des endpoints API
- **`api-service.js`** - Service générique pour les appels API
- **`backend-integration.js`** - Synchronisation et intégration backend

### Pages Spécifiques
- **`dashboard.js`** - Logique du tableau de bord
- **`accounts.js`** - Gestion complète des comptes
- **`transactions.js`** - Gestion des transactions
- **`statistics.js`** - Graphiques et statistiques
- **`export.js`** - Export de données

### Utilitaires
- **`login.js`** - Formulaires de connexion
- **`register.js`** - Formulaires d'inscription
- **`pwa.js`** - Fonctionnalités PWA
- **`improve-mobile-content.js`** - Améliorations mobiles automatiques

## 🎨 Styles & Design

### CSS Framework
- **Tailwind CSS** - Framework CSS utility-first
- **Font Awesome** - Icônes
- **Chart.js** - Graphiques

### Design System
- **Couleurs primaires** : Bleu (#3B82F6)
- **Responsive** : Mobile-first avec breakpoints
- **Animations** : Transitions CSS fluides
- **PWA** : Service Worker et manifest

## 🚀 Déploiement

### Frontend (Vercel)
- **Statique** : HTML/CSS/JS
- **CDN** : Tailwind CSS via CDN
- **PWA** : Installation et mode hors ligne

### Backend (Docker)
- **ASP.NET Core** : API REST
- **SQLite** : Base de données
- **JWT** : Authentification
- **SignalR** : Temps réel

## 📱 Fonctionnalités

### Core
- ✅ Authentification JWT sécurisée
- ✅ Gestion des comptes (CRUD)
- ✅ Gestion des transactions (CRUD)
- ✅ Statistiques et graphiques
- ✅ Export de données

### PWA
- ✅ Installation sur mobile/desktop
- ✅ Mode hors ligne
- ✅ Notifications push
- ✅ Service Worker

### Mobile
- ✅ Design responsive
- ✅ Menu burger optimisé
- ✅ Navigation intuitive
- ✅ Tailles tactiles (44px minimum)

## 🔒 Sécurité

- **Authentification JWT** avec refresh tokens
- **Validation côté client et serveur**
- **Protection CSRF**
- **Chiffrement des données sensibles**
- **HTTPS obligatoire en production**

## 📊 Performance

- **Lazy loading** des composants
- **Compression** des assets
- **Cache** intelligent
- **Optimisation** des images
- **Code splitting** JavaScript

## 🧪 Tests

- **Tests unitaires** backend (.NET)
- **Tests d'intégration** API
- **Tests end-to-end** frontend
- **Tests de performance**
- **Tests de sécurité**

---

**Projet nettoyé et optimisé** ✅  
**Prêt pour la production** 🚀