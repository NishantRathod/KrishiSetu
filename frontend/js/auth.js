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

// Handle Login
async function handleLogin(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Get form data
    const email = form.querySelector('input[type="text"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    // Validate
    if (!email || !password) {
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
            body: JSON.stringify({ email, password })
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
                window.location.href = 'dashboard.html';
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
    const inputs = form.querySelectorAll('input, select');
    const firstName = inputs[0].value.trim();
    const lastName = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const phone = inputs[3].value.trim();
    const role = inputs[4].value;
    const password = inputs[6].value;
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
                role: role.split(' ')[1] || 'farmer'  // Extract role from option text
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
                window.location.href = 'dashboard.html';
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

        if (userNameEl) userNameEl.textContent = userData.name || 'User';
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

    // If on dashboard, protect page and load user info
    if (window.location.pathname.includes('dashboard.html')) {
        if (protectPage()) {
            loadUserInfo();
        }
    }

    // If logged in and on auth page, redirect to dashboard
    if (window.location.pathname.includes('auth.html') && isLoggedIn()) {
        window.location.href = 'dashboard.html';
    }
});

// Export functions for global use
window.KrishiAuth = {
    handleLogin,
    handleRegister,
    handleLogout,
    isLoggedIn,
    getUserData,
    protectPage,
    loadUserInfo,
    showNotification
};
