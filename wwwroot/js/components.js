// Component system for avoiding code repetition

class ComponentLoader {
    constructor() {
        this.components = {};
    }

    async loadComponent(name) {
        if (this.components[name]) {
            return this.components[name];
        }

        try {
            const response = await fetch(`/components/${name}.html`);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${name}`);
            }
            const html = await response.text();
            this.components[name] = html;
            return html;
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
            return '';
        }
    }

    async renderComponent(name, containerId, replacements = {}) {
        const html = await this.loadComponent(name);
        let processedHtml = html;

        // Replace placeholders
        Object.keys(replacements).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            processedHtml = processedHtml.replace(regex, replacements[key]);
        });

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = processedHtml;
        } else {
            console.error(`Container with id '${containerId}' not found`);
        }
    }

    async renderAll() {
        // Render header
        await this.renderComponent('header', 'header-container');
        
        // Render footer
        await this.renderComponent('footer', 'footer-container');
        
        // Render scripts
        await this.renderComponent('scripts', 'scripts-container');
    }
}

// Auto-initialize component loader
document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    await loader.renderAll();
    
    // Re-initialize any components that might need it
    if (typeof toggleMobileNav !== 'undefined') {
        // Mobile nav is already available from common.js
    }
});

// Export for manual use
window.ComponentLoader = ComponentLoader;