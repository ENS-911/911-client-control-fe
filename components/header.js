export function renderHeader() {
    const headerHTML = `
        <header>
            <img src="https://portal.911emergensee.com/img/Group127.jpg" />
            <h1>Consolidated Client Control Center</h1>
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

