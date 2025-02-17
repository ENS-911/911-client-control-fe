import { gatherFormData, generateLicenseKey } from './helpers.js';
import { setCurrentClient } from './stateManager.js';
import { initializeApp, resetForm } from './clientSelector.js';

export function renderForm(clientData = null) {
    const isNewClient = !clientData;
    const fullFormWrap = document.getElementById('fullForm');
    fullFormWrap.innerHTML = ""; // Clear previous form content

    // Form Header
    const formHeader = document.createElement('div');
    formHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    `;
    const formLabel = document.createElement('h3');
    formLabel.innerText = isNewClient
        ? "New Client Form - License Key: Auto-generated"
        : `Data for: ${clientData.name} --- License Key: ${clientData.key}`;
    formHeader.appendChild(formLabel);

    // Add Delete Button if it's an existing client
    if (!isNewClient) {
        const deleteButton = document.createElement('button');
        deleteButton.id = "deleteClientBtn";
        deleteButton.innerText = "Delete Client";
        deleteButton.style.cssText = `
            background-color: #ff6666;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
        `;
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            showDeleteConfirmation(clientData);
        });
        formHeader.appendChild(deleteButton);
    }

    fullFormWrap.appendChild(formHeader);

    // Render Sections
    renderSection(fullFormWrap, "Client Contact Information", getContactFields(clientData));
    renderSection(fullFormWrap, "Account Controls", getAccountFields(clientData));
    renderSection(fullFormWrap, "Database Controls", getDatabaseFields(clientData));
    renderSection(fullFormWrap, "Database Translation Key", getTranslationFields(clientData));

    // Add Save/Update Button
    const formButton = document.createElement('button');
    formButton.id = 'formActionBtn';
    formButton.innerText = isNewClient ? 'Save' : 'Update';
    formButton.style.cssText = `
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 20px;
        margin-top: 20px;
        cursor: pointer;
    `;
    formButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleFormSubmit(clientData);
    });
    fullFormWrap.prepend(formButton);
}

// Render a section of the form
function renderSection(parent, title, fields) {
    if (!fields || fields.length === 0) {
        console.error(`No fields provided for section: ${title}`);
        return;
    }

    const sectionHeader = document.createElement('h5');
    sectionHeader.innerText = title;
    parent.appendChild(sectionHeader);

    const sectionDiv = document.createElement('div');
    sectionDiv.className = "formRow";

    fields.forEach(field => {
        const inputWrap = document.createElement('div');
        inputWrap.className = "inputWrap";

        const label = document.createElement('label');
        label.innerText = field.label;
        inputWrap.appendChild(label);

        if (field.type === "select") {
            const select = document.createElement('select');
            select.id = field.id;
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.innerText = option.charAt(0).toUpperCase() + option.slice(1);
                select.appendChild(opt);
            });
            select.value = field.value;
            inputWrap.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = field.type || "text";
            input.id = field.id;
            input.value = field.value || "";
            inputWrap.appendChild(input);
        }

        sectionDiv.appendChild(inputWrap);
    });

    parent.appendChild(sectionDiv);
}

export function handleFormSubmit(clientData) {
    const isNewClient = !clientData; // Determine if it's a new client
    const formData = gatherFormData(); // Collect form data

    if (isNewClient) formData.key = generateLicenseKey(); // Generate a key for new clients

    const url = isNewClient
        ? 'https://client-control.911-ens-services.com/clients'
        : `https://client-control.911-ens-services.com/clients/${clientData.id}`;

    const method = isNewClient ? 'POST' : 'PUT';

    console.log(`Submitting to ${url} with method ${method}`, formData); // Debugging

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            return response.json();
        })
        .then((result) => {
            console.log(`${isNewClient ? "Saved" : "Updated"} client successfully!`, result);

            // Extract the client data from the response
            const client = isNewClient ? result.data[0] : result;

            setCurrentClient(client); // Update the state with the new or updated client
            initializeApp(); // Reinitialize the app to refresh the dropdown

            // Select the new client in the dropdown (for a seamless experience)
            const clientSelect = document.getElementById('clientSelect');
            if (clientSelect) {
                clientSelect.value = client.id; // Select the newly saved client
            }

            // Render the form for the new or updated client
            renderForm(client); 
        })
        .catch(err => {
            console.error(`Error ${isNewClient ? "saving" : "updating"} client:`, err);
            alert(`Failed to ${isNewClient ? "save" : "update"} client. Check logs.`);
        });
}

// Field definitions for each section
function getContactFields(clientData) {
    return [
        { label: "Client Name:", id: "name", value: clientData?.name || "" },
        { label: "Client Address:", id: "address", value: clientData?.address || "" },
        { label: "City:", id: "city", value: clientData?.city || "" },
        { label: "State:", id: "state", value: clientData?.state || "" },
        { label: "Zip Code:", id: "zip", value: clientData?.zip || "" },
        { label: "Phone Number:", id: "phone_number", value: clientData?.phone_number || "" },
        { label: "Email:", id: "email", value: clientData?.email || "" },
        { label: "Website Address:", id: "website", value: clientData?.website || "" },
    ];
}

