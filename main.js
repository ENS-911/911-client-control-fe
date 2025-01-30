import { renderHeader } from './components/header.js';
import { navigateTo } from './components/router.js';
import { login, verifyToken } from './components/api.js';

// Display error messages
function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

async function checkSession() {
    const token = localStorage.getItem('token');
    if (!token) {
        resetToLogin(); // Ensure UI is reset
        return false;
    }

    try {
        const response = await verifyToken(token);
        const user = response.user;

        if (user.role !== 'ENS Admin') {
            throw new Error('Access restricted to ENS Admin users.');
        }

        localStorage.setItem('user', JSON.stringify(user));
        return true;
    } catch (err) {
        console.error('Session verification failed:', err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        resetToLogin(); // Reset UI when session expires
        return false;
    }
}

async function initializeLogin() {
    const isLoggedIn = await checkSession();

    if (isLoggedIn) {
        console.log('Session restored, loading app...');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';

        // Restore menu visibility
        const dropdownMenu = document.getElementById('dropdown-menu');
        const hamburger = document.getElementById('hamburger');
        if (dropdownMenu) dropdownMenu.style.display = 'block';
        if (hamburger) hamburger.style.display = 'flex';

        navigateTo(''); // Navigate to the home page
        return;
    }

    console.log('No active session, showing login form...');
    resetToLogin(); // Ensure old UI is cleared before showing login

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.removeEventListener('submit', handleLogin); // Remove any previous event listener
        loginForm.addEventListener('submit', handleLogin); // Attach the correct event listener
    }
}

// Handle login event
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await login({ email, password });
        const user = response.user;

        if (user.role !== 'ENS Admin') {
            throw new Error('Access restricted to ENS Admin users.');
        }

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.token);

        // Ensure the login container is hidden and main content is displayed
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';

        navigateTo(''); // Navigate to home after login
    } catch (err) {
        console.error(err);
        showError(err.message || 'Invalid login credentials.');
    }
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

export function resetToLogin() {
    console.log("Resetting to login screen...");

    // Hide all operational sections
    const mainContent = document.getElementById('main-content');
    const selectorWrap = document.getElementById('selectorWrap');
    const fullFormWrap = document.getElementById('fullForm');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const hamburger = document.getElementById('hamburger');

    if (mainContent) mainContent.innerHTML = ''; // Remove any loaded content
    if (selectorWrap) selectorWrap.style.display = 'none'; // Hide client selector
    if (fullFormWrap) fullFormWrap.style.display = 'none'; // Hide client form

    // Hide only the menu components (but not the header itself)
    if (dropdownMenu) dropdownMenu.style.display = 'none';
    if (hamburger) hamburger.style.display = 'none';

    // Ensure the login container is visible
    const loginContainer = document.getElementById('login-container');
    if (loginContainer) {
        loginContainer.style.display = 'flex'; // Ensure flex positioning for login
    }

    // Redirect to login page (force logout)
    navigateTo('');

    // Remove stored user session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}
