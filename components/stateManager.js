const state = {
    currentClient: null, // Holds the currently selected client
    currentUser: null, // Holds the currently selected user
};

// === CLIENT STATE MANAGEMENT ===
export function setCurrentClient(client) {
    state.currentClient = client;
}

export function getCurrentClient() {
    return state.currentClient;
}

export function resetCurrentClient() {
    state.currentClient = null;
}

// === USER STATE MANAGEMENT ===
export function setCurrentUser(user) {
    state.currentUser = user;
}

export function getCurrentUser() {
    return state.currentUser;
}

export function resetCurrentUser() {
    state.currentUser = null;
}
