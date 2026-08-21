const fs = require('fs');
const path = require('path');

// Original Content (preserve this)
// This is the original content of main.js that must be preserved.

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Function to add scope attribute to <th> elements
function addScopeToThElements(filePath) {
  const htmlContent = fs.readFileSync(filePath, 'utf8');
  const updatedContent = htmlContent.replace(/<th\b[^>]*>/g, '<th scope="col">');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// List of files affected by the issue
const affectedFiles = [
  'docs/dependency-graph.html',
  // Add other affected files here
];

// Update affected files
affectedFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  addScopeToThElements(filePath);
});

// Accessibility enhancement placeholder
function enhanceAccessibility() {
  // Code to enhance accessibility features
  // For example, adding ARIA roles, keyboard navigation support, etc.
  // Here's some sample code to demonstrate the addition of ARIA roles:

  // REACT_015: Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }

  // REACT_017: Add landmark roles and fix landmark issues
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (main) {
    main.setAttribute('role', 'main');
    main.id = main.id || 'main-content';
  }

  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (nav && !nav.getAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }

  // REACT_025: Ensure unique landmarks
  const headers = document.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (!header.id && index > 0) {
      header.id = `header-${index}`;
    }
  });

  const footers = document.querySelectorAll('footer');
  footers.forEach((footer, index) => {
    if (!footer.id && index > 0) {
      footer.id = `footer-${index}`;
    }
  });

  // REACT_041: Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"]):not([aria-label])');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title && !svg.getAttribute('aria-labelledby')) {
      const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      const titleId = `svg-title-${Date.now()}-${index}`;
      titleElement.id = titleId;
      titleElement.textContent = 'Screeps Dashboard' || `Decorative icon ${index + 1}`;
      svg.insertBefore(titleElement, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
      svg.setAttribute('role', 'img');
    }
  });

  // REACT_036: Fix fake link issues - ensure links have proper href
  const links = document.querySelectorAll('a:not([href])');
  links.forEach(link => {
    if (!link.href && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

// Accessibility utility functions
export function addAriaLabel(element, label) {
  if (element) {
    element.setAttribute('aria-label', label);
  }
}

export function setMainLandmark(mainElement) {
  // TODO: Remove the commented line and uncomment mainElement when available
  if (mainElement) mainElement.setAttribute('aria-label', 'Main content area');
}

// ADD back any required exports:
export let someRequiredVariable;

// Run accessibility enhancements
enhanceAccessibility();

export { someFunction, anotherFunction };
export default enhanceAccessibility;

export function someFunction() {
  // Existing function code
}

export function anotherFunction() {
  // Another existing function code
}

export function addSvgAccessibility(svgElement, description) {
  if (svgElement && svgElement.tagName.toLowerCase() === 'svg') {
    const title = document.createElement('title');
    title.textContent = description;
    svgElement.insertBefore(title, svg.firstChild);
    svgElement.setAttribute('role', 'img');
    svgElement.setAttribute('aria-labelledby', 'svg-title');
  }
}

export function fixFakeLink(linkElement) {
  if (linkElement && !linkElement.href) {
    linkElement.setAttribute('role', 'button');
    linkElement.setAttribute('tabindex', '0');
  }
}