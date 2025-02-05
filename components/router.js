import { renderHome } from './home.js';
import { renderClientSelector } from './clientSelector.js';
import { initializeLogin } from '../main.js';

const routes = {
    '': renderHome, // Home
    'add-edit-client': renderClientSelector, // Add/Edit Client
    'add-edit-user': () => console.log("Add/Edit User Clicked (No function yet)"), // Placeholder
    'login': initializeLogin, // Login
};

export function navigateTo(route) {
    if (!route && route !== '') {
        console.error("Error: Invalid route received in navigateTo:", route);
        return;
    }

    console.log(`Navigating to: ${route}`);
    window.location.hash = `#${route}`;
    updateUI();
}

export function updateUI() {
    let hash = window.location.hash.replace('#', '').replace('/', '');
    if (!hash) hash = ''; // Default to home if hash is empty

    console.log(`Updating UI for route: "${hash}"`);

    // Select UI elements
    const mainContent = document.getElementById('main-content');
    const selectorWrap = document.getElementById('selectorWrap');
    const fullFormWrap = document.getElementById('fullForm');
    const loginContainer = document.getElementById('login-container');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const hamburger = document.getElementById('hamburger');

    console.log("Hiding all UI elements...");

    // Reset UI: Hide everything first
    if (mainContent) mainContent.style.display = 'none';
    if (selectorWrap) selectorWrap.style.display = 'none';
    if (fullFormWrap) fullFormWrap.style.display = 'none';
    if (loginContainer) loginContainer.style.display = 'none';
    if (dropdownMenu) dropdownMenu.style.display = 'none';
    if (hamburger) hamburger.style.display = 'none';

    console.log(`Now showing elements for route: "${hash}"`);

    // Show only the relevant UI based on the hash
    if (hash === 'login') {
        if (loginContainer) loginContainer.style.display = 'flex';
        console.log("Showing login page.");
    } else {
        if (mainContent) mainContent.style.display = 'block';
        if (dropdownMenu) dropdownMenu.style.display = 'block';
        if (hamburger) hamburger.style.display = 'flex';
        console.log("Showing main content & menu.");
    }

    if (routes[hash]) {
        routes[hash]();
    } else {
        mainContent.innerHTML = `<h2 style="text-align: center;">404 - Page Not Found</h2>`;
    }
}

window.addEventListener('hashchange', updateUI);
window.addEventListener('load', updateUI);
