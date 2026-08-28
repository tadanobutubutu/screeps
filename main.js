// main.js
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  document.body.appendChild(button);
  return button;
}

// TODO: Implement this function for creating in-page buttons
// (Ensure this function is properly initialized/assigned if needed)