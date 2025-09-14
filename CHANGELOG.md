# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [1.1.0] - 2024-12-19

### ✨ Améliorations
- **Réorganisation de la structure du projet** : Meilleure organisation des fichiers et dossiers
- **Documentation améliorée** : README mis à jour avec la nouvelle structure
- **Configuration centralisée** : Fichiers de configuration regroupés dans `/config`
- **Scripts améliorés** : Nouveaux scripts npm pour le développement
- **Gitignore complet** : Fichier .gitignore optimisé pour .NET et Node.js

### 🔧 Modifications techniques
- Déplacement de `create-page.js` vers `/scripts`
- Déplacement de `vercel.json` et `tailwind.config.js` vers `/config`
- Suppression des fichiers de test et templates inutilisés
- Création de fichiers de configuration d'environnement séparés
- Ajout de nouveaux scripts npm : `serve`, `clean`, `watch`, `create-page`

### 📁 Structure
```
workspace/
├── config/           # Fichiers de configuration
├── scripts/          # Scripts utilitaires
├── docs/            # Documentation du projet
├── wwwroot/         # Frontend statique
├── Controllers/     # API Controllers
├── Models/          # Modèles de données
├── Services/        # Services métier
└── ...
```

## [1.0.0] - 2024-12-18

### 🎉 Version initiale
- Application de gestion financière personnelle
- Interface PWA responsive
- API REST complète avec .NET 8
- Système d'authentification JWT
- Gestion des comptes et transactions
- Export Excel, CSV et PDF
- Documentation API avec Swagger
- Déploiement Docker et Vercel

### 🚀 Fonctionnalités principales
- Dashboard financier
- Gestion multi-comptes
- Historique des transactions
- Statistiques et graphiques
- Export de données
- Application web progressive (PWA)
- Interface mobile-first responsive