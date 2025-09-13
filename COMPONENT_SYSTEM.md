# Système de Composants - Pocket Board Finance

## 🎯 Objectif

Ce système de composants permet d'éviter la répétition de code en centralisant les éléments communs (header, footer, head, scripts) dans des fichiers réutilisables.

## 📁 Structure

```
wwwroot/
├── components/           # Composants réutilisables
│   ├── head.html        # Meta tags, CSS, fonts
│   ├── header.html      # Navigation et menu mobile
│   ├── footer.html      # Pied de page
│   └── scripts.html     # Scripts JavaScript communs
├── templates/           # Templates de pages
│   ├── index.html       # Template page d'accueil
│   ├── about.html       # Template page à propos
│   ├── pricing.html     # Template page tarifs
│   └── features.html    # Template page fonctionnalités
└── build-components.js  # Script de génération
```

## 🔧 Utilisation

### 1. Créer un Template

Créez un fichier dans `wwwroot/templates/` avec les placeholders :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
{{HEAD}}
</head>
<body>
{{HEADER}}

<!-- Contenu de votre page -->
<main>
    <h1>Ma Page</h1>
    <p>Contenu...</p>
</main>

{{FOOTER}}

{{SCRIPTS}}
</body>
</html>
```

### 2. Configurer le Build

Ajoutez votre page dans `build-components.js` :

```javascript
{
    template: './wwwroot/templates/ma-page.html',
    output: './wwwroot/ma-page.html',
    replacements: {
        TITLE: 'Mon Titre - Pocket Board Finance',
        DESCRIPTION: 'Description de ma page'
    }
}
```

### 3. Générer les Pages

```bash
node build-components.js
```

## 🎨 Composants Disponibles

### `{{HEAD}}`
- Meta tags (charset, viewport, title, description)
- PWA manifest
- Tailwind CSS CDN
- Google Fonts
- Font Awesome
- CSS personnalisé
- CSS commun

### `{{HEADER}}`
- Navigation responsive
- Menu mobile avec hamburger
- Liens vers toutes les pages
- Boutons de connexion/inscription

### `{{FOOTER}}`
- Liens vers les pages importantes
- Informations de contact
- Liens sociaux
- Copyright

### `{{SCRIPTS}}`
- auth.js (authentification)
- common.js (fonctions communes)

## 🔄 Workflow

1. **Modifier un composant** : Éditez le fichier dans `components/`
2. **Mettre à jour les templates** : Modifiez les templates si nécessaire
3. **Rebuild** : Lancez `node build-components.js`
4. **Test** : Vérifiez les pages générées

## 🚀 Avantages

- ✅ **DRY** : Don't Repeat Yourself
- ✅ **Maintenance** : Un seul endroit pour modifier le header/footer
- ✅ **Cohérence** : Design uniforme sur toutes les pages
- ✅ **Performance** : CSS/JS optimisés et partagés
- ✅ **Évolutivité** : Facile d'ajouter de nouvelles pages

## 📝 Exemple Complet

### Template (templates/exemple.html)
```html
<!DOCTYPE html>
<html lang="fr">
<head>
{{HEAD}}
</head>
<body class="bg-gray-50">
{{HEADER}}

<section class="py-20">
    <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl font-bold text-center mb-8">
            {{PAGE_TITLE}}
        </h1>
        <p class="text-lg text-gray-600 text-center">
            {{PAGE_DESCRIPTION}}
        </p>
    </div>
</section>

{{FOOTER}}

{{SCRIPTS}}
</body>
</html>
```

### Configuration (build-components.js)
```javascript
{
    template: './wwwroot/templates/exemple.html',
    output: './wwwroot/exemple.html',
    replacements: {
        TITLE: 'Exemple - Pocket Board Finance',
        DESCRIPTION: 'Page d\'exemple',
        PAGE_TITLE: 'Ma Page d\'Exemple',
        PAGE_DESCRIPTION: 'Description de ma page d\'exemple'
    }
}
```

## 🔧 Personnalisation

### Ajouter un Nouveau Composant

1. Créez le fichier dans `components/`
2. Modifiez `build-components.js` pour l'inclure
3. Ajoutez le placeholder dans vos templates

### Modifier les Styles

- **Styles globaux** : Modifiez `wwwroot/css/common.css`
- **Styles spécifiques** : Ajoutez dans le composant `head.html`

### Ajouter des Scripts

- **Scripts communs** : Ajoutez dans `components/scripts.html`
- **Scripts spécifiques** : Ajoutez dans le template

## 📚 Documentation API

La documentation API est disponible sur `/docs/` avec :
- Interface Swagger UI interactive
- Spécification OpenAPI 3.0 complète
- Exemples de requêtes et réponses
- Authentification JWT documentée

## 🎯 Résultat

Ce système permet de maintenir un code propre, réutilisable et évolutif tout en offrant une expérience utilisateur cohérente sur toutes les pages du site.