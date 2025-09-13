// Register Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');
    const registerBtnText = document.getElementById('registerBtnText');
    const registerSpinner = document.getElementById('registerSpinner');

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    toggleConfirmPasswordBtn.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Password strength checker
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });

    // Handle form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        // Validation
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            // Simulate API call for demo
            await simulateRegister(formData);
            
            // In real app, use: await window.authManager.register(formData);
            
            showToast('Compte créé avec succès !', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);

        } catch (error) {
            showToast('Erreur d\'inscription: ' + error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    });

    function setLoadingState(loading) {
        registerSubmitBtn.disabled = loading;
        
        if (loading) {
            registerBtnText.classList.add('hidden');
            registerSpinner.classList.remove('hidden');
        } else {
            registerBtnText.classList.remove('hidden');
            registerSpinner.classList.add('hidden');
        }
    }

    function validateForm(data) {
        // Check required fields
        if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
            showToast('Veuillez remplir tous les champs', 'error');
            return false;
        }

        // Check email format
        if (!isValidEmail(data.email)) {
            showToast('Veuillez entrer une adresse email valide', 'error');
            return false;
        }

        // Check password strength
        if (!isPasswordStrong(data.password)) {
            showToast('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial', 'error');
            return false;
        }

        // Check password confirmation
        if (data.password !== data.confirmPassword) {
            showToast('Les mots de passe ne correspondent pas', 'error');
            return false;
        }

        return true;
    }

    function checkPasswordStrength(password) {
        const strengthIndicator = document.getElementById('passwordStrength');
        const strengthBars = strengthIndicator.querySelectorAll('div');
        const strengthText = document.getElementById('passwordStrengthText');

        if (password.length === 0) {
            strengthIndicator.classList.add('hidden');
            return;
        }

        strengthIndicator.classList.remove('hidden');

        let strength = 0;
        let strengthLabel = '';

        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;

        // Character type checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        // Update visual indicator
        strengthBars.forEach((bar, index) => {
            if (index < strength) {
                if (strength <= 2) {
                    bar.className = 'h-2 w-full bg-red-500 rounded-full';
                } else if (strength <= 4) {
                    bar.className = 'h-2 w-full bg-yellow-500 rounded-full';
                } else {
                    bar.className = 'h-2 w-full bg-green-500 rounded-full';
                }
            } else {
                bar.className = 'h-2 w-full bg-gray-200 rounded-full';
            }
        });

        // Update text
        if (strength <= 2) {
            strengthLabel = 'Faible';
            strengthText.className = 'text-xs mt-1 text-red-600';
        } else if (strength <= 4) {
            strengthLabel = 'Moyen';
            strengthText.className = 'text-xs mt-1 text-yellow-600';
        } else {
            strengthLabel = 'Fort';
            strengthText.className = 'text-xs mt-1 text-green-600';
        }

        strengthText.textContent = `Force du mot de passe: ${strengthLabel}`;
    }

    async function simulateRegister(userData) {
        // Simulation de l'API pour la démo
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuler une vérification email
                const existingEmails = ['admin@demo.com', 'user@demo.com'];
                
                if (existingEmails.includes(userData.email)) {
                    reject(new Error('Cette adresse email est déjà utilisée'));
                    return;
                }

                // Simuler un token JWT
                const token = generateMockToken(userData.email);
                const user = {
                    id: Date.now(),
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    role: 'user'
                };

                // Stocker dans localStorage
                localStorage.setItem('pf_auth_token', token);
                localStorage.setItem('pf_user_data', JSON.stringify(user));
                
                resolve({ token, user });
            }, 2000); // Simuler un délai réseau
        });
    }

    function generateMockToken(email) {
        // Simulation d'un token JWT
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            sub: email,
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 heures
            iat: Math.floor(Date.now() / 1000),
            role: 'user'
        }));
        const signature = btoa('mock_signature');
        
        return `${header}.${payload}.${signature}`;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isPasswordStrong(password) {
        // Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(password);
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