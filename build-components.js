#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Template replacement function
function replaceTemplate(content, replacements) {
    let result = content;
    Object.keys(replacements).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, replacements[key]);
    });
    return result;
}

// Load component
function loadComponent(componentPath) {
    try {
        return fs.readFileSync(componentPath, 'utf8');
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error.message);
        return '';
    }
}

// Build page with components
function buildPage(templatePath, outputPath, replacements = {}) {
    try {
        let content = fs.readFileSync(templatePath, 'utf8');
        
        // Load and replace components
        const headComponent = loadComponent('./wwwroot/components/head.html');
        const headerComponent = loadComponent('./wwwroot/components/header.html');
        const footerComponent = loadComponent('./wwwroot/components/footer.html');
        const scriptsComponent = loadComponent('./wwwroot/components/scripts.html');
        
        // Replace placeholders
        content = content.replace('{{HEAD}}', headComponent);
        content = content.replace('{{HEADER}}', headerComponent);
        content = content.replace('{{FOOTER}}', footerComponent);
        content = content.replace('{{SCRIPTS}}', scriptsComponent);
        
        // Apply other replacements
        content = replaceTemplate(content, replacements);
        
        // Write output
        fs.writeFileSync(outputPath, content, 'utf8');
        console.log(`✅ Built: ${outputPath}`);
        
    } catch (error) {
        console.error(`Error building ${outputPath}:`, error.message);
    }
}

// Page configurations
const pages = [
    {
        template: './wwwroot/templates/index.html',
        output: './wwwroot/index.html',
        replacements: {
            TITLE: 'Pocket Board Finance - Maîtrisez Vos Finances Facilement',
            DESCRIPTION: 'L\'application de gestion financière personnelle la plus simple et sécurisée. Suivez vos comptes, dépenses et économies en toute simplicité.'
        }
    },
    {
        template: './wwwroot/templates/about.html',
        output: './wwwroot/about.html',
        replacements: {
            TITLE: 'À Propos - Pocket Board Finance',
            DESCRIPTION: 'Découvrez l\'histoire de Pocket Board Finance, développé par Florian Anthony en 2024.'
        }
    },
    {
        template: './wwwroot/templates/pricing.html',
        output: './wwwroot/pricing.html',
        replacements: {
            TITLE: 'Tarifs - Pocket Board Finance',
            DESCRIPTION: 'Une application 100% gratuite pour la gestion de vos finances personnelles.'
        }
    },
    {
        template: './wwwroot/templates/features.html',
        output: './wwwroot/features.html',
        replacements: {
            TITLE: 'Fonctionnalités - Pocket Board Finance',
            DESCRIPTION: 'Découvrez toutes les fonctionnalités de Pocket Board Finance pour gérer vos finances.'
        }
    }
];

// Create templates directory if it doesn't exist
if (!fs.existsSync('./wwwroot/templates')) {
    fs.mkdirSync('./wwwroot/templates', { recursive: true });
}

// Build all pages
console.log('🚀 Building pages with components...\n');

pages.forEach(page => {
    buildPage(page.template, page.output, page.replacements);
});

console.log('\n✅ All pages built successfully!');