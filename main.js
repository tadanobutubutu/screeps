import React from 'react';
import { useTable } from 'react-table';
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Add ARIA attributes to improve accessibility
export function addAriaAttributes() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    if (!mainElement.getAttribute('role')) {
      mainElement.setAttribute('role', 'main');
    }
    if (!mainElement.id) {
      mainElement.id = 'main-content';
      mainElement.setAttribute('aria-label', 'Main content');
    }
  }
}

// Ensure HTML lang attribute is set
export function addLangAttributeToRoot() {
  const rootElement = document.documentElement;
  if (rootElement && !rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
}

// Function to handle button click for accessibility
export function handleButtonClick() {
  const button = document.getElementById('myButton');
  if (button) {
    button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  }
}

// Function to fix fake links by converting them to proper anchors
export function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(fakeLink => {
    if (fakeLink.tagName === 'DIV' || fakeLink.tagName === 'SPAN') {
      const a = document.createElement('a');
      a.href = fakeLink.getAttribute('data-href');
      a.textContent = fakeLink.textContent;
      fakeLink.parentNode.replaceChild(a, fakeLink);
    }
  });
}

// Function to ensure unique landmark elements (header, footer, etc.)
export function ensureUniqueLandmarks(elements) {
  const existingHeaders = document.querySelectorAll('header');
  const existingFooters = document.querySelectorAll('footer');

  if (existingHeaders.length > 1) {
    existingHeaders.slice(1).forEach(header => header.remove());
  }
  if (existingFooters.length > 1) {
    existingFooters.slice(1).forEach(footer => footer.remove());
  }

  if (elements && Array.isArray(elements)) {
    let mainCount = 0;
    let navCount = 0;
    elements.forEach(element => {
      if (element && element.props) {
        const role = element.props.role;
        if (role === 'main') mainCount++;
        if (role === 'navigation' || role === 'nav') navCount++;
      }
    });
    return mainCount <= 1 && navCount <= 1;
  }
  return false;
}

// Function to create proper landmark structure
export function ensureProperLandmarkStructure() {
  // Remove existing landmarks to avoid duplication
  const allHeaders = document.querySelectorAll('header');
  const allFooters = document.querySelectorAll('footer');
  const allMain = document.querySelectorAll('main');

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
  body.appendChild(navElement);

  const navList = document.createElement('ul');
  navList.setAttribute('role', 'menubar');
  navList.id = 'mainMenu';
  navElement.appendChild(navList);

  const homeItem = document.createElement('li');
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

// Function to add accessible attributes to SVG elements
export function addAccessibleSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const shouldUseTitle = !svg.closest('[lang="en"]');
    const isBackground = svg.matches('body svg') || (svg.style.position === 'absolute' && svg.style.top === '0' && svg.style.left === '0' && svg.style.width === '100%' && svg.style.height === '100%');

    if (shouldUseTitle || isBackground) {
      svg.setAttribute('title', 'Description of SVG content');
    } else {
      svg.setAttribute('aria-label', 'Description of SVG content');
    }
  });
}

// Initialize button accessibility
if (document.getElementById('myButton')) {
  const button = document.getElementById('myButton');
  button.setAttribute('aria-label', 'My Button');
  button.setAttribute('role', 'button');
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', handleButtonClick);
}

// Existing code and exports
export function existingFunction1() { /* ... */ }
export const existingConst1 = 'existing value';
export function newFunction1() { /* ... */ }
export const newConst1 = 'new value';
const restoredModule = require('./utils');
export default restoredModule;

// React-specific JSX functions
const EnhancedTable = ({ children }) => {
  return React.cloneElement(children, { role: 'table' });
};
export { EnhancedTable };

export function reactLanguageAttributeFix(reactElement) {
  if (reactElement && reactElement.props) {
    const langAttr = reactElement.props.lang;
    if (langAttr) {
      console.warn(`Language attribute detected on non-accessible element: ${langAttr}`);
      return React.cloneElement(reactElement, { lang: 'en' });
    }
  }
  return reactElement;
}

export function removeDuplicateMainElements(children) {
  const mainElements = children.filter((child) => child && child.type === 'main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements detected. Only one <main> element is allowed.');
    return React.cloneElement(mainElements[0], { children: mainElements.slice(1) });
  }
  return children;
}

export function getLangAttribute(element) {
  if (element && element.props && element.props.lang) {
    return element.props.lang;
  }
  return null;
}

export function getFullLangAttribute(element) {
  const lang = getLangAttribute(element);
  if (lang) {
    return lang;
  }
  return 'en';
}

