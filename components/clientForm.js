import { gatherFormData, generateLicenseKey } from './helpers.js';
import { setCurrentClient, getCurrentClient } from './stateManager.js';
import { initializeApp } from './clientSelector.js';

export function renderForm(clientData = null) {
    const isNewClient = !clientData;
    const fullFormWrap = document.getElementById('fullForm');
    fullFormWrap.innerHTML = ""; // Clear previous form content

    // Add Header
    const formLabel = document.createElement('h3');
    formLabel.innerText = isNewClient
        ? "New Client Form - License Key: Auto-generated"
        : `Data for: ${clientData.name} --- License Key: ${clientData.key}`;
    fullFormWrap.appendChild(formLabel);

    // Render sections
    renderSection(fullFormWrap, "Client Contact Information", getContactFields(clientData));
    renderSection(fullFormWrap, "Account Controls", getAccountFields(clientData));
    renderSection(fullFormWrap, "Database Controls", getDatabaseFields(clientData));
    renderSection(fullFormWrap, "Database Translation Key", getTranslationFields(clientData));
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

export function handleFormSubmit() {
    const currentClient = getCurrentClient(); // Retrieve the current client
    const isNewClient = !currentClient; // Determine if this is a new client
    const formData = gatherFormData(); // Collect form data from the form

    // Generate a license key for new clients
    if (isNewClient) formData.key = generateLicenseKey();

    const url = isNewClient
        ? 'https://client-control.911-ens-services.com/clients'
        : `https://client-control.911-ens-services.com/clients/${currentClient.id}`;

    const method = isNewClient ? 'POST' : 'PUT';

    console.log(`Submitting ${isNewClient ? 'new' : 'existing'} client data:`, formData);

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            alert(`${isNewClient ? "Saved" : "Updated"} client successfully!`);

            if (!isNewClient) {
                // Update the current client state after a successful update
                setCurrentClient(result);
            }

            initializeApp(); // Reinitialize the app to reflect changes
        })
        .catch(err => {
            console.error(`Error ${isNewClient ? "saving" : "updating"} client:`, err);
            alert(`Failed to ${isNewClient ? "save" : "update"} client.`);
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
