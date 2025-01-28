export function renderHeader() {
    const headerHTML = `
        <header class="header">
            <img src="../img/enslogo.png" alt="ENS Logo" class="logo" />
            <h1>Consolidated Client Control Center</h1>
            <div id="menu-container" class="menu-container">
                <div id="hamburger" class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <nav id="dropdown-menu" class="dropdown-menu">
                    <ul>
                        <li class="menu-item">Home</li>
                        <li class="menu-item">Add/Edit Client</li>
                        <li class="menu-item">Add/Edit User</li>
                        <li class="menu-item logout-button">Logout</li>
                    </ul>
                </nav>
            </div>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // Get DOM elements
    const hamburger = document.getElementById('hamburger');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuItems = document.querySelectorAll('.menu-item');

    hamburger.addEventListener('click', () => {
        const isOpen = dropdownMenu.classList.toggle('open');
        hamburger.classList.toggle('open');

        if (isOpen) {
            // Wait for the menu animation to finish, then fade in items
            setTimeout(() => {
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 300); // Stagger the fade-in effect by 300ms for each item
                });
            }, 2000); // Match the menu open animation duration
        } else {
            // Immediately hide items when closing
            menuItems.forEach((item) => {
                item.classList.remove('visible');
            });
        }
    });

    // Logout functionality
    const logoutButton = document.querySelector('.logout-button');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    });
}
