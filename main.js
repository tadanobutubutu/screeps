// Main JavaScript file

// Check if we're in a browser environment before adding DOM listeners
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    const unrotateBtn = document.getElementById('unrotate');

    // Adding a unique aria-label to the button for screen readers and keyboard navigation
    if (unrotateBtn) {
      unrotateBtn.setAttribute('aria-label', 'Rotate back');
    }

    // Rotate back functionality
    unrotateBtn.addEventListener('click', function() {
      document.body.style.transform = 'rotate(0deg)';
    });
  });
}

// Screeps main entry point
module.exports.loop = function () {
  // Main game loop logic goes here
  // This is a minimal valid main.js for syntax checking
};

// Update for React SVG accessible name issue
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Apple Icon</title><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>',
  favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 aria-label=%22Screeps Dashboard%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>'
};

module.exports.icons = icons;

// Node.js data fetching and rendering functionality
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

async function getData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await response.json();
  return data.slice(0, 10);
}

async function fetchData() {
  let data;
  try {
    data = await getData();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { success: false, error: error.message };
  }
}

async function render() {
  const result = await fetchData();
  
  if (result.success) {
    // Success state - use <main>
    return `
      <div id="root">
        <header>
          <h1>App</h1>
        </header>
        <main>
          <h2>Data</h2>
          <ul>
            ${result.data.map(item => `<li key=${item.id}>${item.title}</li>`).join('')}
          </ul>
        </main>
      </div>
    `;
  } else {
    // Error state - use <section> instead of <main> to avoid duplicate landmarks
    return `
      <div id="root">
        <header>
          <h1>App</h1>
        </header>
        <section>
          <h2>Error</h2>
          <p>${result.error}</p>
        </section>
      </div>
    `;
  }
}

module.exports.render = render;
module.exports.fetchData = fetchData;