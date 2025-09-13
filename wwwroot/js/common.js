// Common JavaScript for all pages - Avoid code repetition

// Mobile navigation toggle
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const body = document.body;
    
    if (mobileNav) {
        const isActive = mobileNav.classList.contains('active');
        
        if (isActive) {
            // Close menu
            mobileNav.classList.remove('active');
            body.classList.remove('mobile-nav-open');
        } else {
            // Open menu
            mobileNav.classList.add('active');
            body.classList.add('mobile-nav-open');
        }
    }
}

// Close mobile nav when clicking outside
document.addEventListener('click', function(e) {
    const mobileNav = document.getElementById('mobileNav');
    const hamburger = document.querySelector('.hamburger');
    const body = document.body;
    
    if (mobileNav && mobileNav.classList.contains('active')) {
        // Check if click is outside the mobile nav content
        const mobileNavContent = mobileNav.querySelector('.mobile-nav-content');
        if (mobileNavContent && !mobileNavContent.contains(e.target) && 
            hamburger && !hamburger.contains(e.target)) {
            mobileNav.classList.remove('active');
            body.classList.remove('mobile-nav-open');
        }
    }
});

// Close mobile nav on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const mobileNav = document.getElementById('mobileNav');
        const body = document.body;
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            body.classList.remove('mobile-nav-open');
        }
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Common initialization
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to elements
    const elements = document.querySelectorAll('.animate-fade-in');
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
        }, index * 100);
    });
});