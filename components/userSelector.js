import { renderUserForm } from './userForm.js';
import { setCurrentUser, getCurrentUser, resetCurrentUser } from './stateManager.js';

// DOM Elements
const selectorWrap = document.getElementById('selectorWrap');
const fullFormWrap = document.getElementById('fullForm');

export function resetUserForm() {
    if (fullFormWrap) {
        fullFormWrap.innerHTML = ''; // Clear the form
    }
    resetCurrentUser(); // Reset state
}

export function initializeUserApp() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div id="selectorWrap"></div>
        <div id="fullForm"></div>
        <div id="userList"></div> <!-- Where user details will be displayed -->
    `;

    renderUserSelector(); // Render dropdown

    const currentUser = getCurrentUser();
    if (currentUser) {
        console.log('Initializing with user:', currentUser);
        renderUserForm(currentUser); // Render the form with user data
    }
}

export function renderUserSelector() {
    const selectorWrap = document.getElementById('selectorWrap');
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
                <label for="userClientSelect">Select a client:</label>
                <select id="userClientSelect">
                    <option value="">-- Select Client --</option>
                </select>
                <button id="selectClientUserBtn">Select Client</button>
            </div>
            <button id="resetUserBtn" style="background-color: #ffcccc; color: #b30000; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                Reset
            </button>
        </div>
    `;

    // Fetch clients and populate the dropdown
    fetch('https://client-control.911-ens-services.com/clients')
        .then(response => response.json())
        .then(clients => {
            const selectElement = document.getElementById('userClientSelect');

            // Add "911 ENS Admin" first with its key
            const ensOption = document.createElement('option');
            ensOption.value = '911-ens-admin';
            ensOption.textContent = '911 ENS Admin';
            selectElement.appendChild(ensOption);

            // Populate other client accounts using their `key`
            clients.forEach(client => {
                const option = document.createElement('option');
                option.value = client.key; // Store the key in the dropdown
                option.textContent = client.name;
                selectElement.appendChild(option);
            });

            document.getElementById('selectClientUserBtn').addEventListener('click', selectUserClient);
        })
        .catch(err => console.error('Error fetching clients:', err));
}

function selectUserClient() {
    const clientKey = document.getElementById('userClientSelect').value;

    if (!clientKey) {
        alert('Please select a client.');
        return;
    }

    console.log(`Fetching users for client key: ${clientKey}`);

    // Fetch users that have the selected `key`
    fetch(`https://client-control.911-ens-services.com/users?key=${clientKey}`)
        .then(response => response.json())
        .then(users => {
            const userList = document.getElementById('userList');
            if (!userList) {
                console.error('userList element not found!');
                return;
            }

            userList.innerHTML = ''; // Clear previous users

            if (users.length === 0) {
                userList.innerHTML = `<p>No users found for this client.</p>`;
                return;
            }

            users.forEach(user => {
                const userEntry = document.createElement('div');
                userEntry.className = 'user-entry';
                userEntry.innerHTML = `
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> ${user.role}</p>
                    <button onclick="editUser(${user.id})">Edit</button>
                `;
                userList.appendChild(userEntry);
            });
        })
        .catch(err => console.error('Error fetching users:', err));
}

function editUser(userId) {
    fetch(`https://client-control.911-ens-services.com/users/${userId}`)
        .then(response => response.json())
        .then(userData => {
            const fullFormWrap = document.getElementById('fullForm');
            if (fullFormWrap) {
                fullFormWrap.style.display = 'block'; // Show the form
                renderUserForm(userData); // Populate the form with user data
            }
        })
        .catch(err => console.error('Error fetching user data:', err));
}
