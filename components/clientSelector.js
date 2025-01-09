import { renderForm, handleFormSubmit } from './clientForm.js';
import { setCurrentClient, getCurrentClient, resetCurrentClient } from './stateManager.js';

// DOM Elements
const selectorWrap = document.getElementById('selectorWrap');
const fullFormWrap = document.getElementById('fullForm');

// Initialize the app
export function initializeApp() {
    renderClientSelector(); // Render client dropdown and buttons
    setupFormButtons();     // Setup "New Client" button
}

// 1. Render the client selector and buttons
function renderClientSelector() {
    const selectorHTML = `
        <label for="clientSelect">Select a client:</label>
        <select id="clientSelect">
            <option value="">-- Select Client --</option>
        </select>
        <button id="selectClientBtn">Select Client</button>
    `;
    selectorWrap.innerHTML = selectorHTML;

    // Fetch clients and populate dropdown
    fetch('https://client-control.911-ens-services.com/clients')
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById('clientSelect');
            data.forEach(client => {
                const option = document.createElement('option');
                option.value = client.id;
                option.textContent = client.name;
                selectElement.appendChild(option);
            });

            // Add event listener for "Select Client" button
            document.getElementById('selectClientBtn').addEventListener('click', selectClient);
        })
        .catch(err => console.error('Error loading clients:', err));
}

// 2. Setup "New Client" button and toggle functionality
function setupFormButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';

    buttonContainer.innerHTML = `
        <button id="newClientBtn">New Client</button>
    `;
    selectorWrap.after(buttonContainer); // Place below dropdown

    // Add event listener for "New Client" button
    document.getElementById('newClientBtn').addEventListener('click', () => {
        resetCurrentClient(); // Clear client context
        renderForm();          // Render an empty form for new client
        toggleNewClientButton(true); // Change button to "Save"
    });
}

// 3. Handle selecting an existing client
function selectClient() {
    const clientId = document.getElementById('clientSelect').value;

    if (!clientId) {
        alert('Please select a client.');
        return;
    }

    resetForm();

    // Fetch client data
    fetch(`https://client-control.911-ens-services.com/client/${clientId}`)
        .then(response => response.json())
        .then(clientData => {
            console.log('Fetched client data:', clientData);

            if (!clientData || Object.keys(clientData).length === 0) {
                console.error('Empty or invalid client data received.');
                return;
            }

            setCurrentClient(clientData); // Update state
            renderForm(clientData);       // Populate form with existing client data
            toggleNewClientButton(false); // Change button to "Update"
        })
        .catch(err => console.error('Error fetching client:', err));
}

// 4. Toggle "New Client" button to "Save" or "Update"
function toggleNewClientButton(isNewClient) {
    const newClientBtn = document.getElementById('newClientBtn');

    if (!newClientBtn) {
        console.error('New Client button is missing!');
        return;
    }

    // Clear existing event listeners by replacing the button
    const newButton = newClientBtn.cloneNode(true);
    newClientBtn.replaceWith(newButton);

    // Update button text and reattach appropriate event listener
    if (isNewClient) {
        newButton.innerText = 'Save';
        newButton.onclick = () => handleFormSubmit(null); // Save for new client
    } else {
        newButton.innerText = 'Update';
        newButton.onclick = () => handleFormSubmit(getCurrentClient()); // Update for existing client
    }

    // Update button's ID for consistency
    newButton.id = 'newClientBtn';
}

function resetForm() {
    const fullFormWrap = document.getElementById('fullForm');
    if (fullFormWrap) {
        fullFormWrap.innerHTML = ''; // Clear the form
    }
    resetCurrentClient(); // Reset the context
}
