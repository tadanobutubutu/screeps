// Make sure to include 'js-cookie' if it is a dependency
import jsCookies from 'js-cookie';

// ... Existing code, imports, and functions ...

// Function to add role="button" to the element for better accessibility
function makeButtonAccessible(element) {
  if (element.tagName.toLowerCase() === 'button') {
    // No need to make buttons more accessible since they already have a role
    return;
  }

  element.setAttribute('role', 'button'); // Add role="button" for improved accessibility
  element.addEventListener('focus', function () {
    // Add 'focus' state class for visual focus indication
    element.classList.add('focus');
  });
  element.addEventListener('blur', function () {
    // Remove 'focus' state class when the clickable area is no longer focused
    element.classList.remove('focus');
  });
}

// Function to add ARIA attributes to table headers for better accessibility
function makeTableHeaderAccessible(headers) {
  headers.forEach((header) => {
    if (header.tagName.toLowerCase() === 'th') {
      header.setAttribute('aria-sort', 'none'); // Adds default sorting behavior
    }
  });
}

// Function to make elements focusable
function makeFocusable(elements) {
  elements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', 0); // Set tabindex to 0 for focusable elements
    }
  });
}

// ... Existing code, exports, and functions ...

// Here, you might want to call the new functions if your insight report recommended it:

// Make sure to call 'makeButtonAccessible' and 'makeTableHeaderAccessible' for all relevant elements
// ...

// Make sure to call 'makeFocusable' for all clickable elements that require focus (like buttons, menu items, etc.)
// ...

// Don't forget to save cookies on focus and restore them on blur for improved accessibility
document.addEventListener('focus', () => {
  jsCookies.set('lastFocusedElement', document.activeElement.id);
});
document.addEventListener('blur', () => {
  const lastFocusedElementId = jsCookies.get('lastFocusedElement');
  if (lastFocusedElementId) {
    const lastFocusedElement = document.getElementById(lastFocusedElementId);
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
});