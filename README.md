# Pocket Board Finance

Application de gestion financière personnelle développée par Florian Anthony en 2024.

## 🚀 Fonctionnalités

- **Gestion des comptes** : Création et suivi de comptes multiples
- **Transactions** : Enregistrement et catégorisation des transactions
- **Statistiques** : Analyses et graphiques financiers
- **Export** : Export Excel, CSV et PDF
- **PWA** : Application web progressive installable
- **Responsive** : Interface adaptée mobile et desktop

## 📁 Structure du Projet

```
workspace/
├── wwwroot/                    # Frontend statique
│   ├── css/                   # Styles CSS
│   │   ├── common.css         # Styles communs
│   │   ├── components.css     # Styles des composants
│   │   ├── site.css           # Styles spécifiques au site
│   │   └── tailwind.css       # Framework CSS Tailwind
│   ├── js/                    # Scripts JavaScript
│   │   ├── auth.js            # Authentification
│   │   ├── common.js          # Fonctions communes
│   │   ├── components.js      # Système de composants
│   │   ├── api-service.js     # Service API
│   │   └── *.js               # Scripts spécifiques aux pages
│   ├── components/            # Composants HTML réutilisables
│   │   ├── header.html        # En-tête de page
│   │   ├── footer.html        # Pied de page
│   │   ├── head.html          # Section head HTML
│   │   └── scripts.html       # Scripts communs
│   ├── docs/                  # Documentation API
│   │   ├── index.html         # Interface de documentation
│   │   ├── api-spec.json      # Spécification API
│   │   └── openapi.json       # OpenAPI 3.0
│   ├── images/                # Images et icônes
│   ├── *.html                 # Pages de l'application
│   ├── manifest.json          # Manifest PWA
│   └── sw.js                  # Service Worker
├── Controllers/               # API Controllers (.NET)
│   ├── AuthController.cs      # Authentification
│   ├── AccountsController.cs  # Gestion des comptes
│   ├── ExportController.cs    # Export de données
│   └── HealthController.cs    # Santé de l'API
├── Models/                    # Modèles de données
│   ├── Account.cs             # Modèle compte
│   ├── ApplicationUser.cs     # Modèle utilisateur
│   ├── BalanceHistory.cs      # Historique des soldes
│   └── DTOs/                  # Data Transfer Objects
├── Services/                  # Services métier
│   ├── IAccountService.cs     # Interface service comptes
│   ├── AccountService.cs      # Service comptes
│   ├── IUserService.cs        # Interface service utilisateur
│   ├── UserService.cs         # Service utilisateur
│   └── *.cs                   # Autres services
├── Data/                      # Accès aux données
│   ├── ApplicationDbContext.cs # Contexte Entity Framework
│   └── DbInitializer.cs       # Initialisation base de données
├── Migrations/                # Migrations Entity Framework
├── Pages/                     # Pages Razor
├── Components/                # Composants Blazor
├── Hubs/                      # SignalR Hubs
├── HealthChecks/              # Vérifications de santé
├── config/                    # Fichiers de configuration
│   ├── vercel.json            # Configuration Vercel
│   └── tailwind.config.js     # Configuration Tailwind
├── scripts/                   # Scripts utilitaires
│   └── create-page.js         # Script de création de pages
├── docs/                      # Documentation du projet
├── PersonalFinanceApp.csproj  # Fichier projet .NET
├── Program.cs                 # Point d'entrée de l'application
├── Dockerfile                 # Configuration Docker
├── docker-compose.yml         # Composition Docker
├── package.json               # Configuration Node.js
└── README.md                  # Documentation principale
```

## 🛠️ Système de Composants

### Créer une nouvelle page

```bash
# Page vitrine (landing page)
node scripts/create-page.js ma-page landing

# Page protégée (nécessite authentification)
node scripts/create-page.js ma-page protected
```

### Composants disponibles

#### Header
- **Landing pages** : Navigation avec liens vers les pages publiques
- **Pages protégées** : Navigation avec liens vers les fonctionnalités + déconnexion

#### Footer
- Liens de navigation
- Informations de contact
- Liens sociaux

### Utilisation des composants

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Meta tags, CSS, etc. -->
    <link rel="stylesheet" href="/css/common.css">
    <link rel="stylesheet" href="/css/components.css">
</head>
<body>
    <!-- Header automatiquement injecté -->
    <div id="header-placeholder"></div>
    
    <!-- Votre contenu -->
    <main class="pt-16">
        <h1>Ma Page</h1>
        <!-- ... -->
    </main>
    
    <!-- Footer automatiquement injecté -->
    <div id="footer-placeholder"></div>

    <!-- Scripts -->
    <script src="/js/auth.js"></script>
    <script src="/js/common.js"></script>
    <script src="/js/components.js"></script>
</body>
</html>
```

## 📚 Documentation API

La documentation API complète est disponible sur `/docs` :

- **Swagger UI** : Interface interactive pour tester l'API
- **OpenAPI 3.0** : Spécification complète de l'API
- **Exemples** : Requêtes et réponses pour chaque endpoint

### Endpoints principaux

- `GET /api/health` - Santé de l'API
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/accounts` - Liste des comptes
- `GET /api/transactions` - Liste des transactions
- `GET /api/statistics` - Statistiques financières
- `GET /api/export/excel` - Export Excel

## 🚀 Déploiement

### Vercel (Frontend)

```bash
# Déployer automatiquement
git push origin main
```

### Configuration

Le fichier `vercel.json` configure :
- Routes pour les pages statiques
- Redirection `/docs` vers la documentation API
- Headers CORS pour l'API

## 🧪 Développement

### Prérequis

- Node.js (pour les scripts)
- .NET 8 (pour le backend)
- Git

### Scripts utiles

```bash
# Créer une nouvelle page
node scripts/create-page.js nom-page [landing|protected]

# Servir localement (frontend)
npx http-server wwwroot -p 8080 --cors

# Démarrer le backend (.NET)
dotnet run

# Construire le projet
dotnet build

# Tester l'API
curl http://localhost:5000/api/health

# Construire les assets frontend
npm run build
```

## 📱 PWA

L'application est une Progressive Web App avec :

- **Manifest** : Installation sur mobile/desktop
- **Service Worker** : Mise en cache et fonctionnement hors ligne
- **Responsive** : Adaptation mobile/desktop
- **Installable** : Ajout à l'écran d'accueil

## 🔒 Sécurité

- **JWT** : Authentification par tokens
- **HTTPS** : Chiffrement des communications
- **Validation** : Validation côté client et serveur
- **CORS** : Configuration sécurisée des origines

## 📄 Licence

Développé par Florian Anthony - 2024

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche feature
3. Implémenter les changements
4. Tester localement
5. Créer une Pull Request

## 📞 Support

- **Email** : contact@pocketboardfinance.com
- **LinkedIn** : https://linkedin.com/in/florian-anthony
- **Documentation** : `/docs`