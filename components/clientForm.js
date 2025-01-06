export function renderClientForm(clientData = null) {
    const formHTML = `
        <form id="clientForm">
            <h3>${clientData ? `Edit Client: ${clientData.name}` : 'New Client Form'}</h3>
            <div>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" value="${clientData ? clientData.name : ''}" required />
            </div>
            <div>
                <label for="address">Address:</label>
                <input type="text" id="address" name="address" value="${clientData ? clientData.address : ''}" />
            </div>
            <button type="submit">${clientData ? 'Update' : 'Save'}</button>
        </form>
    `;
    const app = document.getElementById('app');
    app.innerHTML = formHTML;

    document.getElementById('clientForm').onsubmit = function (e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        clientData ? submitClientForm(data, clientData.id) : submitClientForm(data);
    };
}

function submitClientForm(data, clientId = null) {
    const method = clientId ? 'PUT' : 'POST';
    const url = clientId ? `/clients/${clientId}` : '/clients';
    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            console.log('Client saved:', result);
            loadClients();
        })
        .catch(err => console.error('Error saving client:', err));
}

export function fillForm(singleGrab) {
    const fullFormWrap = document.getElementById('fullForm');
    fullFormWrap.innerHTML = ""; // Clear any existing form content

    const formLabel = document.createElement('h3');
    fullFormWrap.appendChild(formLabel);
    formLabel.innerText = `Data for: ${singleGrab.name} --- License Key: ${singleGrab.key}`;

    // Client Contact Information
    const block1Title = document.createElement('h5');
    fullFormWrap.appendChild(block1Title);
    block1Title.innerText = "Client Contact Information";

    const block1 = document.createElement('div');
    fullFormWrap.appendChild(block1);
    block1.className = "formRow";

    // Input Fields for Contact Information
    const fields = [
        { label: "Client Name:", id: "name", type: "text", value: singleGrab.name },
        { label: "Client Address:", id: "address", type: "text", value: singleGrab.address },
        { label: "City:", id: "city", type: "text", value: singleGrab.city },
        { label: "State:", id: "state", type: "text", value: singleGrab.state },
        { label: "Zip Code:", id: "zip", type: "text", value: singleGrab.zip },
        { label: "Phone Number:", id: "phone", type: "text", value: singleGrab.phone_number },
        { label: "Email:", id: "email", type: "text", value: singleGrab.email },
        { label: "Website Address:", id: "website", type: "text", value: singleGrab.website }
    ];

    fields.forEach(field => {
        const inputWrap = document.createElement('div');
        block1.appendChild(inputWrap);
        inputWrap.className = "inputWrap";

        const label = document.createElement('label');
        inputWrap.appendChild(label);
        label.innerText = field.label;

        const input = document.createElement('input');
        inputWrap.appendChild(input);
        input.name = field.id;
        input.type = field.type;
        input.setAttribute('id', field.id);
        input.value = field.value || "";
    });

    // Account Controls
    const block2Title = document.createElement('h5');
    fullFormWrap.appendChild(block2Title);
    block2Title.innerText = "Account Controls";

    const block2 = document.createElement('div');
    fullFormWrap.appendChild(block2);
    block2.className = "formRow";

    // Dropdown Fields for Account Controls
    const dropdownFields = [
        {
            label: "Subscription Active?:",
            id: "active",
            options: ["active", "inactive"],
            value: singleGrab.active
        },
        {
            label: "Subscription Plan:",
            id: "plan",
            options: ["bronze", "silver", "gold", "platinum"],
            value: singleGrab.plan
        },
        {
            label: "NWS County Code:",
            id: "nws",
            type: "text",
            value: singleGrab.nws
        }
    ];

    dropdownFields.forEach(field => {
        const inputWrap = document.createElement('div');
        block2.appendChild(inputWrap);
        inputWrap.className = "inputWrap";

        const label = document.createElement('label');
        inputWrap.appendChild(label);
        label.innerText = field.label;

        if (field.options) {
            const select = document.createElement('select');
            inputWrap.appendChild(select);
            select.name = field.id;
            select.setAttribute('id', field.id);
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.innerText = option.charAt(0).toUpperCase() + option.slice(1);
                select.appendChild(opt);
            });
            select.value = field.value;
        } else {
            const input = document.createElement('input');
            inputWrap.appendChild(input);
            input.name = field.id;
            input.type = field.type;
            input.setAttribute('id', field.id);
            input.value = field.value || "";
        }
    });

    // Database Controls
    const block3Title = document.createElement('h5');
    fullFormWrap.appendChild(block3Title);
    block3Title.innerText = "Database Controls";

    const block3 = document.createElement('div');
    fullFormWrap.appendChild(block3);
    block3.className = "formRow";

    const dbFields = [
        { label: "DBSync?:", id: "dbsync", options: ["active", "inactive"], value: singleGrab.dbsync },
        { label: "Raw Data Base Address:", id: "rawDBAddress", type: "text", value: singleGrab.raw_server },
        { label: "Raw Data Base User:", id: "rawDBUser", type: "text", value: singleGrab.raw_user },
        { label: "Raw Data Base Pass:", id: "rawDBPass", type: "password", value: singleGrab.raw_pass },
        { label: "Raw Data Base:", id: "rawDBTable", type: "text", value: singleGrab.raw_table },
        { label: "Raw Table Name:", id: "rawDBTableName", type: "text", value: singleGrab.raw_table_name },
        { label: "Raw Data Base Type:", id: "rawDBType", type: "text", value: singleGrab.db_type },
        { label: "Translation Data Base Address:", id: "transDBAddress", type: "text", value: singleGrab.trans_db_loc }
    ];

    dbFields.forEach(field => {
        const inputWrap = document.createElement('div');
        block3.appendChild(inputWrap);
        inputWrap.className = "inputWrap";

        const label = document.createElement('label');
        inputWrap.appendChild(label);
        label.innerText = field.label;

        if (field.options) {
            const select = document.createElement('select');
            inputWrap.appendChild(select);
            select.name = field.id;
            select.setAttribute('id', field.id);
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.innerText = option.charAt(0).toUpperCase() + option.slice(1);
                select.appendChild(opt);
            });
            select.value = field.value;
        } else {
            const input = document.createElement('input');
            inputWrap.appendChild(input);
            input.name = field.id;
            input.type = field.type;
            input.setAttribute('id', field.id);
            input.value = field.value || "";
        }
    });

    // Database Translation Key
    const block4Title = document.createElement('h5');
    fullFormWrap.appendChild(block4Title);
    block4Title.innerText = "Database Translation Key";

    const block4 = document.createElement('div');
    fullFormWrap.appendChild(block4);
    block4.className = "formRow";

    const translationFields = [
        { label: "Agency Type:", id: "agencyType", type: "text", value: singleGrab.agency_type },
        { label: "Battalion:", id: "battalion", type: "text", value: singleGrab.battalion },
        { label: "City:", id: "dbCity", type: "text", value: singleGrab.db_city },
        { label: "Jurisdiction:", id: "jurisdiction", type: "text", value: singleGrab.jurisdiction }
    ];

    translationFields.forEach(field => {
        const inputWrap = document.createElement('div');
        block4.appendChild(inputWrap);
        inputWrap.className = "inputWrap";

        const label = document.createElement('label');
        inputWrap.appendChild(label);
        label.innerText = field.label;

        const input = document.createElement('input');
        inputWrap.appendChild(input);
        input.name = field.id;
        input.type = field.type;
        input.setAttribute('id', field.id);
        input.value = field.value || "";
    });
}
