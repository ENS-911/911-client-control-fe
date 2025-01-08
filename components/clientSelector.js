import { renderForm } from './clientForm.js';

// DOM Elements
const selectorWrap = document.getElementById('selectorWrap');
const fullFormWrap = document.getElementById('fullForm');

// Track the current client (existing or new)
let currentClient = null;

// Initialize the app
export function initializeApp() {
    setupButtons(); // Setup static buttons (new client and save/update)
    loadClients();  // Populate dropdown dynamically
}

// 1. Load clients and populate dropdown
function loadClients() {
    const dropdownHTML = `
        <label for="clientSelect">Select a client:</label>
        <select id="clientSelect">
            <option value="">-- Select Client --</option>
        </select>
        <button id="selectClientBtn">Select Client</button>
    `;
    selectorWrap.innerHTML = dropdownHTML; // Insert dropdown without affecting buttons

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

            // Attach event listener for "Select Client" button
            document.getElementById('selectClientBtn').addEventListener('click', selectClient);
        })
        .catch(err => console.error('Error loading clients:', err));
}

// 2. Handle selecting an existing client
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

            if (!clientData || Object.keys(clientData).length === 0) {
                console.error('Empty or invalid client data received.');
                return;
            }

            currentClient = clientData; // Set the current client context
            renderForm(clientData);    // Populate form with existing client data
            toggleButtonState(false); // Set button to "Update"
        })
        .catch(err => console.error('Error fetching client:', err));
}

// 3. Handle creating a new client
function newClient() {
    currentClient = null; // Clear client context
    renderForm();          // Render an empty form for new client
    toggleButtonState(true); // Set button to "Save"
}

// 4. Setup buttons for "New Client" and "Save/Update"
function setupButtons() {
    // Ensure buttons persist across dropdown reloads
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';

    buttonContainer.innerHTML = `
        <button id="newClientBtn">New Client</button>
        <button id="saveUpdateBtn">Save</button>
    `;

    selectorWrap.after(buttonContainer); // Place buttons below the dropdown

    // Add event listeners
    document.getElementById('newClientBtn').addEventListener('click', newClient);
    document.getElementById('saveUpdateBtn').addEventListener('click', handleFormSubmit);
}

// 5. Toggle button between Save and Update
function toggleButtonState(isNew) {
    const saveUpdateBtn = document.getElementById('saveUpdateBtn');
    saveUpdateBtn.innerText = isNew ? 'Save' : 'Update';
}

// 6. Handle saving or updating client data
function handleFormSubmit() {
    const isNewClient = !currentClient; // New client if no data set

    // Collect form values
    const formData = {
        key: isNewClient ? generateLicenseKey() : currentClient.key,
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        phone_number: document.getElementById('phone_number').value,
        email: document.getElementById('email').value,
        website: document.getElementById('website').value,
        active: document.getElementById('active').value,
        plan: document.getElementById('plan').value,
        nws: document.getElementById('nws').value,
        dbsync: document.getElementById('dbsync').value,
        raw_server: document.getElementById('raw_server').value,
        raw_user: document.getElementById('raw_user').value,
        raw_pass: document.getElementById('raw_pass').value,
        raw_table: document.getElementById('raw_table').value,
        raw_table_name: document.getElementById('raw_table_name').value,
        db_type: document.getElementById('db_type').value,
        trans_db_loc: document.getElementById('trans_db_loc').value,
        agency_type: document.getElementById('agency_type').value,
        battalion: document.getElementById('battalion').value,
        db_city: document.getElementById('db_city').value,
        jurisdiction: document.getElementById('jurisdiction').value,
    };

    const url = isNewClient
        ? 'https://client-control.911-ens-services.com/clients'
        : `https://client-control.911-ens-services.com/client/${currentClient.id}`;

    fetch(url, {
        method: isNewClient ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(result => {
            console.log(`${isNewClient ? 'Saved' : 'Updated'} client:`, result);
            loadClients(); // Refresh dropdown
        })
        .catch(err => console.error(`Error ${isNewClient ? 'saving' : 'updating'} client:`, err));
}

// 7. Generate license key for new clients
function generateLicenseKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
