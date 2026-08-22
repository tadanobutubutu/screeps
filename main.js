// main.js - Fixed REACT_036: Replaced fake link with button
const createApp = () => {
  const container = document.getElementById('app');
  
  // Create the rotate back button (previously was an anchor with href="#")
  const rotateButton = document.createElement('button');
  rotateButton.id = 'unrotate';
  rotateButton.type = 'button';
  rotateButton.textContent = 'rotate back';
  
  container.appendChild(rotateButton);
  
  // Add click handler
  rotateButton.addEventListener('click', () => {
    // rotation logic here
  });
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createApp };
}