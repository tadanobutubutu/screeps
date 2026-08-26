// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue
//

// REACT_015: Set lang attribute on HTML element
export function setLangAttribute(lang = 'en') {
  document.documentElement.lang = lang;
}

// REACT_025 & REACT_017: Landmark utilities
export function createMainLandmark(content) {
  // Ensure unique main landmark - each page should have only one <main>
  const existingMain = document.querySelector('main');
  if (existingMain) {
    existingMain.remove();
  }
  const main = document.createElement('main');
  main.setAttribute('id', 'main-content');
  main.setAttribute('role', 'main');
  main.textContent = content;
  return main;
}

export function createNavLandmark(label, items) {
  // Add accessible label to nav landmark
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', label);
  return nav;
}

export function createHeaderLandmark(title) {
  const header = document.createElement('header');
  header.setAttribute('role', 'banner');
  return header;
}

export function createFooterLandmark(content) {
  const footer = document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.textContent = content;
  return footer;
}

// REACT_041: Add accessible names to SVGs
export function createAccessibleSVG(options) {
  const {
    src,
    size = 24,
    description,
    className = '',
    id = ''
  } = options;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-label', description); // REACT_041: Accessible name
  svg.setAttribute('role', 'img');
  if (id) svg.setAttribute('id', id);
  if (className) svg.setAttribute('class', className);

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
  svg.appendChild(use);

  return svg;
}

// REACT_036: Fix fake link issue - use button for actions, link for navigation
export function createActionButton(text, onClick, className = '') {
  // Use <button> instead of <a href="#"> for JavaScript actions
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;
  button.addEventListener('click', onClick);
  return button;
}

export function createNavigationLink(href, text, isExternal = false) {
  // Use <a> only for actual navigation
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  if (isExternal) {
    link.rel = 'noopener noreferrer';
    link.target = '_blank';
  }
  return link;
}

// New requested function from origin/main
function newFunction() {
  // Implement the new function
  console.log('newFunction executed');
}

// Initialize accessibility features
export function initAccessibility() {
  // Set default language
  setLangAttribute('en');
  
  // Log accessibility initialization
  console.log('Accessibility features initialized');
}

// Application initialization
export function init() {
  initAccessibility();
  
  // Call the new function as part of initialization
  newFunction();
}

// Auto-initialize if this is the main module
if (typeof window !== 'undefined') {
  init();
}