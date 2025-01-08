import { renderHeader } from './components/header.js';
import { initializeApp } from './components/clientSelector.js';

function initialize() {
    renderHeader(); // Updated function call
    initializeApp(); // Ensure this function is available
}

document.addEventListener('DOMContentLoaded', initialize);
