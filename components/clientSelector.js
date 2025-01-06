const clientList = document.getElementById('clients');
const flexButton = document.getElementById('flexButton');
const buttonWrap = document.getElementById('buttonWrap');
const addOns = document.getElementById('addOns');
const formPull = document.getElementById('fullForm');

import { renderClientForm } from './clientForm.js';


let singleGrab = "";

// Populate client selector
export function loadClients() {
    fetch('https://client-control.911-ens-services.com/clients') 
        .then(response => response.json())
        .then(data => {
            const selectorHTML = `
                <div class="selectOpt">
                    <form onsubmit="event.preventDefault(); selectClient();">
                        <label for="clients">Select a client:</label>
                        <select name="clients" id="clients">
                            ${data.map(client => `<option value="${client.id}">${client.name}</option>`).join('')}
                        </select>
                        <input type="submit" value="Select" />
                    </form>
                    <div id="buttonWrap">
                        <button id="flexButton" onclick="event.preventDefault(); newClient()">New Client</button>
                    </div>
                </div>
            `;
            document.getElementById('app').innerHTML = selectorHTML;
        })
        .catch(err => console.error('Error loading clients:', err));
}

function selectClient() {
    const clientId = document.getElementById('clients').value;
    fetch(`https://client-control.911-ens-services.com/client/${clientId}`)
    .then(response => response.json())
    .then(clientData => {
        console.log(clientData);
        renderClientForm(clientData); // NEW FUNCTION
    })
        .catch(err => console.error('Error fetching client:', err));
}

window.selectClient = selectClient;

loadClients();
