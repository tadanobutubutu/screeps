// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Assuming you have a button with ID 'myButton'
const button = document.getElementById('myButton');
button.setAttribute('aria-label', 'My Button');
button.setAttribute('role', 'button');
button.setAttribute('aria-expanded', 'false');

// New function to handle button click
function handleButtonClick() {
  const button = document.getElementById('myButton');
  const isExpanded = button.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  button.setAttribute('aria-expanded', isExpanded);
}

// Add the click event listener to the button
button.addEventListener('click', handleButtonClick);

// Import dependencyGraphContent if it is used in the code
const { dependencyGraphContent } = require('./dependencyGraph');

// New function to ensure HTML lang attribute is set
function addLangAttribute() {
  const html = document.documentElement;
  html.setAttribute('lang', 'en');
}

// New function to inject and fix fake links
function fixFakeLinks() {
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

// Ensure Unique Landmarks Function
function ensureUniqueLandmarks() {
  const existingHeaders = document.querySelectorAll('header:not([role="banner"])');
  const existingFooters = document.querySelectorAll('footer:not([role="contentinfo"])');

  if (existingHeaders.length > 1) {
    existingHeaders.forEach((header, index) => index > 0 && header.remove());
  }
  if (existingFooters.length > 1) {
    existingFooters.forEach((footer, index) => index > 0  && footer.remove());
  }
}

// Add function to ensure proper landmark structure
function ensureProperLandmarkStructure() {
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

  // Add function to wrap primary content in main landmark
  function wrapPrimaryContentInMain() {
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

  // Call the wrapPrimaryContentInMain function
  wrapPrimaryContentInMain();
}

// Add Accessible SVGs Function
function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const shouldUseTitle = svg.getAttribute('aria-labelledby') === null && !svg.querySelector('title');
    const isBackground = svg.css && svg.css('position') === 'absolute' && svg.css('top') === '0' && svg.css('left') === '0' && svg.css('width') === '100%' && svg.css('height') === '100%';

    if (shouldUseTitle || isBackground) {
      svg.setAttribute('aria-label', 'Description of SVG content');
    } else {
      const title = document.createElement('title');
      title.textContent = 'Description of SVG content';
      svg.prepend(title);
    }
  });
}

// Function to add 'scope="col"' attribute to table header cells
function addScopeToTableHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Call all necessary functions
addLangAttribute();
fixFakeLinks();
ensureProperLandmarkStructure();
ensureUniqueLandmarks();
addAccessibleSVGs();
addScopeToTableHeaders();

// React root mount integration (from origin/main)
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

module.exports = {
  wrapPrimaryContentInMain,
  handleButtonClick,
  addLangAttribute,
  fixFakeLinks,
  ensureUniqueLandmarks,
  ensureProperLandmarkStructure,
  addAccessibleSVGs,
  addScopeToTableHeaders,
};