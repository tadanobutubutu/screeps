// Function for creating in-page buttons
function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = options.type || 'button';
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.className) {
    button.className = options.className;
  }
  
  if (options.disabled) {
    button.disabled = true;
  }
  
  return button;
}

module.exports = { createInPageButton };