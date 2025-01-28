import { renderHeader } from './components/header.js';
import { navigateTo } from './components/router.js';
import { login, verifyToken } from './components/api.js';

// Display error messages
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Check user session by verifying the token
async function checkSession() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
        const response = await verifyToken(token); // Verify token with backend
        const user = response.user;

        if (user.role !== 'ENS Admin') {
            throw new Error('Access restricted to ENS Admin users.');
        }

        // Restore the session
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    } catch (err) {
        console.error('Session verification failed:', err.message);
        localStorage.removeItem('token'); // Clear invalid token
        localStorage.removeItem('user');
        return false;
    }
}

// Initialize login functionality
async function initializeLogin() {
    const isLoggedIn = await checkSession();

    if (isLoggedIn) {
        console.log('Session restored, loading app...');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block'; // Ensure content is shown
        navigateTo(''); // Navigate to the home page
        return;
    }

    console.log('No active session, showing login form...');
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await login({ email, password });
            const user = response.user;

            if (user.role !== 'ENS Admin') {
                throw new Error('Access restricted to ENS Admin users.');
            }

            // Save session data
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', response.token);

            // Hide login and load the app
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            navigateTo(''); // Navigate to home after login
        } catch (err) {
            console.error(err);
            showError(err.message || 'Invalid login credentials.');
        }
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    // Render the header
    renderHeader(navigateTo);

    // Load the appropriate content based on the session and routing
    const isLoggedIn = await checkSession();

    if (isLoggedIn) {
        console.log('User is logged in. Loading application...');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block'; // Show content area
        navigateTo(window.location.hash.replace('#', '') || ''); // Load the initial route
    } else {
        console.log('User is not logged in. Showing login form...');
        document.getElementById('login-container').style.display = 'block'; // Show login form
        document.getElementById('main-content').style.display = 'none'; // Hide content area
        initializeLogin(); // Initialize the login process
    }
});
