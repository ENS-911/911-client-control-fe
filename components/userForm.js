export function renderUserForm(user = null) {
    const fullFormWrap = document.getElementById('fullForm');

    if (!fullFormWrap) {
        console.error('fullForm element not found!');
        return;
    }

    fullFormWrap.innerHTML = `
        <div class="user-form">
            <h3>${user ? 'Edit User' : 'Add New User'}</h3>
            <form id="userForm">
                <label for="userName">Full Name:</label>
                <input type="text" id="userName" name="userName" value="${user ? user.name : ''}" required>

                <label for="userEmail">Email:</label>
                <input type="email" id="userEmail" name="userEmail" value="${user ? user.email : ''}" required>

                <label for="userRole">Role:</label>
                <select id="userRole" name="userRole" required>
                    <option value="User" ${user && user.role === 'User' ? 'selected' : ''}>User</option>
                    <option value="Admin" ${user && user.role === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="Super Admin" ${user && user.role === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
                    <option value="ENS Admin" ${user && user.role === 'ENS Admin' ? 'selected' : ''}>ENS Admin</option>
                </select>

                <button type="submit">${user ? 'Update User' : 'Create User'}</button>
            </form>
        </div>
    `;

    document.getElementById('userForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            role: document.getElementById('userRole').value
        };

        if (user) {
            console.log('Updating user:', formData);
            updateUser(user.id, formData);
        } else {
            console.log('Creating new user:', formData);
            createUser(formData);
        }
    });
}

async function createUser(userData) {
    try {
        const response = await fetch('https://client-control.911-ens-services.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        console.log('User created:', result);
        alert('User created successfully!');
    } catch (err) {
        console.error('Error creating user:', err);
    }
}

async function updateUser(userId, userData) {
    try {
        const response = await fetch(`https://client-control.911-ens-services.com/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const result = await response.json();
        console.log('User updated:', result);
        alert('User updated successfully!');
    } catch (err) {
        console.error('Error updating user:', err);
    }
}
