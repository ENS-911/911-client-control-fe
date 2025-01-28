export function renderHeader(navigateTo) {
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
                        <li class="menu-item home">Home</li>
                        <li class="menu-item add-edit-client">Add/Edit Client</li>
                        <li class="menu-item add-edit-user">Add/Edit User</li>
                        <li class="menu-item logout-button">Logout</li>
                    </ul>
                </nav>
            </div>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    const hamburger = document.getElementById('hamburger');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const menuItems = document.querySelectorAll('.menu-item');

    // Toggle menu open/close
    hamburger.addEventListener('click', () => {
        const isOpen = dropdownMenu.classList.toggle('open');
        hamburger.classList.toggle('open');

        if (isOpen) {
            // Wait for the menu opening animation before fading in items
            setTimeout(() => {
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 350); // Staggered fade-in (200ms delay per item)
                });
            }, 2000); // Match this timeout to the dropdown menu animation duration
        } else {
            // Immediately remove visibility when menu is closed
            menuItems.forEach((item) => {
                item.classList.remove('visible');
            });
        }
    });

    // Close the menu when a link is clicked
    menuItems.forEach((item) => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('open'); // Remove the 'open' class from the hamburger
            dropdownMenu.classList.remove('open'); // Remove the 'open' class from the dropdown

            // Immediately remove the visible class for menu items
            menuItems.forEach((menuItem) => {
                menuItem.classList.remove('visible');
            });
        });
    });

    // Attach menu navigation
    document.querySelector('.menu-item.home').addEventListener('click', () => navigateTo(''));
    document.querySelector('.menu-item.add-edit-client').addEventListener('click', () => navigateTo('add-edit-client'));
    document.querySelector('.menu-item.add-edit-user').addEventListener('click', () => navigateTo('add-edit-user'));
    document.querySelector('.menu-item.logout-button').addEventListener('click', () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    });
}
