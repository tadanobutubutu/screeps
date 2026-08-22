import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

// Existing exports and functions must stay unchanged
export const initApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
};

// ---------------------------------------------------
// Accessibility improvements (issue: Address accessibility issues from insight report)
// Line 75 originally contained a TODO comment – we replace it with concrete ARIA/labelling changes.
// ---------------------------------------------------

// Example scenario: a button inside the component needed better accessibility.
// The original code (line 75) was a TODO placeholder; now we add proper ARIA attributes.
// The surrounding markup is assumed to exist elsewhere; we only inject the ARIA enhancements.

// Assume we have a reference to the container that holds the interactive elements.
const container = document.querySelector('#interactive-container');

// If the container exists, ensure all focusable elements have appropriate ARIA roles/labels.
if (container) {
  // Find all buttons within the container and enhance them.
  const buttons = container.querySelectorAll('button');
  buttons.forEach((btn) => {
    // Ensure each button has a clear, descriptive label.
    const ariaLabel = btn.getAttribute('aria-label');
    if (!ariaLabel) {
      const buttonText = btn.textContent.trim();
      btn.setAttribute('aria-label', `Activate ${buttonText}`);
    }
    // Ensure buttons are focusable via keyboard (tab index is naturally set for buttons, but we enforce role).
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0'); // Explicitly set tabindex for any custom button-like elements.
  });

  // Example: add keyboard shortcuts for better navigation.
  document.addEventListener('keydown', (e) => {
    // If the user presses "Enter" while focus is on a submit button, trigger its click.
    const focused = document.activeElement;
    if (focused.matches('button[type="submit"]') && e.key === 'Enter') {
      focused.click();
      e.preventDefault();
    }
  });
}

// Existing component rendering logic remains unchanged.
const appContainer = document.getElementById('root');
if (appContainer) {
  const app = React.createElement(App);
  ReactDOM.render(app, appContainer);
}

// Export any necessary utilities or hooks (no changes needed).
export default {
  initApp,
};