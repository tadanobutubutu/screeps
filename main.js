// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

// Common utility functions that might have been exported previously
const VERSION = '1.0.0';

function hello() {
  return 'Hello from main!';
}

function goodbye(name) {
  return `Goodbye, ${name}!`;
}

function processData(data) {
  if (!data) return null;
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

// DOM-related code
const img = document.querySelector('img'); // Assuming img is selected from DOM
let rotation = 0;

function rotate() {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
    rotation = 0;
    img.style.transform = `rotate(0deg)`;
}

// New code to be added:
function toggleRotation() {
    rotation += rotation === 360 ? -360 : 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

// Function for adding proper landmark regions
function setupLandmarkRegions() {
    // Create landmark regions for accessibility
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.setAttribute('aria-label', 'Site header');
    
    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
    
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content');
    
    const aside = document.createElement('aside');
    aside.setAttribute('role', 'complementary');
    aside.setAttribute('aria-label', 'Complementary content');
    
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Site footer');
    
    // Append landmark regions to the document body
    document.body.appendChild(header);
    document.body.appendChild(nav);
    document.body.appendChild(main);
    document.body.appendChild(aside);
    document.body.appendChild(footer);
    
    return { header, nav, main, aside, footer };
}

// Attach event listeners
document.querySelector('.rotate-btn').addEventListener('click', rotate);
document.querySelector('.rotate-back-btn').addEventListener('click', rotateBack);
// New event listener for the toggle rotation functionality
document.querySelector('.toggle-rotation-btn').addEventListener('click', toggleRotation);

// Initialize landmark regions
setupLandmarkRegions();

// Export all functions and values
module.exports = {
  VERSION,
  hello,
  goodbye,
  processData,
  rotate,
  rotateBack,
  toggleRotation,
  setupLandmarkRegions
};