export function validateTableAccessibility(tableElement) {
  if (!tableElement || !tableElement.props) {
    return false;
  }
  const hasAriaLabel = tableElement.props['aria-label'] || tableElement.props['ariaLabel'];
  const hasAriaLabelledBy = tableElement.props['aria-labelledby'] || tableElement.props['ariaLabelledBy'];
  return !!(hasAriaLabel || hasAriaLabelledBy);
}

export function validateTableStructure(tableElement) {
  if (!tableElement || !tableElement.props) {
    return false;
  }
  const children = tableElement.props.children ? Array.isArray(tableElement.props.children) ? tableElement.props.children : [tableElement.props.children] : [];
  const hasThead = children.some(child => child && (child.type === 'thead' || (child.type === 'thead' && child)));
  const hasTbody = children.some(child => child && (child.type === 'tbody' || (child.type === 'tbody' && child)));
  return !!(hasThead && hasTbody);
}

export function validateLandmark(element) {
  const landmarkRoles = ['header', 'nav', 'main', 'article', 'aside', 'section', 'complementary', 'banner', 'contentinfo', 'navigation', 'search'];
  if (!element || !element.props) {
    return false;
  }
  const role = element.props.role;
  return landmarkRoles.includes(role);
}

export function getSvgAccessibleName(svgElement) {
  if (!svgElement || !svgElement.props) {
    return null;
  }
  if (svgElement.props['aria-label']) {
    return svgElement.props['aria-label'];
  }
  if (svgElement.props['aria-labelledby']) {
    return svgElement.props['aria-labelledby'];
  }
  const children = svgElement.props.children ? Array.isArray(svgElement.props.children) ? svgElement.props.children : [svgElement.props.children] : [];
  const titleElement = children.find(child => child && child.type === 'title');
  if (titleElement && titleElement.props) {
    return titleElement.props.children;
  }
  return null;
}

export function createAccessibleButton(linkText, onClick) {
  return React.createElement('button', { type: 'button', onClick: onClick, 'aria-label': linkText }, linkText);
}

export function createAccessibleLink(href, linkText, isExternal = false) {
  const props = { href: href, 'aria-label': linkText };
  if (isExternal) {
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  return React.createElement('a', props, linkText);
}

export function renderDependencyGraphVisualization() {
  const graphContainer = document.getElementById('dependency-graph');
  if (graphContainer) {
    graphContainer.innerHTML = '';
    const graphElement = dependencyGraphContent();
    graphContainer.appendChild(graphElement);
  }
}

export function renderIndexVisualization() {
  const indexContainer = document.getElementById('index-view');
  if (indexContainer) {
    indexContainer.innerHTML = '';
    const indexElement = indexContent();
    indexContainer.innerHTML = indexElement;
  }
}

export function renderContentVisualization() {
  const contentContainer = document.getElementById('primary-content');
  if (contentContainer) {
    contentContainer.innerHTML = '';
    const contentElement = indexContent();
    contentContainer.innerHTML = contentElement;
  }
}

export function renderTableStructuralCompliance() {
  const tableElements = document.querySelectorAll('table');
  tableElements.forEach(table => {
    if (validateTableAccessibility(table) && validateTableStructure(table)) {
      return;
    }
    if (!validateTableStructure(table)) {
      const thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Column Header 1</th><th>Column Header 2</th></tr>';
      if (!table.querySelector('thead')) {
        if (table.tHead) {
          thead.innerHTML = table.tHead.innerHTML;
          table.tHead = null;
        }
        if (!table.querySelector('thead')) {
          table.insertBefore(thead, table.tBodies[0]);
        }
      }
    }
  });
}

export function fixDuplicateMainIssue() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements detected. Only one <main> element is allowed.');
  }
}

export function wrapContentInMain() {
  const rootElement = document.documentElement;
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const body = document.body;
    const newMain = document.createElement('main');
    newMain.id = 'main-content';
    newMain.setAttribute('role', 'main');
    rootElement.insertBefore(newMain, body);
  }
}

// Initialize all accessibility features
(function initializeApp() {
  addAriaAttributes();
  addLangAttributeToRoot();
  fixFakeLinks();
  ensureProperLandmarkStructure();
  ensureUniqueLandmarks();
  addAccessibleSVGs();
  renderDependencyGraphVisualization();
  renderIndexVisualization();
  renderTableStructuralCompliance();
  renderContentVisualization();
})();

// TODO: Add back any required exports that might have been removed
const { restoredFunction1, restoredConst1 } = require('./restoredModule');
export { restoredFunction1, restoredConst1 };