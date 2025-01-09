// Collect all input fields' data from the form
export function gatherFormData() {
    const formData = {};
    document.querySelectorAll("#fullForm input, #fullForm select").forEach(input => {
        formData[input.id] = input.value;
    });
    return formData;
}

// Generate a random license key for new clients
export function generateLicenseKey() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
