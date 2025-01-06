function renderUserForm(clientId) {
    const formHTML = `
        <form id="userForm">
            <h3>Add User for Client</h3>
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required />
            </div>
            <div>
                <label for="role">Role:</label>
                <select id="role" name="role">
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                </select>
            </div>
            <button type="submit">Add User</button>
        </form>
    `;
    const app = document.getElementById('app');
    app.insertAdjacentHTML('beforeend', formHTML);

    document.getElementById('userForm').onsubmit = function (e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        data.clientId = clientId;
        submitUserForm(data);
    };
}

function submitUserForm(data) {
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(result => {
            console.log('User added:', result);
        })
        .catch(err => console.error('Error adding user:', err));
}
