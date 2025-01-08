export function renderForm(clientData = null) {
    const isNewClient = !clientData; // Determine if it's a new client
    const buttonLabel = isNewClient ? "Save" : "Update";

    const fullFormWrap = document.getElementById('fullForm');
    fullFormWrap.innerHTML = ""; // Clear previous content

    // Add Header
    const formLabel = document.createElement('h3');
    formLabel.innerText = isNewClient
        ? "New Client Form - License Key: Auto-generated"
        : `Data for: ${clientData.name} --- License Key: ${clientData.key}`;
    fullFormWrap.appendChild(formLabel);

    // SECTION 1: Client Contact Information
    addSectionHeader(fullFormWrap, "Client Contact Information");
    const contactFields = [
        { label: "Client Name:", id: "name", value: clientData?.name || "" },
        { label: "Client Address:", id: "address", value: clientData?.address || "" },
        { label: "City:", id: "city", value: clientData?.city || "" },
        { label: "State:", id: "state", value: clientData?.state || "" },
        { label: "Zip Code:", id: "zip", value: clientData?.zip || "" },
        { label: "Phone Number:", id: "phone_number", value: clientData?.phone_number || "" },
        { label: "Email:", id: "email", value: clientData?.email || "" },
        { label: "Website Address:", id: "website", value: clientData?.website || "" },
    ];
    createFormRow(fullFormWrap, contactFields);

    // SECTION 2: Account Controls
    addSectionHeader(fullFormWrap, "Account Controls");
    const accountFields = [
        { label: "Subscription Active?:", id: "active", type: "select", options: ["active", "inactive"], value: clientData?.active || "active" },
        { label: "Subscription Plan:", id: "plan", type: "select", options: ["bronze", "silver", "gold", "platinum"], value: clientData?.plan || "bronze" },
        { label: "NWS County Code:", id: "nws", value: clientData?.nws || "" },
    ];
    createFormRow(fullFormWrap, accountFields);

    // SECTION 3: Database Controls
    addSectionHeader(fullFormWrap, "Database Controls");
    const databaseFields = [
        { label: "DBSync?:", id: "dbsync", type: "select", options: ["active", "inactive"], value: clientData?.dbsync || "active" },
        { label: "Raw DB Address:", id: "raw_server", value: clientData?.raw_server || "" },
        { label: "Raw DB User:", id: "raw_user", value: clientData?.raw_user || "" },
        { label: "Raw DB Pass:", id: "raw_pass", type: "password", value: clientData?.raw_pass || "" },
        { label: "Raw DB Table:", id: "raw_table", value: clientData?.raw_table || "" },
        { label: "Raw Table Name:", id: "raw_table_name", value: clientData?.raw_table_name || "" },
        { label: "DB Type:", id: "db_type", value: clientData?.db_type || "" },
        { label: "Translation DB Address:", id: "trans_db_loc", value: clientData?.trans_db_loc || "" },
    ];
    createFormRow(fullFormWrap, databaseFields);

    // SECTION 4: Database Translation Key
    addSectionHeader(fullFormWrap, "Database Translation Key");
    const translationFields = [
        { label: "Agency Type:", id: "agency_type", value: clientData?.agency_type || "" },
        { label: "Battalion:", id: "battalion", value: clientData?.battalion || "" },
        { label: "City:", id: "db_city", value: clientData?.db_city || "" },
        { label: "Jurisdiction:", id: "jurisdiction", value: clientData?.jurisdiction || "" },
    ];
    createFormRow(fullFormWrap, translationFields);

    // Save/Update Button
    const button = document.createElement('button');
    button.id = "flexButton";
    button.innerText = buttonLabel;
    button.onclick = () => handleFormSubmit(clientData);
    fullFormWrap.appendChild(button);
}

// Helper Functions
function addSectionHeader(parent, title) {
    const header = document.createElement('h5');
    header.innerText = title;
    parent.appendChild(header);
}

function createFormRow(parent, fields) {
    const row = document.createElement('div');
    row.className = "formRow";
    parent.appendChild(row);

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
            input.value = field.value;
            inputWrap.appendChild(input);
        }

        row.appendChild(inputWrap);
    });
}

// Save or Update Client
export function handleFormSubmit(clientData) {
    const isNewClient = !clientData;

    // Gather form values
    const formData = {
        key: isNewClient ? generateLicenseKey() : clientData.key, // Generate new key for new clients
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
        : `https://client-control.911-ens-services.com/client/${clientData.id}`;

    fetch(url, {
        method: isNewClient ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(result => {
            console.log(`${isNewClient ? "Saved" : "Updated"} client:`, result);
            loadClients(); // Refresh list
        })
        .catch(err => console.error(`Error ${isNewClient ? "saving" : "updating"} client:`, err));
}

function generateLicenseKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
