const BASE_URL = 'https://client-control.911-ens-services.com';

async function fetchData(endpoint, options = {}) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (err) {
        console.error('API error:', err);
        throw err;
    }
}

function getClients() {
    return fetchData('/clients');
}

function getClientDetails(clientId) {
    return fetchData(`/client/${clientId}`);
}

function saveClient(data, clientId = null) {
    const endpoint = clientId ? `/clients/${clientId}` : '/clients';
    const method = clientId ? 'PUT' : 'POST';
    return fetchData(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

function addUser(data) {
    return fetchData('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}
