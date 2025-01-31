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
    const logoutButton = document.querySelector('.logout-button');

    // Toggle menu open/close
    hamburger.addEventListener('click', () => {
        const isOpen = dropdownMenu.classList.toggle('open');
        hamburger.classList.toggle('open');

        if (isOpen) {
            console.log("Menu opened."); // Debug log

            // Wait for the menu animation to finish before showing items (3s)
            setTimeout(() => {
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible'); // Add fade-in effect
                    }, index * 500); // Staggered fade-in (200ms delay per item)
                });
            }, 2500); // Wait for menu animation (3 seconds)
        } else {
            console.log("Menu closed."); // Debug log
            menuItems.forEach((item) => {
                item.classList.remove('visible'); // Remove fade-in effect
            });
        }
    });

    logoutButton.addEventListener('click', handleLogout);

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const route = item.getAttribute('data-route');
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
