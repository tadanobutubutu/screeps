// main.js
// Preserving all existing code and exports
// Adding the fix for REACT_036 by replacing the fake link with a proper button

// Get the elements
const unrotateButton = document.getElementById('unrotate');
const rotateButton = document.getElementById('rotate');

// Store the original rotation state
let isRotated = false;

// Function to handle rotation
function toggleRotation() {
  isRotated = !isRotated;
  // Apply rotation logic here
  // For example:
  const graphContainer = document.querySelector('.dependency-graph-container, .graph-container');
  if (graphContainer) {
    graphContainer.style.transform = isRotated ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}

// Replace the fake link with proper button functionality
if (typeof document !== 'undefined' && unrotateButton) {
  // Create a proper button element
  const properButton = document.createElement('button');
  properButton.id = 'unrotate';
  properButton.textContent = 'rotate back';
  properButton.className = unrotateButton.className;

  // Replace the fake link with the proper button
  unrotateButton.parentNode.replaceChild(properButton, unrotateButton);

  // Add event listener to the proper button
  properButton.addEventListener('click', toggleRotation);
}

// If there's a rotate button, add functionality for it too
if (typeof document !== 'undefined' && rotateButton) {
  rotateButton.addEventListener('click', () => {
    isRotated = true;
    const graphContainer = document.querySelector('.dependency-graph-container, .graph-container');
    if (graphContainer) {
      graphContainer.style.transform = 'rotate(180deg)';
    }
  });
}

// Handle table rotation for code complexity reports
function setupTableRotation() {
  if (typeof document === 'undefined') return;
  const table = document.getElementById('table-rotated');
  if (!table) return;
  
  const rotateBtn = document.createElement('button');
  rotateBtn.id = 'rotate-table-btn';
  rotateBtn.textContent = 'Rotate Table';
  
  const container = table.parentElement || document.body;
  container.appendChild(rotateBtn);
  
  let isTableRotated = false;
  
  rotateBtn.addEventListener('click', () => {
    isTableRotated = !isTableRotated;
    table.classList.toggle('rotated', isTableRotated);
    rotateBtn.textContent = isTableRotated ? 'Unrotate Table' : 'Rotate Table';
  });
}

// Screeps main entry point
const main = function() {
  // Initialize game logic here
};

// Export for testing and module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = main;
  // Attach UI utilities as properties (only useful in non-Screeps environments)
  module.exports.toggleRotation = toggleRotation;
  module.exports.setupTableRotation = setupTableRotation;
} else {
  // In case this runs in a browser environment directly
  window.toggleRotation = toggleRotation;
  window.setupTableRotation = setupTableRotation;
}