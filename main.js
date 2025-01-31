import { renderHeader } from './components/header.js';
import { navigateTo, updateUI } from './components/router.js';
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
        window.location.hash = 'login'; // Redirect to login
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

        window.location.hash = 'login'; // Redirect to login
        return false;
    }
}

export function initializeLogin() {
    console.log('Loading login screen...');

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
    }
}

async function handleLogin(event) {
    event.preventDefault(); // Prevents the form from submitting via the browser

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

        console.log("Login successful, navigating to home...");
        window.location.hash = ''; // Redirect to home

    } catch (err) {
        console.error(err);
        showError(err.message || 'Invalid login credentials.');
    }
}

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

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Initializing application...");

    renderHeader(); // Ensure header is always rendered
    console.log("Header should now be visible.");

    const isLoggedIn = await checkSession();
    if (!isLoggedIn) {
        console.log("No valid session, redirecting to login...");
        window.location.hash = 'login';
    }

    updateUI(); // Ensure UI updates on first load
});

export function handleLogout() {
    console.log("Logging out...");

    // Remove stored session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Redirect to login
    window.location.hash = 'login';

    // Ensure UI updates
    updateUI();
}