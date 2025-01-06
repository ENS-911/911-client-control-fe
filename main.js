import { renderHeader } from './components/header.js';
import { loadClients } from './components/clientSelector.js';

function initializeApp() {
    renderHeader(); // Updated function call
    loadClients(); // Ensure this function is available
}

initializeApp();
