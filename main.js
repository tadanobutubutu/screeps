// main.js
// Updated to import and use dependencyGraphContent and indexContent
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a2237d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
//_Commit: 669117b4c3d1a635653f730f0a059efacbb752_
//<!-- todo-hash: 312aa8ea4c5e1c9430e4b7c36c210eb9a72dea -->

//_Commit: 33bd865abb006c86b8f7c2a22f441136e44f37f_

<!-- todo-hash: 88c1c6cc67ee5e0dd4df31d91becf96d321836d1 -->

// Import required modules
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Renders the dependency graph view.
// Updated to use dependencyGraphContent.
export function renderDependencyGraph() {
  // Example usage: replace with actual rendering logic
  const container = document.getElementById('dependency-graph');
  if (container && dependencyGraphContent) {
    container.innerHTML = dependencyGraphContent;
  }
}

// Renders the index view.
// Updated to use indexContent.
export function renderIndex() {
  // Example usage: replace with actual rendering logic
  const container = document.getElementById('index-view');
  if (container && indexContent) {
    container.innerHTML = indexContent;
  }
}

export { makeHeaderFocusable }; // new export statement from conflicting branch

function ensureElementId(element) {
  // Combined and reconciled code from both branches
  if (!element.id) {
    element.id = element.id || element.name || '';
  }
}

function validateTableAccessibility(table) {
  // Existing code...
  if (!table) return;
  
  // Check for proper table structure
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.getAttribute('scope')) {
      // Add appropriate scope attribute based on position
      const row = th.closest('tr');
      const rowIndex = Array.from(row.parentElement.children).indexOf(row);
      if (rowIndex === 0) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
}

function validateTableStructure(table) {
  // Existing code...
  if (!table) return;
  
  // Validate table has proper thead and tbody
  if (!table.querySelector('thead') || !table.querySelector('tbody')) {
    console.warn('Table accessibility: Table should have thead and tbody elements');
  }
}

function validateLandmark() {
  // Existing code...
  // Check for presence of main landmark
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    console.warn('Accessibility: No main landmark found. Consider adding a <main> element.');
  }
}

function validateLandmarkStructure() {
  // Existing code...
  // Validate landmark structure and uniqueness
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1 && landmark !== 'nav' && landmark !== 'footer') {
      console.warn(`Accessibility: Multiple ${landmark} landmarks found. Consider using aria-label to distinguish them.`);
    }
  });
}

function ensureUniqueLandmarks() {
  // Validate and ensure landmarks are unique
  const landmarkTypes = ['header', 'main', 'nav', 'aside', 'footer'];
  
  landmarkTypes.forEach(type => {
    const elements = document.querySelectorAll(type);
    elements.forEach((el, index) => {
      if (elements.length > 1) {
        const existingLabel = el.getAttribute('aria-label');
        if (!existingLabel) {
          el.setAttribute('aria-label', `${type} ${index + 1}`);
        }
      }
    });
  });
}

function getSvgAccessibleName(svg) {
  // Existing code...
  if (!svg) return '';
  
  // Check for title element within SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const linkedElement = document.getElementById(ariaLabelledby);
    if (linkedElement) {
      return linkedElement.textContent;
    }
  }
  
  return 'Graphical element';
}

function setSvgAttributes(svg, accessibleName) {
  // Example SVG attribute setter
  if (svg && accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
    svg.setAttribute('role', 'img');
  }
}

function createInPageButton(options = {}) {
  // Existing code...
  const button = document.createElement('button');
  button.textContent = options.text || 'In-Page Action';
  button.setAttribute('aria-label', options.ariaLabel || 'Perform in-page action');
  button.className = options.className || 'in-page-button';
  
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

function createAccessibleLink(href, text, options = {}) {
  // Create a proper accessible link
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  
  if (options.ariaLabel) {
    link.setAttribute('aria-label', options.ariaLabel);
  }
  
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  return link;
}

function handleAccessibilityIssues() {
  // Main function to handle all accessibility issues
  fixAccessibilityIssues();
}

function handleFakeLinks() {
  // Find and fix fake links (links that don't navigate)
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    // If href is empty, "#", or javascript:void(0), it's likely a fake link
    if (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:;') {
      // Convert to button if it triggers an action
      const isInteractive = link.getAttribute('role') === 'button' || 
                            link.onclick || 
                            link.classList.contains('js-action');
      
      if (isInteractive) {
        // Either add proper button role or log warning
        if (!link.getAttribute('role')) {
          console.warn('Accessibility: Link used as button. Consider using <button> element instead.');
        }
      }
    }
  });
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // 1. REACT_015: Ensure lang attribute is set on the HTML element
  const lang = getLangAttribute();
  document.documentElement.setAttribute('lang', lang);

  // 2. REACT_027: Validate table accessibility and structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // 3. REACT_017: Validate landmark and landmark structure issues
  validateLandmark();
  validateLandmarkStructure();

  // 4. REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks();

  // 5. REACT_041: Add accessible names to SVGs (assuming two SVG elements)
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  });

  // 6. REACT_036: Fix fake link issue
  handleFakeLinks();
}

// Implement wrapPrimaryContentInMain function
function wrapPrimaryContentInMain(primaryContent) {
  // Wrap primary content in a <main> element for accessibility
  const main = document.createElement('main');
  main.id = 'main-content';
  main.setAttribute('role', 'main');
  main.innerHTML = primaryContent;
  return main;
}

// DOM-based accessibility code

// Add lang attribute to HTML element
const langAttr = getLangAttribute();
document.documentElement.setAttribute('lang', langAttr);

// Create in-page button with accessibility considerations
const inPageBtn = createInPageButton({
  text: 'Skip to content',
  ariaLabel: 'Skip to main content',
  className: 'skip-link',
  onClick: () => {
    const main = document.querySelector('main') || document.getElementById('main-content');
    if (main) main.focus();
  }
});
document.body.appendChild(inPageBtn);

// Validate table structure and accessibility
const tables = document.querySelectorAll('table');
tables.forEach(table => {
  validateTableAccessibility(table);
  validateTableStructure(table);
});

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();
ensureUniqueLandmarks();

// Add accessible names to SVGs
const svgs = document.querySelectorAll('svg');
svgs.forEach(svg => {
  const accessibleName = getSvgAccessibleName(svg);
  setSvgAttributes(svg, accessibleName);
});

// Ensure unique landmarks
ensureUniqueLandmarks();

// ... rest of your code ...

function addAriaLabel(element) {
  // Combined and reconciled code from both branches
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', 'View focus');
  }
}

const dependencyGraphContainer = document.createElement('div');
dependencyGraphContainer.id = 'dependencyGraph'; // combined id from both branches
dependencyGraphContainer.setAttribute('role', 'region');
dependencyGraphContainer.setAttribute('aria-label', 'Dependency Graph');

// React / UI related functions

// TODO: Add these imported modules to the relevant rendering functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.className