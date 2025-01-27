import { renderHeader } from './components/header.js';
import { initializeApp } from './components/clientSelector.js';
import { login, verifyToken } from './components/api.js';

function showError(message) {
    const errorElement = document.getElementById('error-message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

async function checkSession() {
    const token = localStorage.getItem('token');
    if (!token) return false; // No token, show the login page

    try {
        const response = await verifyToken(token); // Verify token with backend
        const user = response.user;

        if (user.role !== 'ENS Admin') {
            throw new Error('Access restricted to ENS Admin users.');
        }

        // If valid, restore the session
        localStorage.setItem('user', JSON.stringify(user));
        return true;
    } catch (err) {
        console.error('Session verification failed:', err.message);
        localStorage.removeItem('token'); // Clear invalid token
        localStorage.removeItem('user');
        return false;
    }
}

async function initializeLogin() {
    const isLoggedIn = await checkSession();

    if (isLoggedIn) {
        console.log('Session restored, loading app...');
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('selectorWrap').style.display = 'block';
        document.getElementById('addOns').style.display = 'block';
        document.getElementById('fullForm').style.display = 'block';

        renderHeader();
        initializeApp();
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

            // Hide login and show the app
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('selectorWrap').style.display = 'block';
            document.getElementById('addOns').style.display = 'block';
            document.getElementById('fullForm').style.display = 'block';

            renderHeader();
            initializeApp();
        } catch (err) {
            console.error(err);
            showError(err.message || 'Invalid login credentials.');
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeLogin);
