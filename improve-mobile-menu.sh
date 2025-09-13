#!/bin/bash

# Script pour améliorer le menu mobile sur toutes les pages

echo "🚀 Amélioration du menu mobile pour toutes les pages..."

# Pages à traiter
PAGES=("accounts.html" "transactions.html" "statistics.html" "export.html")

for page in "${PAGES[@]}"; do
    echo "📱 Traitement de $page..."
    
    # Vérifier que le fichier existe
    if [ ! -f "wwwroot/$page" ]; then
        echo "❌ Fichier $page non trouvé"
        continue
    fi
    
    # Créer une copie de sauvegarde
    cp "wwwroot/$page" "wwwroot/${page}.backup"
    
    # Améliorer le CSS du menu mobile
    sed -i '/<!-- Custom Mobile Menu Styles -->/,/<\/style>/c\
    <!-- Custom Mobile Menu Styles -->\
    <style>\
        .hamburger-open .hamburger-line:nth-child(1) {\
            transform: rotate(45deg) translate(5px, 5px);\
        }\
        \
        .hamburger-open .hamburger-line:nth-child(2) {\
            opacity: 0;\
        }\
        \
        .hamburger-open .hamburger-line:nth-child(3) {\
            transform: rotate(-45deg) translate(7px, -6px);\
        }\
        \
        .mobile-sidebar {\
            backdrop-filter: blur(20px);\
            background-color: rgba(255, 255, 255, 0.98);\
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);\
        }\
        \
        .nav-link {\
            display: flex;\
            align-items: center;\
            padding: 12px 16px;\
            border-radius: 12px;\
            margin-bottom: 8px;\
            transition: all 0.3s ease;\
            font-weight: 500;\
            position: relative;\
            overflow: hidden;\
        }\
        \
        .nav-link::before {\
            content: '"'"''"'"';\
            position: absolute;\
            top: 0;\
            left: -100%;\
            width: 100%;\
            height: 100%;\
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);\
            transition: left 0.5s;\
        }\
        \
        .nav-link:hover::before {\
            left: 100%;\
        }\
        \
        .nav-link-active {\
            background: linear-gradient(135deg, #3B82F6, #2563EB);\
            color: white;\
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);\
        }\
        \
        .nav-link-inactive {\
            color: #4B5563;\
            background-color: rgba(255, 255, 255, 0.5);\
        }\
        \
        .nav-link-inactive:hover {\
            background: linear-gradient(135deg, #F3F4F6, #E5E7EB);\
            color: #1F2937;\
            transform: translateX(4px);\
        }\
        \
        .nav-link i {\
            width: 20px;\
            text-align: center;\
            font-size: 16px;\
        }\
        \
        @media (max-width: 1024px) {\
            .mobile-sidebar {\
                background-color: rgba(255, 255, 255, 0.98);\
                border-right: 1px solid rgba(0, 0, 0, 0.1);\
            }\
            \
            .nav-link {\
                padding: 14px 16px;\
                font-size: 16px;\
            }\
            \
            .nav-link i {\
                font-size: 18px;\
                margin-right: 12px;\
            }\
        }\
        \
        @media (max-width: 640px) {\
            .nav-link {\
                padding: 16px 20px;\
                font-size: 17px;\
            }\
            \
            .nav-link i {\
                font-size: 20px;\
                margin-right: 16px;\
            }\
        }\
    </style>' "wwwroot/$page"
    
    # Améliorer le bouton hamburger
    sed -i 's/id="mobileMenuBtn" class="lg:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow"/id="mobileMenuBtn" class="lg:hidden fixed top-4 left-4 z-50 bg-white p-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200"/g' "wwwroot/$page"
    
    # Améliorer la sidebar
    sed -i 's/id="sidebar" class="w-64 mobile-sidebar shadow-lg min-h-screen fixed lg:relative lg:translate-x-0 -translate-x-full transition-transform duration-300 z-40"/id="sidebar" class="w-72 mobile-sidebar shadow-2xl min-h-screen fixed lg:relative lg:translate-x-0 -translate-x-full transition-all duration-300 z-40"/g' "wwwroot/$page"
    
    echo "✅ $page amélioré"
done

echo "🎉 Amélioration mobile terminée !"
echo "📝 N'oubliez pas de mettre à jour les fichiers JavaScript correspondants"