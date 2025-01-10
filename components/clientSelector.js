import { renderForm, handleFormSubmit } from './clientForm.js';
import { setCurrentClient, getCurrentClient, resetCurrentClient } from './stateManager.js';

// DOM Elements
const selectorWrap = document.getElementById('selectorWrap');
const fullFormWrap = document.getElementById('fullForm');

export function initializeApp() {
    renderClientSelector(); // Render client dropdown and buttons

    // Check and render the current client form if a client exists in state
    const currentClient = getCurrentClient();
    if (currentClient) {
        console.log('Initializing with client:', currentClient);
        renderForm(currentClient); // Render the form with the client data
    }
}

function renderClientSelector() {
    const selectorHTML = `
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

            // Add event listeners for buttons
            document.getElementById('selectClientBtn').addEventListener('click', selectClient);
            document.getElementById('newClientBtn').addEventListener('click', () => {
                setCurrentClient(null); // Clear state
                renderForm(); // Render an empty form
            });
            document.getElementById('resetBtn').addEventListener('click', () => {
                window.location.reload(); // Refresh the page
            });
        })
        .catch(err => console.error('Error loading clients:', err));
}

function selectClient() {
    const clientId = document.getElementById('clientSelect').value;

    if (!clientId) {
        alert('Please select a client.');
        return;
    }

    // Fetch client data
    fetch(`https://client-control.911-ens-services.com/client/${clientId}`)
        .then(response => response.json())
        .then(clientData => {
            console.log('Fetched client data:', clientData);
            setCurrentClient(clientData); // Update state with selected client
            renderForm(clientData); // Populate form with client data
        })
        .catch(err => console.error('Error fetching client:', err));
}

function toggleNewClientButton(isNewClient) {
    const buttonContainer = document.getElementById('buttonContainer');
    if (!buttonContainer) {
        console.error("Button container not found!");
        return;
    }

    // Clear the container to avoid duplicate buttons
    buttonContainer.innerHTML = "";

    // Create the new button with the appropriate state
    const actionButton = document.createElement('button');
    actionButton.id = "actionButton";

    if (isNewClient) {
        actionButton.innerText = "Save";
        actionButton.onclick = () => handleFormSubmit(null); // Save logic for new client
    } else {
        actionButton.innerText = "Update";
        actionButton.onclick = () => handleFormSubmit(getCurrentClient()); // Update logic for existing client
    }

    // Append the new action button to the container
    buttonContainer.appendChild(actionButton);
}

export function resetForm() {
    const fullFormWrap = document.getElementById('fullForm');
    if (fullFormWrap) {
        fullFormWrap.innerHTML = ''; // Clear the form
    }
    resetCurrentClient(); // Reset state
}
