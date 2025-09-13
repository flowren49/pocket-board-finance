// Script pour améliorer l'affichage mobile du contenu principal

// Améliorer les cartes et conteneurs pour mobile
function improveMobileContent() {
    // Améliorer les cartes
    const cards = document.querySelectorAll('.bg-white.rounded-lg.shadow');
    cards.forEach(card => {
        if (!card.classList.contains('mobile-optimized')) {
            card.classList.add('mobile-optimized', 'p-4', 'sm:p-6', 'mb-4', 'sm:mb-6');
        }
    });

    // Améliorer les grilles
    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
        if (grid.classList.contains('grid-cols-1') && !grid.classList.contains('sm:grid-cols-2')) {
            grid.classList.add('sm:grid-cols-2', 'lg:grid-cols-3', 'gap-4', 'sm:gap-6');
        }
    });

    // Améliorer les boutons
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(btn => {
        if (!btn.classList.contains('mobile-btn')) {
            btn.classList.add('mobile-btn', 'min-h-[44px]', 'px-4', 'py-2', 'text-sm', 'sm:text-base');
        }
    });

    // Améliorer les formulaires
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!input.classList.contains('mobile-input')) {
            input.classList.add('mobile-input', 'min-h-[44px]', 'text-base', 'px-4', 'py-3');
        }
    });

    // Améliorer les modals pour mobile
    const modals = document.querySelectorAll('.fixed.inset-0');
    modals.forEach(modal => {
        if (!modal.classList.contains('mobile-modal')) {
            modal.classList.add('mobile-modal');
            const modalContent = modal.querySelector('.bg-white.rounded-lg');
            if (modalContent) {
                modalContent.classList.add('mx-4', 'my-4', 'max-h-[90vh]', 'overflow-y-auto');
            }
        }
    });
}

// Améliorer les espacements et tailles pour mobile
function improveMobileSpacing() {
    // Améliorer les conteneurs principaux
    const mainContent = document.querySelector('.flex-1');
    if (mainContent && !mainContent.classList.contains('mobile-main')) {
        mainContent.classList.add('mobile-main', 'p-4', 'sm:p-6', 'lg:p-8', 'min-h-screen');
    }

    // Améliorer les headers
    const headers = document.querySelectorAll('h1, h2, h3');
    headers.forEach(header => {
        if (!header.classList.contains('mobile-header')) {
            if (header.tagName === 'H1') {
                header.classList.add('mobile-header', 'text-2xl', 'sm:text-3xl', 'lg:text-4xl');
            } else if (header.tagName === 'H2') {
                header.classList.add('mobile-header', 'text-xl', 'sm:text-2xl', 'lg:text-3xl');
            } else {
                header.classList.add('mobile-header', 'text-lg', 'sm:text-xl', 'lg:text-2xl');
            }
        }
    });

    // Améliorer les paragraphes
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
        if (!p.classList.contains('mobile-text')) {
            p.classList.add('mobile-text', 'text-sm', 'sm:text-base', 'lg:text-lg');
        }
    });
}

// Améliorer la navigation mobile
function improveMobileNavigation() {
    // Améliorer la navbar
    const navbar = document.querySelector('nav');
    if (navbar && !navbar.classList.contains('mobile-nav')) {
        navbar.classList.add('mobile-nav');
    }

    // Améliorer les liens de navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (!link.classList.contains('mobile-nav-link')) {
            link.classList.add('mobile-nav-link', 'min-h-[44px]', 'flex', 'items-center');
        }
    });
}

// Fonction principale d'amélioration mobile
function enhanceMobileExperience() {
    console.log('🚀 Amélioration de l\'expérience mobile...');
    
    improveMobileContent();
    improveMobileSpacing();
    improveMobileNavigation();
    
    console.log('✅ Expérience mobile améliorée !');
}

// Appliquer les améliorations au chargement de la page
document.addEventListener('DOMContentLoaded', enhanceMobileExperience);

// Réappliquer les améliorations lors du redimensionnement
window.addEventListener('resize', () => {
    setTimeout(enhanceMobileExperience, 100);
});