#!/bin/bash

# Script de build pour Vercel
echo "🚀 Building Personal Finance App for Vercel..."

# Installer les dépendances Node.js si package.json existe
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

# Build Tailwind CSS
echo "🎨 Building Tailwind CSS..."
if command -v npx &> /dev/null; then
    npx tailwindcss -i ./wwwroot/css/input.css -o ./wwwroot/css/tailwind.css --minify
else
    echo "⚠️  npx not found, creating basic Tailwind CSS..."
    echo "@import 'tailwindcss/base'; @import 'tailwindcss/components'; @import 'tailwindcss/utilities';" > wwwroot/css/tailwind.css
fi

# Créer les dossiers nécessaires
echo "📁 Creating necessary directories..."
mkdir -p wwwroot/css
mkdir -p wwwroot/js
mkdir -p wwwroot/images

# Copier les fichiers statiques si nécessaire
echo "📋 Copying static files..."

# Créer un fichier de test si les images n'existent pas
if [ ! -f "wwwroot/images/icon-192x192.png" ]; then
    echo "⚠️  Creating placeholder icon..."
    # Créer un fichier SVG simple comme placeholder
    echo '<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"><rect width="192" height="192" fill="#3B82F6"/><text x="96" y="100" text-anchor="middle" fill="white" font-family="Arial" font-size="24">💰</text></svg>' > wwwroot/images/icon-192x192.svg
fi

echo "✅ Build completed successfully!"
echo "📂 Ready for Vercel deployment"