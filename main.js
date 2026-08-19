// main.js - Updated to fix REACT_027 accessibility warning

// Initialize rotation state
let isRotated = false;

// Handle rotate button click
document.getElementById('rotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    if (isRotated) {
        content.style.transform = 'rotate(0deg)';
        isRotated = false;
    } else {
        content.style.transform = 'rotate(90deg)';
        isRotated = true;
    }
});

// Handle unrotate button click (using button element for accessibility)
document.getElementById('unrotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    content.style.transform = 'rotate(0deg)';
    isRotated = false;
});

// Sample content
const content = document.getElementById('content');
if (content) {
    content.innerHTML = `
        <h1>Welcome to the App</h1>
        <p>Click the rotate button to rotate the content.</p>
        <button id="rotate">Rotate</button>
        <button id="unrotate">rotate back</button>
    `;
}

// Function to update table headers with scope attributes
function updateTableHeaders() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            if (!header.hasAttribute('scope')) {
                // Determine if this is a column or row header based on position
                const rowIndex = header.parentElement.rowIndex;
                const cellIndex = header.cellIndex;

                // If it's in the first row, it's likely a column header
                if (rowIndex === 0) {
                    header.setAttribute('scope', 'col');
                }
                // If it's in the first column, it's likely a row header
                else if (cellIndex === 0) {
                    header.setAttribute('scope', 'row');
                }
                // Default to column header if position is unclear
                else {
                    header.setAttribute('scope', 'col');
                }
            }
        });
    });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateTableHeaders);