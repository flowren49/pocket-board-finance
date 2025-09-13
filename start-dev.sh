#!/bin/bash

echo "🚀 Démarrage de Personal Finance App en mode développement..."

# Vérifier si .NET 8.0 est installé
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET 8.0 SDK n'est pas installé. Veuillez l'installer depuis https://dotnet.microsoft.com/download"
    exit 1
fi

# Vérifier la version de .NET
DOTNET_VERSION=$(dotnet --version)
echo "✅ .NET version détectée: $DOTNET_VERSION"

# Restaurer les packages NuGet
echo "📦 Restauration des packages NuGet..."
dotnet restore

if [ $? -ne 0 ]; then
    echo "❌ Échec de la restauration des packages"
    exit 1
fi

# Construire l'application
echo "🔨 Construction de l'application..."
dotnet build

if [ $? -ne 0 ]; then
    echo "❌ Échec de la construction"
    exit 1
fi

# Créer et initialiser la base de données
echo "🗄️ Initialisation de la base de données..."
if [ -f "personal_finance.db" ]; then
    echo "⚠️ Base de données existante détectée"
else
    echo "📊 Création de la base de données..."
    dotnet ef database update
fi

# Lancer les tests
echo "🧪 Exécution des tests..."
dotnet test

if [ $? -ne 0 ]; then
    echo "⚠️ Certains tests ont échoué, mais on continue..."
fi

# Démarrer l'application
echo "🌟 Démarrage de l'application..."
echo "📱 L'application sera accessible sur:"
echo "   - HTTP:  http://localhost:5000"
echo "   - HTTPS: https://localhost:5001"
echo ""
echo "🔐 Compte administrateur par défaut:"
echo "   - Email: admin@personalfinance.com"
echo "   - Mot de passe: Admin123!"
echo ""
echo "🛑 Appuyez sur Ctrl+C pour arrêter l'application"
echo ""

dotnet run