function getAccountFields(clientData) {
    return [
        { label: "Subscription Active?:", id: "active", type: "select", options: ["active", "inactive"], value: clientData?.active || "active" },
        { label: "Subscription Plan:", id: "plan", type: "select", options: ["bronze", "silver", "gold", "platinum"], value: clientData?.plan || "bronze" },
        { label: "Single/Split Display:", id: "display", type: "select", options: ["single", "header_split"], value: clientData?.display || "single" },
        { label: "NWS County Code:", id: "nws", value: clientData?.nws || "" },
    ];
}

function getDatabaseFields(clientData) {
    return [
        { label: "DBSync?:", id: "dbsync", type: "select", options: ["active", "inactive"], value: clientData?.dbsync || "active" },
        { label: "Raw DB Address:", id: "raw_server", value: clientData?.raw_server || "" },
        { label: "Raw DB User:", id: "raw_user", value: clientData?.raw_user || "" },
        { label: "Raw DB Pass:", id: "raw_pass", type: "password", value: clientData?.raw_pass || "" },
        { label: "Raw DB Table:", id: "raw_table", value: clientData?.raw_table || "" },
        { label: "Raw Table Name:", id: "raw_table_name", value: clientData?.raw_table_name || "" },
        { label: "DB Type:", id: "db_type", value: clientData?.db_type || "" },
        { label: "Translation DB Address:", id: "trans_db_loc", value: clientData?.trans_db_loc || "" },
    ];
}

function getTranslationFields(clientData) {
    return [
        { label: "Agency Type:", id: "agency_type", value: clientData?.agency_type || "" },
        { label: "Battalion:", id: "battalion", value: clientData?.battalion || "" },
        { label: "City:", id: "db_city", value: clientData?.db_city || "" },
        { label: "Jurisdiction:", id: "jurisdiction", value: clientData?.jurisdiction || "" },
        { label: "Latitude:", id: "latitude", value: clientData?.latitude || "" },
        { label: "Longitude:", id: "longitude", value: clientData?.longitude || "" },
        { label: "Incident ID:", id: "master_incident_id", value: clientData?.master_incident_id || "" },
        { label: "Premise:", id: "premise", value: clientData?.premise || "" },
        { label: "Priority:", id: "priority", value: clientData?.priority || "" },
        { label: "Sequencenumber:", id: "sequencenumber", value: clientData?.sequencenumber || "" },
        { label: "Stacked:", id: "stacked", value: clientData?.stacked || "" },
        { label: "State:", id: "db_state", value: clientData?.db_state || "" },
        { label: "Status:", id: "status", value: clientData?.status || "" },
        { label: "Status Date Time:", id: "statusdatetime", value: clientData?.statusdatetime || "" },
        { label: "Type:", id: "type", value: clientData?.type || "" },
        { label: "Type Description:", id: "type_description", value: clientData?.type_description || "" },
        { label: "Zone:", id: "zone", value: clientData?.zone || "" },
        { label: "Creation:", id: "creation", value: clientData?.creation || "" },
        { label: "Crossstreets:", id: "crossstreets", value: clientData?.crossstreets || "" },
        { label: "Entered Queue:", id: "entered_queue", value: clientData?.entered_queue || "" },
        { label: "ID:", id: "db_id", value: clientData?.db_id || "" },
        { label: "Location:", id: "location", value: clientData?.location || "" },
    ];
}

function showDeleteConfirmation(clientData) {
    const confirmationOverlay = document.createElement('div');
    confirmationOverlay.id = 'confirmationOverlay';
    confirmationOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const confirmationBox = document.createElement('div');
    confirmationBox.style.cssText = `
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    `;

    confirmationBox.innerHTML = `
        <p>Are you sure you want to delete this client? This action cannot be undone.</p>
        <button id="confirmDeleteBtn" style="background-color: #ff6666; color: white; border: none; padding: 10px 20px; margin: 10px; border-radius: 4px; cursor: pointer;">Yes</button>
        <button id="cancelDeleteBtn" style="background-color: #cccccc; color: black; border: none; padding: 10px 20px; margin: 10px; border-radius: 4px; cursor: pointer;">Cancel</button>
    `;

    confirmationOverlay.appendChild(confirmationBox);
    document.body.appendChild(confirmationOverlay);

    // Attach event listeners
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        deleteClient(clientData); // Proceed with deletion
        document.body.removeChild(confirmationOverlay); // Close confirmation
    });

    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        document.body.removeChild(confirmationOverlay); // Cancel deletion
    });
}

function deleteClient(clientData) {
    if (!clientData || !clientData.id) {
        console.error("No client selected for deletion.");
        return;
    }

    fetch(`https://client-control.911-ens-services.com/clients/${clientData.id}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to delete client: ${response.status}`);
            }
            return response.json();
        })
        .then(() => {
            alert(`Client "${clientData.name}" deleted successfully!`);
            resetForm(); // Reset the form
            initializeApp(); // Reinitialize app to refresh the dropdown and UI
        })
        .catch((err) => {
            console.error('Error deleting client:', err);
            alert('Failed to delete client. Please try again.');
        });
}
