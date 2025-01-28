export function renderHome() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h2>Welcome to the Consolidated Client Control Center</h2>
            <p>Select an option from the menu to get started.</p>
        </div>
    `;
}