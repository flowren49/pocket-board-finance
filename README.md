# Personal Finance App

Une application web PWA (Progressive Web App) développée en C# ASP.NET Core MVC pour la gestion des finances personnelles de manière sécurisée et intuitive.

## 🚀 Fonctionnalités

### 🔐 Authentification et sécurité
- Inscription et connexion sécurisées avec JWT
- Réinitialisation de mot de passe
- Authentification multi-facteurs (2FA) - optionnelle
- Protection contre les attaques courantes (XSS, CSRF, SQL Injection)

### 💰 Gestion des comptes
- Création, modification et suppression de comptes
- Types de comptes : Courant, Épargne, Crédit, Investissement, Espèces, Autres
- Suivi des soldes actuels et historiques
- Mise à jour manuelle des soldes avec historique

### 📊 Statistiques et reporting
- Tableau de bord avec vue d'ensemble des finances
- Graphiques d'évolution des soldes
- Calcul des gains/pertes totaux et par compte
- Export des données en Excel et CSV

### 📱 PWA (Progressive Web App)
- Interface responsive adaptée mobile/tablette
- Installation sur appareils
- Fonctionnalités hors ligne
- Notifications push en temps réel
- Service Worker pour la mise en cache

## 🛠️ Architecture technique

### Backend
- **Framework** : ASP.NET Core 8.0 MVC
- **Base de données** : SQLite (dev) / PostgreSQL (prod)
- **Authentification** : ASP.NET Core Identity + JWT
- **ORM** : Entity Framework Core
- **API** : RESTful avec SignalR pour les notifications temps réel

### Frontend
- **Framework** : Blazor Server (à venir)
- **Styling** : Tailwind CSS (à venir)
- **PWA** : Service Worker, Manifest, Notifications
- **Responsive** : Mobile-first design

### Sécurité
- Hashage des mots de passe avec ASP.NET Core Identity
- Protection CSRF intégrée
- Validation des entrées utilisateur
- Authentification JWT sécurisée

## 📁 Structure du projet

```
PersonalFinanceApp/
├── Controllers/           # Contrôleurs API et MVC
├── Models/               # Modèles de données et DTOs
│   └── DTOs/            # Data Transfer Objects
├── Services/             # Services métier
├── Data/                 # Contexte Entity Framework
├── Hubs/                 # SignalR Hubs
├── Views/                # Vues MVC
├── wwwroot/              # Fichiers statiques
│   ├── css/             # Styles CSS
│   ├── js/              # JavaScript
│   ├── images/          # Images PWA
│   ├── manifest.json    # Manifest PWA
│   └── sw.js           # Service Worker
├── Tests/                # Tests unitaires
└── README.md            # Documentation
```

## 🚀 Installation et déploiement

### Prérequis
- .NET 8.0 SDK
- Visual Studio 2022 ou VS Code
- SQLite (pour le développement)

### Installation locale

1. **Cloner le repository**
```bash
git clone <repository-url>
cd PersonalFinanceApp
```

2. **Restaurer les packages NuGet**
```bash
dotnet restore
```

3. **Configurer la base de données**
```bash
dotnet ef database update
```

4. **Lancer l'application**
```bash
dotnet run
```

L'application sera accessible sur `https://localhost:5001`

### Configuration

#### Variables d'environnement
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=personal_finance.db"
  },
  "JwtSettings": {
    "SecretKey": "Votre-clé-secrète-très-longue-et-sécurisée",
    "Issuer": "PersonalFinanceApp",
    "Audience": "PersonalFinanceAppUsers",
    "ExpirationInMinutes": 60
  }
}
```

#### Compte administrateur par défaut
- **Email** : admin@personalfinance.com
- **Mot de passe** : Admin123!

## 🧪 Tests

### Lancer les tests unitaires
```bash
dotnet test
```

### Couverture de code
```bash
dotnet test --collect:"XPlat Code Coverage"
```

## 📚 API Documentation

### Authentification

#### POST /api/auth/register
Inscription d'un nouvel utilisateur
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

#### POST /api/auth/login
Connexion utilisateur
```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

### Comptes

#### GET /api/accounts
Récupérer tous les comptes de l'utilisateur

#### POST /api/accounts
Créer un nouveau compte
```json
{
  "name": "Compte Courant",
  "description": "Compte principal",
  "type": 0,
  "initialBalance": 1000.00
}
```

#### PUT /api/accounts/{id}/balance
Mettre à jour le solde d'un compte
```json
{
  "newBalance": 1500.00,
  "notes": "Salaire reçu"
}
```

### Export

#### GET /api/export/accounts?format=excel
Exporter les comptes en Excel

#### GET /api/export/statistics?format=csv
Exporter les statistiques en CSV

## 🔧 Déploiement en production

### Azure App Service

1. **Créer une App Service**
```bash
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name myAppName --runtime "DOTNET|8.0"
```

2. **Configurer la base de données PostgreSQL**
```bash
az postgres server create --resource-group myResourceGroup --name myPostgresServer --location "West Europe" --admin-user myAdminUser --admin-password myPassword --sku-name GP_Gen5_2
```

3. **Déployer l'application**
```bash
dotnet publish -c Release
az webapp deployment source config-zip --resource-group myResourceGroup --name myAppName --src publish.zip
```

### Docker

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PersonalFinanceApp.csproj", "."]
RUN dotnet restore
COPY . .
WORKDIR "/src"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PersonalFinanceApp.dll"]
```

## 🔒 Sécurité

### Bonnes pratiques implémentées
- ✅ Authentification JWT sécurisée
- ✅ Hashage des mots de passe avec ASP.NET Core Identity
- ✅ Protection CSRF automatique
- ✅ Validation des entrées utilisateur
- ✅ Protection contre les attaques SQL Injection via Entity Framework
- ✅ Headers de sécurité HTTP

### Recommandations supplémentaires
- Utiliser HTTPS en production
- Configurer les CORS appropriément
- Mettre à jour régulièrement les dépendances
- Implémenter la limitation de taux (Rate Limiting)
- Configurer les logs de sécurité

## 📈 Performance

### Optimisations implémentées
- Mise en cache des requêtes fréquentes
- Pagination des listes longues
- Compression des réponses
- Optimisation des requêtes Entity Framework

### Monitoring
- Logs structurés avec ILogger
- Métriques de performance
- Health checks

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024