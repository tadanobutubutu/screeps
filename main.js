// main.js

// ... existing code ...

// New function to check for link and button accessibility
function checkAccessibility() {
  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');
  
  links.forEach(link => {
    if (link.getAttribute('aria-label') === null) {
      console.warn('Accessibility issue: Link lacks aria-label attribute.');
    }
    if (!link.hasAttribute('role')) {
      console.warn('Accessibility issue: Link lacks role attribute.');
    }
  });

  buttons.forEach(button => {
    if (button.getAttribute('aria-label') === null) {
      console.warn('Accessibility issue: Button lacks aria-label attribute.');
    }
    if (!button.hasAttribute('role')) {
      console.warn('Accessibility issue: Button lacks role attribute.');
    }
  });
}

// ... existing code ...

// You can call this function at a point where you want to check accessibility
// For example, on a certain event or when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', checkAccessibility);

// ... existing code ...