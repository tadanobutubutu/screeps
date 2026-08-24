// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  // Rotate functionality
  const rotateButton = document.getElementById('rotate');
  const unrotateButton = document.getElementById('unrotate');
  const targetElement = document.getElementById('target');

  if (rotateButton) {
    rotateButton.addEventListener('click', function() {
      targetElement.style.transform = 'rotate(90deg)';
    });
  }

  if (unrotateButton) {
    unrotateButton.addEventListener('click', function() {
      targetElement.style.transform = 'rotate(0deg)';
    });
  }
});

// Export functions for testing
export function rotate(element) {
  if (element) {
    element.style.transform = 'rotate(90deg)';
  }
}

export function unrotate(element) {
  if (element) {
    element.style.transform = 'rotate(0deg)';
  }
}