import { renderForm } from './clientForm.js';
import { setCurrentClient, getCurrentClient, resetCurrentClient } from './stateManager.js';

// DOM Elements
const selectorWrap = document.getElementById('selectorWrap');
const fullFormWrap = document.getElementById('fullForm');

export function resetForm() {
    const fullFormWrap = document.getElementById('fullForm');
    if (fullFormWrap) {
        fullFormWrap.innerHTML = ''; // Clear the form
    }
    resetCurrentClient(); // Reset state
}

export function initializeApp() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div id="selectorWrap"></div>
        <div id="fullForm"></div>
    `;

    renderClientSelector(); // Render client dropdown and buttons

    // Check and render the current client form if a client exists in state
    const currentClient = getCurrentClient();
    if (currentClient) {
        console.log('Initializing with client:', currentClient);
        renderForm(currentClient); // Render the form with the client data
    }
}

export function renderClientSelector() {
    const selectorWrap = document.getElementById('selectorWrap');
    const fullFormWrap = document.getElementById('fullForm');

    if (!selectorWrap) {
        console.error('selectorWrap element not found in index.html!');
        return;
    }

    // Show only the relevant sections
    selectorWrap.style.display = 'block';
    if (fullFormWrap) fullFormWrap.style.display = 'none'; // Hide the full form initially

    // Populate content inside selectorWrap
    selectorWrap.innerHTML = `
        <div class="selectOpt" style="display: flex; align-items: center; justify-content: space-between;">
            <div>
                <label for="clientSelect">Select a client:</label>
                <select id="clientSelect">
                    <option value="">-- Select Client --</option>
                </select>
                <button id="selectClientBtn">Select Client</button>
                <button id="newClientBtn">New Client</button>
            </div>
            <button id="resetBtn" style="background-color: #ffcccc; color: #b30000; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                Reset
            </button>
        </div>
    `;

    // Example fetch and client handling
    fetch('https://client-control.911-ens-services.com/clients')
        .then(response => response.json())
        .then(clients => {
            const selectElement = document.getElementById('clientSelect');
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                selectElement.appendChild(option);
            });

            document.getElementById('selectClientBtn').addEventListener('click', selectClient);
            document.getElementById('newClientBtn').addEventListener('click', () => {
                if (fullFormWrap) {
                    fullFormWrap.style.display = 'block'; // Show the full form
                    renderForm(); // Render a blank form
                }
            });
        })
        .catch(err => console.error('Error fetching clients:', err));
}

function selectClient() {
    const clientId = document.getElementById('clientSelect').value;

    if (!clientId) {
        alert('Please select a client.');
        return;
    }

    fetch(`https://client-control.911-ens-services.com/client/${clientId}`)
        .then(response => response.json())
        .then(clientData => {
            const fullFormWrap = document.getElementById('fullForm');
            if (fullFormWrap) {
                fullFormWrap.style.display = 'block'; // Show the full form
                renderForm(clientData); // Populate the form with client data
            }
        })
        .catch(err => console.error('Error fetching client data:', err));
}
