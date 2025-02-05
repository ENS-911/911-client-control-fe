import { handleLogout } from '../main.js';
import { navigateTo } from './router.js';

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
                        <li class="menu-item" data-route="">Home</li>
                        <li class="menu-item" data-route="add-edit-client">Add/Edit Client</li>
                        <li class="menu-item" data-route="add-edit-user">Add/Edit User</li>
                        <li class="menu-item logout-button" data-route="logout">Logout</li>
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
            console.log("Menu opened.");

            // Wait for menu to fully open before fading in links
            setTimeout(() => {
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, index * 450);
                });
            }, 2000); // Adjust timing based on CSS transition duration
        } else {
            console.log("Menu closed.");
            menuItems.forEach((item) => {
                item.classList.remove('visible'); // Hide menu items instantly when menu closes
            });
        }
    });

    // Attach event listeners to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const route = item.getAttribute('data-route');

            console.log(`Clicked menu item with route: ${route}`);

            if (!route && route !== '') {
                console.error("Error: No route found for clicked menu item.");
                return;
            }

            // Close menu when a link is clicked
            dropdownMenu.classList.remove('open');
            hamburger.classList.remove('open');
            menuItems.forEach((item) => item.classList.remove('visible')); // Hide links instantly

            if (route === 'logout') {
                handleLogout();
            } else {
                navigateTo(route);
            }
        });
    });

    function updateMenuVisibility() {
        if (window.location.hash === '#login') {
            dropdownMenu.style.display = 'none';
            hamburger.style.display = 'none';
        } else {
            dropdownMenu.style.display = 'block';
            hamburger.style.display = 'flex';
        }
    }

    window.addEventListener('hashchange', updateMenuVisibility);
    updateMenuVisibility();
}
