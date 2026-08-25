// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] Wrap the primary content in <main> so it can be skipped to (DONE: wrapPrimaryContentInMain)
// - [NEW] Add your code here if any other issues need to be addressed

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Adjust the path to the actual App component

// Import dependencyGraphContent if it is used in the code
const { dependencyGraphContent } = require('./dependencyGraph');

// Accessibility utility functions - exported for use in React components via useEffect
export function addLangAttribute() {
  const html = document.documentElement;
  html.setAttribute('lang', 'en');
}

export function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link]');
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.getAttribute('data-href') || '#';
      a.textContent = fakeLink.textContent;
      fakeLink.replaceWith(a);
    }
  });
}

export function ensureUniqueLandmarks() {
  const existingHeaders = document.querySelectorAll('header:not([role="banner"])');
  const existingFooters = document.querySelectorAll('footer:not([role="contentinfo"])');

  if (existingHeaders.length > 1) {
    existingHeaders.forEach((header, index) => index > 0 && header.remove());
  }
  if (existingFooters.length > 1) {
    existingFooters.forEach((footer, index) => index > 0 && footer.remove());
  }
}

export function ensureProperLandmarkStructure() {
  // Remove existing landmarks to avoid duplication
  const allHeaders = document.querySelectorAll('header');
  const allFooters = document.querySelectorAll('footer');
  const allMain = document.querySelectorAll('main');

  // Remove all existing landmarks
  allHeaders.forEach(header => header.remove());
  allFooters.forEach(footer => footer.remove());
  allMain.forEach(main => main.remove());

  // Create new landmarks and inject them
  const body = document.body;

  // Header - Banner
  const headerElement = document.createElement('header');
  headerElement.setAttribute('role', 'banner');
  body.prepend(headerElement);

  const siteTitle = document.createElement('div');
  siteTitle.textContent = 'Application Name';
  headerElement.appendChild(siteTitle);

  // Navigation - Navigation
  const navElement = document.createElement('nav');
  navElement.setAttribute('role', 'navigation');
  headerElement.appendChild(navElement);

  const navList = document.createElement('ul');
  navList.setAttribute('role', 'menubar');
  navList.id = 'mainMenu';
  navElement.appendChild(navList);

  const homeItem = document.createElement('li');
  homeItem.setAttribute('role', 'none');
  homeItem.setAttribute('role', 'menuitem');
  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.textContent = 'Home';
  homeItem.appendChild(homeLink);
  navList.appendChild(homeItem);

  // Main Content Area
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  mainElement.id = 'content-main';
  body.appendChild(mainElement);

  // Footer - Content Info
  const footerElement = document.createElement('footer');
  footerElement.setAttribute('role', 'contentinfo');
  body.appendChild(footerElement);

  const copyright = document.createElement('p');
  copyright.textContent = '© 2023 Your Company. All rights reserved.';
  footerElement.appendChild(copyright);

  // Call the wrapPrimaryContentInMain function
  wrapPrimaryContentInMain();
}

export function wrapPrimaryContentInMain() {
  const existingMains = document.querySelectorAll('main');

  // Remove duplicate main elements if any
  existingMains.forEach((main, index) => {
    if (index > 0) {
      main.remove();
    }
  });

  // If no main element exists, create and wrap primary content
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');

  // Find primary content container (adjust selector based on your content structure)
  const contentContainer = document.querySelector('#content') || document.querySelector('.content') || document.body;

  // Move existing content into main if not already inside one
  if (!document.querySelector('main')) {
    while (contentContainer.firstChild) {
      mainElement.appendChild(contentContainer.firstChild);
    }
    contentContainer.appendChild(mainElement);
  }
}

export function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const shouldUseTitle = svg.getAttribute('aria-labelledby') === null && !svg.querySelector('title');
    const isBackground = svg.style && svg.style.position === 'absolute' && svg.style.top === '0' && svg.style.left === '0' && svg.style.width === '100%' && svg.style.height === '100%';

    if (shouldUseTitle || isBackground) {
      svg.setAttribute('aria-label', 'Description of SVG content');
    } else {
      const title = document.createElement('title');
      title.textContent = 'Description of SVG content';
      svg.prepend(title);
    }
  });
}

export function addScopeToTableHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Button accessibility setup (for non-React buttons if any)
export function setupButtonAccessibility() {
  const button = document.getElementById('myButton');
  if (button) {
    button.setAttribute('aria-label', 'My Button');
    button.setAttribute('role', 'button');
    button.setAttribute('aria-expanded', 'false');

    function handleButtonClick() {
      const isExpanded = button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
      button.setAttribute('aria-expanded', isExpanded);
    }

    button.addEventListener('click', handleButtonClick);
  }
}

// Example of how to update the icons in app/layout.tsx and dashboard/app/layout.tsx
export const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard Apple Icon"><title>Screeps Dashboard Apple Icon</title><text y="0.9em" font-size="90">🐛</text></svg>',
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// ... rest of the code in main.js