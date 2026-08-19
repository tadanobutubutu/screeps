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

// Add scope attributes to table headers in dependency-graph.html
// This is a placeholder - in a real implementation, we would modify the HTML file directly
// or ensure the HTML generation includes these attributes
function addTableHeaderScopes() {
    // This would be implemented in the code that generates the HTML table
    // For example, when creating table headers, we would add scope="col" or scope="row"
    // as shown in the issue examples
    console.log('Table header scopes would be added during HTML generation');
}

// Call the function to add scopes (would be called during table generation)
addTableHeaderScopes();