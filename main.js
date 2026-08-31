import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Function to get the language attribute value
function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement ? htmlElement.lang || 'en' : 'en';
}

// Function to create an in-page button and add the lang attribute
function createInPageButton() {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    const lang = getLangAttribute();
    htmlElement.setAttribute('lang', lang);
  }

  const inPageButton = document.createElement('button');
  inPageButton.textContent = 'Skip to main content';
  inPageButton.id = 'skip-link';
  inPageButton.style.position = 'absolute';
  inPageButton.style.top = '-9999px';
  inPageButton.style.left = '-9999px';
  inPageButton.style.zIndex = '10000';
  
  inPageButton.addEventListener('click', function(e) {
    const mainContent = document.querySelector('main, [role="main"]') || document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
    }
  });

  inPageButton.addEventListener('focus', function() {
    inPageButton.style.top = '10px';
    inPageButton.style.left = '10px';
  });

  inPageButton.addEventListener('blur', function() {
    inPageButton.style.top = '-9999px';
    inPageButton.style.left = '-9999px';
  });

  document.body.insertBefore(inPageButton, document.body.firstChild);
}

// Uncomment the implementation of the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Initialize skip link functionality
  const skipLink = document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', function(e) {
      const targetId = skipLink.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }

  // Ensure all buttons with role="button" respond to Enter key
  const buttonRoleElements = document.querySelectorAll('[role="button"]');
  buttonRoleElements.forEach(function(element) {
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focusVisible polyfill behavior
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-focus');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-focus');
  });

  // Modal/dialog announcement
  const modal = document.getElementById('modal'); // Assuming a modal/dialog element with the ID "modal"
  if (modal) {
    a11y.announce('Welcome to the bot!', 'assertive'); // Assuming announce function from a11y utilities
  }

  // Adding an alt attribute to an image
  const imageElements = document.querySelectorAll('img:not([alt])');
  imageElements.forEach(function(imageElement) {
    if (imageElement) {
      imageElement.setAttribute('alt', 'A description of the image');
    }
  });

  // Correcting the ARIA role for a div
  const divElements = document.querySelectorAll('div[role=""]');
  divElements.forEach(function(divElement) {
    if (divElement) {
      divElement.setAttribute('role', 'list');
    }
  });

  // Adding the lang attribute to the HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

export {
  addressAccessibilityIssues,
  a11y,
  getLangAttribute,
  createInPageButton
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

addressAccessibilityIssues(); // Call the function to address accessibility issues
createInPageButton();
reportWebVitals();