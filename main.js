// ... (preserve all existing code from current main.js)

// Add this new function to handle the rotation back action
function handleRotateBack() {
  // Implement the rotation back logic here
  // For example:
  document.getElementById('dependency-graph').style.transform = 'rotate(0deg)';
}

// Replace the fake link with a proper button
document.addEventListener('DOMContentLoaded', () => {
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.addEventListener('click', handleRotateBack);
    rotateBackLink.parentNode.replaceChild(button, rotateBackLink);
  }
});

// ... (preserve all existing exports and functions from current main.js)