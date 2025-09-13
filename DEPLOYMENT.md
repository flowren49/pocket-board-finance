# Guide de déploiement - Personal Finance App

Ce guide détaille les étapes pour déployer l'application Personal Finance App en production.

## 🎯 Environnements de déploiement

### 1. Développement local
- **Base de données** : SQLite
- **URL** : https://localhost:5001
- **Configuration** : appsettings.Development.json

### 2. Staging
- **Base de données** : PostgreSQL sur Azure
- **URL** : https://staging-personalfinance.azurewebsites.net
- **Configuration** : Variables d'environnement Azure

### 3. Production
- **Base de données** : Azure SQL Database
- **URL** : https://personalfinance.azurewebsites.net
- **Configuration** : Variables d'environnement Azure

## 🛠️ Déploiement sur Azure

### Prérequis
- Compte Azure actif
- Azure CLI installé
- .NET 8.0 SDK
- Git

### Étape 1 : Créer les ressources Azure

#### 1.1 Créer un Resource Group
```bash
az group create --name PersonalFinanceRG --location "West Europe"
```

#### 1.2 Créer un App Service Plan
```bash
az appservice plan create --name PersonalFinancePlan --resource-group PersonalFinanceRG --sku B1 --is-linux
```

#### 1.3 Créer l'App Service
```bash
az webapp create --resource-group PersonalFinanceRG --plan PersonalFinancePlan --name personalfinance-app --runtime "DOTNET|8.0"
```

#### 1.4 Créer Azure SQL Database
```bash
# Créer le serveur SQL
az sql server create --name personalfinance-sql --resource-group PersonalFinanceRG --location "West Europe" --admin-user adminuser --admin-password "YourSecurePassword123!"

# Créer la base de données
az sql db create --resource-group PersonalFinanceRG --server personalfinance-sql --name personalfinance-db --service-objective Basic
```

#### 1.5 Configurer la firewall SQL
```bash
az sql server firewall-rule create --resource-group PersonalFinanceRG --server personalfinance-sql --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

### Étape 2 : Configurer les variables d'environnement

```bash
# Chaîne de connexion SQL
az webapp config connection-string set --resource-group PersonalFinanceRG --name personalfinance-app --connection-string-type SQLServer --settings DefaultConnection="Server=tcp:personalfinance-sql.database.windows.net,1433;Initial Catalog=personalfinance-db;Persist Security Info=False;User ID=adminuser;Password=YourSecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"

# Configuration JWT
az webapp config appsettings set --resource-group PersonalFinanceRG --name personalfinance-app --settings JwtSettings__SecretKey="Votre-clé-secrète-très-longue-et-sécurisée-pour-la-production"
az webapp config appsettings set --resource-group PersonalFinanceRG --name personalfinance-app --settings JwtSettings__Issuer="PersonalFinanceApp"
az webapp config appsettings set --resource-group PersonalFinanceRG --name personalfinance-app --settings JwtSettings__Audience="PersonalFinanceAppUsers"
az webapp config appsettings set --resource-group PersonalFinanceRG --name personalfinance-app --settings JwtSettings__ExpirationInMinutes="60"

# Configuration ASP.NET Core
az webapp config appsettings set --resource-group PersonalFinanceRG --name personalfinance-app --settings ASPNETCORE_ENVIRONMENT="Production"
az webapp config appsettings set --resource-group PersonalFinanceRG --name personalfinance-app --settings ASPNETCORE_URLS="https://+:443;http://+:80"
```

### Étape 3 : Configurer HTTPS et le domaine personnalisé

#### 3.1 Activer HTTPS
```bash
az webapp update --resource-group PersonalFinanceRG --name personalfinance-app --https-only true
```

#### 3.2 Ajouter un domaine personnalisé (optionnel)
```bash
az webapp config hostname add --resource-group PersonalFinanceRG --webapp-name personalfinance-app --hostname www.votredomaine.com
```

### Étape 4 : Déployer l'application

#### 4.1 Méthode 1 : Déploiement via Git
```bash
# Configurer le déploiement Git
az webapp deployment source config --resource-group PersonalFinanceRG --name personalfinance-app --repo-url https://github.com/votre-repo/personalfinance-app --branch main --manual-integration

# Obtenir l'URL de déploiement
az webapp deployment source show --resource-group PersonalFinanceRG --name personalfinance-app
```

#### 4.2 Méthode 2 : Déploiement via ZIP
```bash
# Publier l'application
dotnet publish -c Release -o ./publish

# Créer un ZIP
cd publish
zip -r ../deployment.zip .
cd ..

# Déployer le ZIP
az webapp deployment source config-zip --resource-group PersonalFinanceRG --name personalfinance-app --src deployment.zip
```

### Étape 5 : Initialiser la base de données

#### 5.1 Exécuter les migrations
```bash
# Se connecter à l'App Service et exécuter les migrations
az webapp ssh --resource-group PersonalFinanceRG --name personalfinance-app

