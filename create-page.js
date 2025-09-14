#!/usr/bin/env node

/**
 * Script pour créer de nouvelles pages avec les composants réutilisables
 * Usage: node create-page.js <nom-page> [type]
 * Types: landing (défaut), protected
 */

const fs = require('fs');
const path = require('path');

const pageName = process.argv[2];
const pageType = process.argv[3] || 'landing';

if (!pageName) {
    console.error('❌ Usage: node create-page.js <nom-page> [type]');
    console.error('   Types: landing (défaut), protected');
    process.exit(1);
}

const validTypes = ['landing', 'protected'];
if (!validTypes.includes(pageType)) {
    console.error('❌ Type invalide. Types supportés:', validTypes.join(', '));
    process.exit(1);
}

const templatePath = path.join(__workspace, 'wwwroot', 'templates', 'base-template.html');
const outputPath = path.join(__workspace, 'wwwroot', `${pageName}.html`);

// Lire le template
if (!fs.existsSync(templatePath)) {
    console.error('❌ Template non trouvé:', templatePath);
    process.exit(1);
}

let template = fs.readFileSync(templatePath, 'utf8');

// Remplacer les placeholders
const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);
template = template.replace('{{PAGE_TITLE}}', title);
template = template.replace('{{PAGE_DESCRIPTION}}', `Page ${title} - Pocket Board Finance`);

// Ajouter le contenu spécifique selon le type
let content = '';
if (pageType === 'landing') {
    content = `
    <!-- Hero Section -->
    <section class="hero-pattern py-20 sm:py-32">
        <div class="max-w-7xl mx-auto container-padding text-center">
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 hero-title">
                ${title}
            </h1>
            <p class="text-xl sm:text-2xl text-gray-600 mb-8 hero-subtitle max-w-3xl mx-auto">
                Description de la page ${title}
            </p>
        </div>
    </section>
    
    <!-- Main Content -->
    <section class="py-16 bg-white">
        <div class="max-w-4xl mx-auto container-padding">
            <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">
                Contenu Principal
            </h2>
            <p class="text-lg text-gray-600 text-center">
                Ajoutez votre contenu ici...
            </p>
        </div>
    </section>`;
} else if (pageType === 'protected') {
    content = `
    <!-- Protected Page Content -->
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto container-padding py-8">
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-6">
                    ${title}
                </h1>
                <p class="text-gray-600">
                    Contenu de la page ${title}...
                </p>
            </div>
        </div>
    </div>`;
}

template = template.replace('{{PAGE_CONTENT}}', content);

// Écrire le fichier
fs.writeFileSync(outputPath, template);

console.log('✅ Page créée avec succès!');
console.log(`📄 Fichier: ${outputPath}`);
console.log(`🔗 URL: /${pageName}.html`);
console.log(`📝 Type: ${pageType}`);

if (pageType === 'protected') {
    console.log('\n📋 N\'oubliez pas de:');
    console.log('   - Ajouter la vérification d\'authentification');
    console.log('   - Implémenter la logique métier spécifique');
    console.log('   - Tester les fonctionnalités');
}