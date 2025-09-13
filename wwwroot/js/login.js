// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginSpinner = document.getElementById('loginSpinner');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validation
        if (!email || !password) {
            showToast('Veuillez remplir tous les champs', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showToast('Veuillez entrer une adresse email valide', 'error');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Simulate API call for demo
            await simulateLogin(email, password);
            
            // In real app, use: await window.authManager.login(email, password);
            
            showToast('Connexion réussie !', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1000);

        } catch (error) {
            showToast('Erreur de connexion: ' + error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    });

    function setLoadingState(loading) {
        loginSubmitBtn.disabled = loading;
        
        if (loading) {
            loginBtnText.classList.add('hidden');
            loginSpinner.classList.remove('hidden');
        } else {
            loginBtnText.classList.remove('hidden');
            loginSpinner.classList.add('hidden');
        }
    }

    async function simulateLogin(email, password) {
        // Simulation de l'API pour la démo
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Comptes de démonstration
                const demoAccounts = {
                    'admin@demo.com': 'Admin123!',
                    'user@demo.com': 'User123!',
                    'test@demo.com': 'Test123!'
                };

                if (demoAccounts[email] && demoAccounts[email] === password) {
                    // Simuler un token JWT
                    const token = generateMockToken(email);
                    const user = {
                        id: 1,
                        email: email,
                        firstName: email === 'admin@demo.com' ? 'Admin' : 'Utilisateur',
                        lastName: email === 'admin@demo.com' ? 'Demo' : 'Test',
                        role: email === 'admin@demo.com' ? 'admin' : 'user'
                    };

                    // Stocker dans localStorage
                    localStorage.setItem('pf_auth_token', token);
                    localStorage.setItem('pf_user_data', JSON.stringify(user));
                    
                    resolve({ token, user });
                } else {
                    reject(new Error('Email ou mot de passe incorrect'));
                }
            }, 1500); // Simuler un délai réseau
        });
    }

    function generateMockToken(email) {
        // Simulation d'un token JWT
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: email,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 heures
            iat: Math.floor(Date.now() / 1000),
            role: email === 'admin@demo.com' ? 'admin' : 'user'
        }));
        const signature = btoa('mock_signature');
        
        return `${header}.${payload}.${signature}`;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Check if user is already logged in
    const token = localStorage.getItem('pf_auth_token');
    if (token && isTokenValid(token)) {
        showToast('Vous êtes déjà connecté', 'info');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
    }
});

function isTokenValid(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        return payload.exp > now;
    } catch (error) {
        return false;
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        warning: 'bg-yellow-50 border-yellow-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const textColors = {
        success: 'text-green-800',
        error: 'text-red-800',
        warning: 'text-yellow-800',
        info: 'text-blue-800'
    };

    const iconColors = {
        success: 'text-green-400',
        error: 'text-red-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400'
    };

    toast.className = `max-w-sm w-full sm:w-auto mx-4 sm:mx-0 ${bgColors[type]} border rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 translate-x-full`;
    
    toast.innerHTML = `
        <div class="p-4">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="fas ${icons[type]} ${iconColors[type]} text-lg"></i>
                </div>
                <div class="ml-3 w-0 flex-1">
                    <p class="text-sm font-medium ${textColors[type]}">${message}</p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                    <button onclick="this.closest('div').remove()" class="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);

    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}