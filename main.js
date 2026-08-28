// Main application logic

document.addEventListener('DOMContentLoaded', () => {
  const unrotateBtn = document.getElementById('unrotate');
  
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Rotate back logic
      document.body.style.transform = 'rotate(0deg)';
      document.body.style.transition = 'transform 0.3s ease';
    });
  }
});

// Accessibility enhancements
function focusOnFirstElement() {
  const firstFocusableElement = document.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }
}

function addAriaRoleToNavigation() {
  const navigation = document.querySelector('nav');
  if (navigation) {
    navigation.setAttribute('role', 'navigation');
  }
}

// Call the accessibility functions on document ready
focusOnFirstElement();
addAriaRoleToNavigation();

// Export any existing functions
export function someExistingFunction() {
  // Existing functionality
}

export function anotherFunction() {
  // More existing functionality
}