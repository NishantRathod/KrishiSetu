/**
 * KrishiSetu Authentication Handler
 * Handles login, registration, and JWT token management
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Utility: Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => notification.remove(), 5000);
}

// Utility: Store token
function storeToken(token) {
    localStorage.setItem('authToken', token);
}

// Utility: Get token
function getToken() {
    return localStorage.getItem('authToken');
}

// Utility: Remove token
function removeToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
}

// Utility: Store user data
function storeUserData(user) {
    localStorage.setItem('userData', JSON.stringify(user));
}

// Utility: Get user data
function getUserData() {
    const data = localStorage.getItem('userData');
    return data ? JSON.parse(data) : null;
}

// Utility: Check if user is logged in
function isLoggedIn() {
    return !!getToken();
}

// Map user role to its post-login dashboard
function getRoleDashboardPath(role) {
    const roleMap = {
        farmer: 'dashboard-farmer.html',
        fpo: 'dashboard-fpo.html',
        shg: 'dashboard-shg.html',
        processor: 'dashboard-processor.html',
        consumer: 'dashboard-consumer.html',
        startup: 'dashboard-startup.html'
    };

    return roleMap[(role || '').toLowerCase()] || 'dashboard-farmer.html';
}

// Redirect user based on selected/assigned role
function redirectToRoleDashboard() {
    const userData = getUserData() || {};
    window.location.href = getRoleDashboardPath(userData.role);
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Get form data
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const identifier = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    // Validate
    if (!identifier || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    try {
        // Show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        // Make API request
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier, email: identifier, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            storeToken(data.access_token);
            storeUserData(data.user);

            // Show success
            showNotification('Login successful! Redirecting...', 'success');
            submitBtn.textContent = '✓ Success!';

            // Redirect to dashboard after short delay
            setTimeout(() => {
                redirectToRoleDashboard();
            }, 1000);

        } else {
            // Show error
            showNotification(data.error || 'Login failed', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }

    } catch (error) {
        console.error('Login error:', error);
        showNotification('Connection error. Make sure backend is running on http://localhost:5000', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Handle Registration
async function handleRegister(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Get form data
    const firstName = (form.querySelector('input[name="firstName"]')?.value || '').trim();
    const lastName = (form.querySelector('input[name="lastName"]')?.value || '').trim();
    const email = (form.querySelector('input[name="email"]')?.value || '').trim();
    const phone = (form.querySelector('input[name="phone"]')?.value || '').trim();
    const role = form.querySelector('select[name="role"]')?.value || '';
    const password = form.querySelector('input[name="password"]')?.value || '';
    const termsChecked = form.querySelector('#agreeTerms').checked;

    // Validate
    if (!firstName || !lastName || !email || !phone || !role || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!termsChecked) {
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }

    try {
        // Show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        // Make API request
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${firstName} ${lastName}`,
                email,
                password,
                phone,
                role
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user data
            storeToken(data.access_token);
            storeUserData(data.user);

            // Show success
            showNotification('Registration successful! Redirecting...', 'success');
            submitBtn.textContent = '✓ Account Created!';

            // Redirect to dashboard after short delay
            setTimeout(() => {
                redirectToRoleDashboard();
            }, 1500);

        } else {
            // Show error
            showNotification(data.error || 'Registration failed', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }

    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Connection error. Make sure backend is running on http://localhost:5000', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

// Handle Logout
function handleLogout() {
    removeToken();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Protect dashboard pages (call this on dashboard.html)
function protectPage() {
    if (!isLoggedIn()) {
        showNotification('Please login to access this page', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return false;
    }
    return true;
}

// Load user info on dashboard
function loadUserInfo() {
    const userData = getUserData();
    if (userData) {
        // Update dashboard with user info
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const greetingNameEl = document.getElementById('greetingName');

        // Get first name for greeting
        const fullName = userData.name || 'User';
        const firstName = fullName.split(' ')[0];

        if (userNameEl) userNameEl.textContent = fullName;
        if (greetingNameEl) greetingNameEl.textContent = firstName;
        if (userRoleEl) {
            const role = userData.role || 'farmer';
            const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);
            userRoleEl.textContent = `${roleDisplay} · KrishiSetu`;
        }
    }
}

// Initialize auth handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Attach login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Attach register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Attach logout buttons
    document.querySelectorAll('[data-logout]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    });

    // If on dashboard/profile, protect page and load user info
    const roleDashboards = ['dashboard.html', 'dashboard-farmer.html', 'dashboard-consumer.html',
      'dashboard-fpo.html', 'dashboard-shg.html', 'dashboard-processor.html', 'dashboard-startup.html'];
    const isOnDashboard = roleDashboards.some(d => window.location.pathname.includes(d))
      || window.location.pathname.includes('profile.html');
    if (isOnDashboard) {
        if (protectPage()) {
            loadUserInfo();
        }
    }

    // If logged in and on auth page, redirect to role dashboard
    if (window.location.pathname.includes('auth.html') && isLoggedIn()) {
        redirectToRoleDashboard();
    }
});

// Export functions for global use
window.KrishiAuth = {
    handleLogin,
    handleRegister,
    handleLogout,
    isLoggedIn,
    getUserData,
    getRoleDashboardPath,
    redirectToRoleDashboard,
    protectPage,
    loadUserInfo,
    showNotification
};
