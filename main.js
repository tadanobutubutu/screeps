// main.js
// Existing code preserved...

// Function to rotate element
function rotate(element, degrees) {
  element.style.transform = `rotate(${degrees}deg)`;
}

// Create the button element for "rotate back" action
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.type = 'button';
  button.setAttribute('aria-label', 'Rotate element back to original position');
  button.addEventListener('click', () => {
    const target = document.getElementById('rotatable');
    if (target) {
      rotate(target, 0);
    }
  });
  return button;
}

// Add ARIA landmark for better screen reader navigation
function addLandmark(role, elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('role', role);
    element.setAttribute('aria-label', `${role} content`);
  }
}

// Example usage
const container = document.getElementById('controls');
if (container) {
  container.appendChild(createUnrotateButton());
  // Add landmark for controls section
  addLandmark('region', 'controls');
}