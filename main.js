import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code

// Add the function for making elements focusable
function makeFocusable(elements) {
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    if (element.hasAttribute('aria-hidden')) {
      element.removeAttribute('aria-hidden');
      element.setAttribute('tabIndex', 0);
      element.focus();
    }
  }
}

// Add the function for focusing on the first focusable element in the container
function focusFirstFocusable(container) {
  let elements = Array.from(container.getElementsByTagName('*'));
  makeFocusable(elements);
  let firstFocusableElement = elements.find(element => element.tabIndex >= 0);
  if (firstFocusableElement) {
    firstFocusableElement.focus();
  }
}

// Make sure to call the function on page load
document.addEventListener('DOMContentLoaded', () => {
  focusFirstFocusable(document.body);
});

// Existing code

// Continue with the rest of your existing code, exports, and functions.