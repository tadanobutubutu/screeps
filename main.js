import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

// Add the following function to handle the table header scope attributes
function updateTableHeaders() {
  // This function would be called after the DOM is loaded
  // to add scope attributes to table headers
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Default to 'col' scope for most headers
      header.setAttribute('scope', 'col');
      // Special cases for row headers if needed
      if (header.textContent.includes('src/')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Add function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    if (link.id === 'unrotate') {
      const button = document.createElement('button');
      button.id = link.id;
      button.textContent = link.textContent;
      button.className = link.className;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        // Add your rotation logic here
        console.log('Rotation triggered');
      });
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Add this function to ensure only one main element exists
function ensureSingleMainElement() {
  // Check if there are multiple main elements
  const mainElements = document.getElementsByTagName('main');
  if (mainElements.length > 1) {
    // Keep the first main element and remove others
    for (let i = 1; i < mainElements.length; i++) {
      const parent = mainElements[i].parentNode;
      const wrapper = document.createElement('section');
      // Copy all attributes from the main element to the section
      Array.from(mainElements[i].attributes).forEach(attr => {
        wrapper.setAttribute(attr.name, attr.value);
      });
      // Move all children to the wrapper
      while (mainElements[i].firstChild) {
        wrapper.appendChild(mainElements[i].firstChild);
      }
      // Replace the main element with the section
      parent.replaceChild(wrapper, mainElements[i]);
    }
  }
}

// Add this function to ensure all content is wrapped in a main element
function ensureMainLandmark() {
  // Check if there's already a main element
  if (document.querySelector('main')) {
    return;
  }

  // Find the main content container
  const content = document.querySelector('.container') ||
                 document.querySelector('table') ||
                 document.querySelector('body > *:not(script):not(style):not(link)');

  if (content) {
    // Create a main element
    const main = document.createElement('main');

    // Move all content to the main element
    while (content.firstChild) {
      main.appendChild(content.firstChild);
    }

    // Replace the content with the main element
    content.parentNode.replaceChild(main, content);
  }
}

// Run accessibility enhancements after React hydration
function runAccessibilityEnhancements() {
  updateTableHeaders();
  replaceFakeLinks();
  ensureSingleMainElement();
  ensureMainLandmark();
}

// Set document language and hydrate React app
document.documentElement.setAttribute('lang', 'en');
hydrateRoot(
  document.documentElement,
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Run accessibility enhancements after hydration completes
if (typeof document !== 'undefined') {
  // Use setTimeout to run after React hydration and browser paint
  setTimeout(runAccessibilityEnhancements, 0);
}