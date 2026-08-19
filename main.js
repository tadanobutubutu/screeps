// main.js

// Handle rotate button click
document.getElementById('rotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    content.style.transform = 'rotate(90deg)';
});

// Handle unrotate button click (using button element for accessibility)
document.getElementById('unrotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    content.style.transform = 'rotate(0deg)';
});

// Sample content
const content = document.getElementById('content');
if (content) {
    content.innerHTML = `
        <main>
            <h1>Welcome to the App</h1>
            <p>Click the rotate button to rotate the content.</p>
            <button id="rotate">Rotate</button>
            <button id="unrotate">rotate back</button>
        </main>
    `;
}

function getPendingUpdates() {
  return [
    { package: 'eslint', version: '^10.0.0' },
    { package: 'jest', version: '^30.0.0' },
    { package: 'typescript', version: '^7.0.0' },
    { package: 'react', version: '^19.0.0' ],
  ];
}
module.exports = { getPendingUpdates };