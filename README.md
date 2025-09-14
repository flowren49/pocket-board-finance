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
│   ├── css/
│   │   ├── common.css         # Styles communs
│   │   └── components.css     # Styles des composants
│   ├── js/
│   │   ├── auth.js            # Authentification
│   │   ├── common.js          # Fonctions communes
│   │   └── components.js      # Système de composants
│   ├── templates/
│   │   └── base-template.html # Template de base
│   ├── docs/                  # Documentation API
│   └── *.html                 # Pages de l'application
├── Controllers/               # API Controllers (.NET)
├── Models/                    # Modèles de données
├── Services/                  # Services métier
└── create-page.js            # Script de création de pages
```

## 🛠️ Système de Composants

### Créer une nouvelle page

```bash
# Page vitrine (landing page)
node create-page.js ma-page landing

# Page protégée (nécessite authentification)
node create-page.js ma-page protected
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
node create-page.js nom-page [landing|protected]

# Servir localement
npx http-server wwwroot -p 8080 --cors

# Tester l'API
curl http://localhost:5000/api/health
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