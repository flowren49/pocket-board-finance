#!/bin/bash

# Script pour améliorer le menu burger sur toutes les pages
echo "🔧 Amélioration du menu burger mobile..."

# Liste des pages à mettre à jour
pages=("transactions.html" "statistics.html" "export.html")

for page in "${pages[@]}"; do
    if [ -f "wwwroot/$page" ]; then
        echo "📱 Mise à jour de $page..."
        
        # Remplacer le bouton mobile menu
        sed -i 's|<button id="mobileMenuBtn" class="lg:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-lg">|<button id="mobileMenuBtn" class="lg:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow">|g' "wwwroot/$page"
        
        # Remplacer l'icône par le nouveau design
        sed -i 's|<i class="fas fa-bars text-gray-600"></i>|<div class="w-6 h-6 flex flex-col justify-center items-center">\n                <span class="hamburger-line block w-5 h-0.5 bg-gray-600 transition-all duration-300"></span>\n                <span class="hamburger-line block w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1"></span>\n                <span class="hamburger-line block w-5 h-0.5 bg-gray-600 transition-all duration-300 mt-1"></span>\n            </div>|g' "wwwroot/$page"
        
        # Ajouter les styles CSS si pas déjà présents
        if ! grep -q "hamburger-open" "wwwroot/$page"; then
            sed -i '/<link rel="stylesheet" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/6.4.0\/css\/all.min.css">/a\    \n    <!-- Custom Mobile Menu Styles -->\n    <style>\n        .hamburger-open .hamburger-line:nth-child(1) {\n            transform: rotate(45deg) translate(5px, 5px);\n        }\n        \n        .hamburger-open .hamburger-line:nth-child(2) {\n            opacity: 0;\n        }\n        \n        .hamburger-open .hamburger-line:nth-child(3) {\n            transform: rotate(-45deg) translate(7px, -6px);\n        }\n        \n        .mobile-sidebar {\n            backdrop-filter: blur(10px);\n            background-color: rgba(255, 255, 255, 0.95);\n        }\n        \n        @media (max-width: 1024px) {\n            .mobile-sidebar {\n                background-color: rgba(255, 255, 255, 0.98);\n            }\n        }\n    </style>' "wwwroot/$page"
        fi
        
        # Mettre à jour la classe sidebar
        sed -i 's|class="w-64 bg-white shadow-lg min-h-screen|class="w-64 mobile-sidebar shadow-lg min-h-screen|g' "wwwroot/$page"
        
        echo "✅ $page mis à jour"
    else
        echo "⚠️  $page non trouvé"
    fi
done

echo "🎉 Amélioration du menu burger terminée !"