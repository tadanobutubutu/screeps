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

// New function to ensure only one main element exists in the DOM
function ensureSingleMainElement() {
  const mainElements = document.getElementsByTagName('main');
  if (mainElements.length > 1) {
    // Keep the first main element and remove others
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].remove();
    }
  }
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', ensureSingleMainElement);