// ... existing code above ...

// TODO: Implement createResourceButton

function createResourceButton(label, onClick, className = 'resource-button') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// ... rest of existing code below ...