# Dans la session SSH
dotnet ef database update
```

## 🐳 Déploiement avec Docker

### Dockerfile
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PersonalFinanceApp.csproj", "."]
RUN dotnet restore "PersonalFinanceApp.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "PersonalFinanceApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "PersonalFinanceApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PersonalFinanceApp.dll"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:80"
      - "8081:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=personalfinance;User Id=sa;Password=YourPassword123!;TrustServerCertificate=true;
    depends_on:
      - db

  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

volumes:
  sqlserver_data:
```

### Commandes Docker
```bash
# Construire l'image
docker build -t personalfinance-app .

# Lancer avec Docker Compose
docker-compose up -d

# Voir les logs
docker-compose logs -f app
```

## 🔧 Configuration de production

### Variables d'environnement critiques
```bash
# Base de données
ConnectionStrings__DefaultConnection="Server=...;Database=...;User Id=...;Password=...;TrustServerCertificate=true;"

# JWT
JwtSettings__SecretKey="clé-très-longue-et-sécurisée"
JwtSettings__Issuer="PersonalFinanceApp"
JwtSettings__Audience="PersonalFinanceAppUsers"
JwtSettings__ExpirationInMinutes="60"

# Application
ASPNETCORE_ENVIRONMENT="Production"
ASPNETCORE_URLS="https://+:443;http://+:80"

# Logging
Logging__LogLevel__Default="Information"
Logging__LogLevel__Microsoft="Warning"
```

### Configuration du reverse proxy (Nginx)
```nginx
server {
    listen 80;
    server_name personalfinance.com www.personalfinance.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name personalfinance.com www.personalfinance.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring et logs

### Application Insights
```bash
# Créer Application Insights
az monitor app-insights component create --app personalfinance-insights --location "West Europe" --resource-group PersonalFinanceRG

# Obtenir la clé d'instrumentation
az monitor app-insights component show --app personalfinance-insights --resource-group PersonalFinanceRG --query instrumentationKey

# Configurer dans l'App Service
az webapp config appsettings set --resource-group PersonalFinanceRG --name personalfinance-app --settings APPINSIGHTS_INSTRUMENTATIONKEY="votre-clé-instrumentation"
```

### Logs Azure
```bash
# Activer les logs
az webapp log config --resource-group PersonalFinanceRG --name personalfinance-app --application-logging filesystem --level information
az webapp log config --resource-group PersonalFinanceRG --name personalfinance-app --web-server-logging filesystem --level information

# Voir les logs en temps réel
az webapp log tail --resource-group PersonalFinanceRG --name personalfinance-app
```

## 🔒 Sécurité en production

### 1. Configuration HTTPS
- Certificat SSL/TLS valide
- Redirection HTTP vers HTTPS
- Headers de sécurité

### 2. Base de données
- Chiffrement en transit (SSL/TLS)
- Chiffrement au repos
- Sauvegardes automatiques
- Accès restreint par firewall

### 3. Authentification
- Clé JWT sécurisée et unique
- Rotation régulière des clés
- Expiration appropriée des tokens

### 4. Monitoring
- Surveillance des tentatives de connexion
- Alertes sur les erreurs
- Logs de sécurité

## 🚀 Automatisation CI/CD

### GitHub Actions
```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore dependencies
      run: dotnet restore
    
    - name: Build
      run: dotnet build --configuration Release --no-restore
    
    - name: Test
      run: dotnet test --configuration Release --no-build --verbosity normal
    
    - name: Publish
      run: dotnet publish --configuration Release --no-build --output ./publish
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'personalfinance-app'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: './publish'
```

## 📋 Checklist de déploiement

### Avant le déploiement
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Configuration de production validée
- [ ] Base de données configurée
- [ ] Certificats SSL installés
- [ ] Variables d'environnement définies

### Après le déploiement
- [ ] Application accessible via HTTPS
- [ ] Base de données connectée
- [ ] Authentification fonctionnelle
- [ ] API endpoints répondent
- [ ] PWA fonctionne correctement
- [ ] Logs générés correctement
- [ ] Monitoring configuré

### Tests post-déploiement
- [ ] Inscription d'un nouvel utilisateur
- [ ] Connexion utilisateur
- [ ] Création d'un compte
- [ ] Mise à jour de solde
- [ ] Export de données
- [ ] Fonctionnalités PWA
- [ ] Performance de l'application

## 🆘 Dépannage

### Problèmes courants

#### 1. Erreur de connexion à la base de données
```bash
# Vérifier la chaîne de connexion
az webapp config connection-string list --resource-group PersonalFinanceRG --name personalfinance-app

# Vérifier les logs
az webapp log tail --resource-group PersonalFinanceRG --name personalfinance-app
```

#### 2. Problème de certificat SSL
```bash
# Vérifier le certificat
az webapp ssl list --resource-group PersonalFinanceRG --name personalfinance-app
```

#### 3. Application ne démarre pas
```bash
# Vérifier les logs de démarrage
az webapp log tail --resource-group PersonalFinanceRG --name personalfinance-app

# Redémarrer l'application
az webapp restart --resource-group PersonalFinanceRG --name personalfinance-app
```

---

**Note** : Ce guide est régulièrement mis à jour. Vérifiez la dernière version avant chaque déploiement.