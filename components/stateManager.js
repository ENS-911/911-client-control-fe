const state = {
    currentClient: null, // Holds the currently selected client
};

export function setCurrentClient(client) {
    state.currentClient = client;
}

export function getCurrentClient() {
    return state.currentClient;
}

export function resetCurrentClient() {
    state.currentClient = null;
}
