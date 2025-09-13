#!/bin/bash

# Script de déploiement sur Vercel
echo "🚀 Déploiement de Personal Finance App sur Vercel..."

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

# Vérifier la connexion à Vercel
echo "🔐 Vérification de la connexion Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Vous devez vous connecter à Vercel d'abord."
    echo "Exécutez: vercel login"
    exit 1
fi

# Construire l'application
echo "🔨 Construction de l'application..."
npm run build:css

# Vérifier que les fichiers nécessaires existent
if [ ! -f "wwwroot/index.html" ]; then
    echo "❌ index.html manquant!"
    exit 1
fi

if [ ! -f "wwwroot/css/tailwind.css" ]; then
    echo "❌ tailwind.css manquant!"
    exit 1
fi

if [ ! -f "wwwroot/js/app.js" ]; then
    echo "❌ app.js manquant!"
    exit 1
fi

echo "✅ Tous les fichiers sont présents"

# Déployer sur Vercel
echo "🌐 Déploiement sur Vercel..."
vercel --prod --yes

echo "🎉 Déploiement terminé!"
echo "📱 Votre application PWA est maintenant disponible sur Vercel"
echo "💡 N'oubliez pas de tester les fonctionnalités PWA (installation, offline, notifications)"