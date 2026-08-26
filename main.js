// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add any additional accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Function to add lang attribute to HTML element
export function addLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

// REACT_025: Additional accessibility improvements
export function initializeAccessibility() {
  // Set default language attribute
  addLangAttribute();
  
  // Prevent tab trapping outside of modals by managing focus
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close modal or release focus trap when Escape is pressed
      const modal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
      if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.dispatchEvent(new CustomEvent('modalclose', { bubbles: true }));
      }
    }
  });
  
  // Ensure skip link functionality if skip link exists
  const skipLink = document.querySelector('a[href^="#"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      const targetId = skipLink.getAttribute('href').slice(1);
      const target = document.getElementById(targetId) || document.querySelector('main, [role="main"]');
      if (target) {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

// Existing code preserved - add your app initialization below
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// root.render(<App />);