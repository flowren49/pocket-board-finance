# Déploiement sur Vercel - Personal Finance App

## 🚀 Déploiement Rapide

### Option 1: Déploiement Direct via Vercel CLI

1. **Installer Vercel CLI** (si pas déjà installé) :
```bash
npm install -g vercel
```

2. **Se connecter à Vercel** :
```bash
vercel login
```

3. **Déployer depuis le répertoire du projet** :
```bash
cd /workspace
vercel --prod
```

### Option 2: Déploiement via GitHub + Vercel Dashboard

1. **Pousser le code sur GitHub** :
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Connecter le repository sur Vercel** :
   - Aller sur [vercel.com](https://vercel.com)
   - Cliquer sur "New Project"
   - Importer le repository GitHub
   - Vercel détectera automatiquement la configuration

### Option 3: Déploiement via Drag & Drop

1. **Préparer les fichiers** :
```bash
cd /workspace
./build.sh
```

2. **Créer un fichier ZIP** :
```bash
zip -r personal-finance-app.zip wwwroot/ package.json vercel.json tailwind.config.js
```

3. **Déployer sur Vercel** :
   - Aller sur [vercel.com](https://vercel.com)
   - Glisser-déposer le fichier ZIP

## 📋 Configuration Vercel

Le projet inclut déjà les fichiers de configuration nécessaires :

- **`vercel.json`** : Configuration du déploiement
- **`package.json`** : Scripts de build et dépendances
- **`.vercelignore`** : Fichiers à ignorer
- **`tailwind.config.js`** : Configuration Tailwind CSS

## 🔧 Variables d'Environnement (Optionnel)

Si vous voulez connecter une base de données externe, ajoutez ces variables dans Vercel :

```
DATABASE_URL=your_database_connection_string
JWT_SECRET_KEY=your_jwt_secret
```

## 🌐 Fonctionnalités Déployées

✅ **Application PWA complète**
- Interface utilisateur moderne avec Tailwind CSS
- Fonctionnalités offline avec Service Worker
- Installation sur appareils mobiles
- Notifications push

✅ **Gestion des finances**
- Création et gestion de comptes
- Suivi des transactions
- Graphiques et statistiques
- Export de données

✅ **Sécurité**
- Authentification utilisateur
- Stockage local sécurisé
- Validation des données

## 📱 Test de l'Application

Une fois déployée, l'application sera accessible à l'URL fournie par Vercel.

**Fonctionnalités à tester** :
1. Installation PWA (bouton "Installer")
2. Création de compte utilisateur
3. Ajout de comptes financiers
4. Fonctionnement offline
5. Notifications

## 🔄 Mise à Jour

Pour mettre à jour l'application :

```bash
# Modifier le code
# Puis redéployer
vercel --prod
```

## 🆘 Dépannage

**Problème : CSS non appliqué**
- Vérifier que `tailwind.css` est généré
- Exécuter `npm run build:css`

**Problème : Service Worker ne fonctionne pas**
- Vérifier que l'application est servie en HTTPS
- Vérifier la console pour les erreurs

**Problème : PWA ne s'installe pas**
- Vérifier que le manifest.json est accessible
- Vérifier les icônes PWA

## 📞 Support

Pour toute question sur le déploiement, consultez :
- [Documentation Vercel](https://vercel.com/docs)
- [Guide PWA](https://web.dev/progressive-web-apps/)