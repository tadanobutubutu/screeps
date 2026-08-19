// Main application logic
// ... existing code ...

// Fix: Replace fake link with proper button
// Before: <a id="unrotate" href="#">rotate back</a>
// After: <button id="unrotate">rotate back</button>

function createRotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.setAttribute('type', 'button');
  return button;
}

// Or if using innerHTML:
function getRotateButtonHTML() {
  return '<button id="unrotate" type="button">rotate back</button>';
}

// ... existing code ...