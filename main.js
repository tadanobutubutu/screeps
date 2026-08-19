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

// Function to fix table headers in dependency graph
function fixTableHeaders() {
    // This function would be called when the dependency graph is loaded
    // It would add scope attributes to all table headers
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            if (!header.hasAttribute('scope')) {
                // Determine if this is a column or row header based on context
                // For this example, we'll assume all are column headers
                header.setAttribute('scope', 'col');
            }
        });
    });
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fixTableHeaders);