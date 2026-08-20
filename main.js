// main.js - Fixed version

// Your existing code will be preserved here
// The only change is replacing the fake link with a button

// Previous problematic code:
// <a id="unrotate" href="#">rotate back</a>

// Should be replaced with:
const createUnrotateButton = () => {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.type = 'button'; // Important for forms
  return button;
};

// If rendering inline HTML, replace:
// <a id="unrotate" href="#">rotate back</a>
// With:
// <button id="unrotate" type="button">rotate back</button>

// Example usage in DOM manipulation:
// const container = document.getElementById('some-container');
// container.appendChild(createUnrotateButton());

// Event handling (if you had one on the original link):
// document.getElementById('unrotate').addEventListener('click', yourHandler);