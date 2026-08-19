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
  button.addEventListener('click', () => {
    const target = document.getElementById('rotatable');
    if (target) {
      rotate(target, 0);
    }
  });
  return button;
}

// Example usage
const container = document.getElementById('controls');
if (container) {
  container.appendChild(createUnrotateButton());
}

// Add main landmark to HTML structure
document.addEventListener('DOMContentLoaded', () => {
  const mainElement = document.createElement('main');
  const body = document.body;
  const children = Array.from(body.children);

  // Move all existing content into the main element
  children.forEach(child => {
    if (child.id !== 'main') { // Skip if already a main element
      mainElement.appendChild(child);
    }
  });

  body.appendChild(mainElement);
});