// Function to address accessibility issues from insight report
function addressAccessibilityIssues() {
  addLangAttribute();
  addScopeToTableHeaders();
  ensureUniqueLandmarks();
  fixFakeLinks();
  addAccessibleSVGs();
  ensureProperLandmarkStructure();
}

// New function to ensure HTML lang attribute is set
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
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

function ensureUniqueLandmarks() {
  const existingHeaders = document.querySelectorAll('header');
  const existingFooters = document.querySelectorAll('footer');

  if (existingHeaders.length > 1) {
    existingHeaders.forEach((header, index) => index > 0 && header.remove());
  }
  if (existingFooters.length > 1) {
    existingFooters.forEach((footer, index) => index > 0 && footer.remove());
  }
}

function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('div[role="link"], span[role="link"]');
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.getAttribute('data-href') || '#';
      a.textContent = fakeLink.textContent;
      a.setAttribute('role', 'link');
      fakeLink.replaceWith(a);
    }
  });
}

function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    const hasAccessibleName = title !== null || ariaLabel !== null;

    const computedStyle = window.getComputedStyle(svg);
    const isBackground = computedStyle.position === 'absolute' &&
                         computedStyle.top === '0' &&
                         computedStyle.left === '0' &&
                         computedStyle.width === '100%' &&
                         computedStyle.height === '100%';

    if (hasAccessibleName || isBackground) {
      if (!ariaLabel && !title) {
        svg.setAttribute('aria-label', 'Description of SVG content');
      }
    } else {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Description of SVG content';
      svg.prepend(titleElement);
    }
  });
}

// New functions from 'origin/main'
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

  const siteTitle = document.createElement('h1');
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
}

// Assuming you have a button with ID 'myButton'
const button = document.getElementById('myButton');
button.setAttribute('aria-label', 'My Button');
button.setAttribute('role', 'button');

// New function to handle button click
function handleButtonClick() {
  const btn = document.getElementById('myButton');
  const isExpanded = btn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
  btn.setAttribute('aria-expanded', isExpanded);
}

// Import dependencyGraphContent if it is used in the code
// const { dependencyGraphContent } = ...

// Call all necessary functions
addressAccessibilityIssues();

// React root mount integration (from origin/main)
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (typeof document !== 'undefined') {
  const container = document.getElementById('root');
  if (container) {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      container
    );
  }
}

function wrapPrimaryContentInMain() {
  const main = document.querySelector('main') || document.createElement('main');
  main.setAttribute('role', 'main');
  
  const content = document.querySelector('#primary-content') || document.querySelector('.primary-content');
  if (content && content.parentNode !== main) {
    main.appendChild(content);
  }
  
  if (!document.querySelector('main')) {
    document.body.appendChild(main);
  }
  
  return main;
}

module.exports = {
  addressAccessibilityIssues,
  wrapPrimaryContentInMain,
  handleButtonClick,
  addLangAttribute,
  fixFakeLinks,
  ensureUniqueLandmarks,
  ensureProperLandmarkStructure,
  addAccessibleSVGs,
  addScopeToTableHeaders,
};