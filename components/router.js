import { renderHome } from './home.js';
import { renderClientSelector } from './clientSelector.js';

const routes = {
    '': renderHome, // Default route (home)
    'add-edit-client': renderClientSelector,
};

export function navigateTo(route) {
    // Update the hash without reloading the page
    window.location.hash = `#${route}`;
}

function clearPageContent() {
    const mainContent = document.getElementById('main-content');
    const selectorWrap = document.getElementById('selectorWrap');
    const fullFormWrap = document.getElementById('fullForm');

    // Clear or hide all dynamic sections
    if (mainContent) mainContent.innerHTML = ''; // Clear the main content area
    if (selectorWrap) selectorWrap.style.display = 'none'; // Hide the client selector
    if (fullFormWrap) fullFormWrap.style.display = 'none'; // Hide the full form
}

function loadRoute() {
    let hash = window.location.hash.replace('#', ''); // Remove the #
    if (hash.startsWith('/')) {
        hash = hash.slice(1); // Remove the leading /
    }
    console.log(`Current hash: "${hash}"`); // Debugging log

    const route = routes[hash]; // Find the corresponding route

    clearPageContent(); // Clear any old content before rendering the new view

    if (route) {
        console.log(`Rendering route: "${hash}"`); // Debugging log
        route();
    } else {
        console.error(`No route found for hash: "${hash}"`); // Debugging log
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h2>404 - Page Not Found</h2>
                </div>
            `;
        }
    }
}

// Listen for hash changes and load the corresponding route
window.addEventListener('hashchange', loadRoute);

// Load the initial route on page load
window.addEventListener('load', loadRoute);
