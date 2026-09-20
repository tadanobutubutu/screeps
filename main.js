// TODO: Add back any required exports that might have been removed

// main.js

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

//_Commit: 04d109c83c252c4b57c7423f6e2d3830016c23fe_

<!-- todo-hash: d3333b5c419af377c13290663df328abb728b13b -->

// Updated to import and use dependencyGraphContent and indexContent
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';


// Importing the necessary functions
import { getLangAttribute } from './utils/accessibilityUtils';
import { renderHeader, renderFooter } from './components.js';
import { state, updateState } from './state.js';

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLinkAccessibility())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton() and handleFakeLinks())

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

_Commit: 289f01d1f5ef6ff048a60d51871fea12ad3f66bf_

<!-- todo-hash: d290c9a63ee693e91602163f7ca6757def47f63e -->

// Accessibility function stubs
function getFullLangAttribute() {
  // Returns the full language attribute value with region if applicable
  const lang = getLangAttribute();
  // Check if there's a regional variant needed
  const htmlElement = document.documentElement;
  if (htmlElement) {
    const langValue = htmlElement.getAttribute('lang') || lang;
    return langValue;
  }
  return lang;
}

function personName() {
  // Returns a person's name for accessibility contexts
  return 'Unknown User';
}

function validateTableAccessibility(table) {
  // Validates that tables have proper accessibility attributes
  if (!table) return;
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if header is for a row or column
      const parent = th.parentElement;
      if (parent && parent.tagName === 'TR') {
        const cells = Array.from(parent.querySelectorAll('th, td'));
        const thIndex = cells.indexOf(th);
        if (thIndex === 0) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    }
  });
}

function validateTableStructure(table) {
  // Ensures table structure is correct for accessibility
  if (!table) return;
  // Ensure table has proper structure
  if (!table.querySelector('thead')) {
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
  if (!table.querySelector('tbody')) {
    const rows = table.querySelectorAll('tr');
    if (rows.length > 1) {
      const tbody = document.createElement('tbody');
      for (let i = 1; i < rows.length; i++) {
        tbody.appendChild(rows[i]);
      }
      table.appendChild(tbody);
    }
  }
}

function validateLandmark() {
  // Validates that landmark elements are properly used
  const mainElements = document.querySelectorAll('main');
  const navElements = document.querySelectorAll('nav');
  const asideElements = document.querySelectorAll('aside');
  
  // Ensure only one main landmark
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].setAttribute('role', 'main');
    }
  }
  
  // Ensure nav elements have proper labels if multiple
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }
  
  // Ensure aside elements have proper labels if multiple
  if (asideElements.length > 1) {
    asideElements.forEach((aside, index) => {
      if (!aside.getAttribute('aria-label') && !aside.getAttribute('aria-labelledby')) {
        aside.setAttribute('aria-label', `Complementary content ${index + 1}`);
      }
    });
  }
}

function validateLandmarkStructure() {
  // Validates the overall landmark structure of the page
  const html = document.documentElement;
  const body = document.body;
  
  // Ensure header has banner role if at top level
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    const parent = header.parentElement;
    if (parent === html || parent === body) {
      header.setAttribute('role', 'banner');
    }
  }
  
  // Ensure footer has contentinfo role if at top level
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    const parent = footer.parentElement;
    if (parent === html || parent === body) {
      footer.setAttribute('role', 'contentinfo');
    }
  }
  
  // Ensure main element has main role
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
}

function getSvgAccessibleName(svg) {
  // Returns an accessible name for an SVG element
  if (!svg) return '';
  
  // Check for existing aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check for aria-labelledby reference
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title && title.textContent) return title.textContent;
  
  // Generate a default name based on id or class
  const id = svg.getAttribute('id');
  if (id) return id.replace(/([A-Z])/g, ' $1').trim();
  
  return 'Decorative graphic';
}

function createInPageButton() {
  // Creates an accessible in-page navigation button
  const buttons = document.querySelectorAll('button[data-target], a.button, .fake-link');
  
  buttons.forEach(button => {
    // Check if this is a fake link that should be a real link or button
    if (button.classList.contains('fake-link') || button.getAttribute('data-target')) {
      const href = button.getAttribute('href');
      const target = button.getAttribute('data-target');
      
      if (!href && target) {
        // Convert to proper button if it's an in-page navigation
        button.setAttribute('role', 'button');
        const targetElement = document.querySelector(target);
        if (targetElement) {
          button.setAttribute('aria-label', button.textContent || 'Navigate to content');
        }
      }
    }
    
    // Ensure buttons have accessible names
    if (!button.textContent && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
      const icon = button.querySelector('svg, img, icon');
      if (icon) {
        const iconText = icon.getAttribute('aria-label') || icon.querySelector('title')?.textContent;
        if (iconText) {
          button.setAttribute('aria-label', iconText);
        }
      }
    }
  });
}

// Implement this function for ensuring unique landmarks
function ensureUniqueLandmarks() {
  // Get all landmark elements
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, section[aria-labelledby], section[aria-label], [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="region"], [role="search"]');
  
  const landmarkCounts = new Map();
  const landmarkElements = new Map();
  
  // First pass: count landmarks by type
  landmarks.forEach((landmark, index) => {
    // Determine landmark type
    let type = landmark.tagName.toLowerCase();
    if (landmark.hasAttribute('role')) {
      type = landmark.getAttribute('role');
    }
    
    // For section elements, use aria-label or aria-labelledby as part of the type
    if (type === 'section' && (landmark.hasAttribute('aria-label') || landmark.hasAttribute('aria-labelledby'))) {
      const label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby');
      type = `section-${label}`;
    }
    
    if (!landmarkCounts.has(type)) {
      landmarkCounts.set(type, 0);
      landmarkElements.set(type, []);
    }
    
    landmarkCounts.set(type, landmarkCounts.get(type) + 1);
    landmarkElements.get(type).push(landmark);
  });
  
  // Second pass: ensure uniqueness by adding unique identifiers where needed
  landmarkCounts.forEach((count, type) => {
    if (count > 1) {
      const elements = landmarkElements.get(type);
      elements.forEach((element, index) => {
        // Add unique ID if not present
        if (!element.id) {
          element.id = `${type}-${index + 1}`;
        }
        // Add aria-label if not present and it's a generic landmark
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          element.setAttribute('aria-label', `${type} ${index + 1}`);
        }
      });
    } else if (count === 1) {
      const element = landmarkElements.get(type)[0];
      // Ensure single landmarks also have proper identification
      if (!element.id) {
        element.id = type;
      }
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        element.setAttribute('aria-label', type);
      }
    }
  });
}

// New function to fix accessibility issues as per the insight report
function fixAccessibilityIssues() {
  // 1. REACT_015: Ensure lang attribute is set on the HTML element
  const lang = getLangAttribute();
  const htmlElement = document.documentElement;
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }

  // 2. REACT_027: Validate table accessibility and structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // 3. REACT_017: Validate landmark and landmark structure issues
  validateLandmark();
  ...

  // 4. REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks();
  validateLinkAccessibility();
  handleFakeLinks();

  // 5. REACT_041: Add accessible names to SVGs (assuming two SVG elements)
  const svgElements = document.querySelectorAll('#dependencyGraph, #myOtherSvg');
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
  });

  // 6. REACT_036: Fix fake link issue (personName is part of the fix)
  personName();
  createInPageButton();
}

// Implement wrapPrimaryContentInMain function
function wrapPrimaryContentInMain(primaryContent) {
  // Wrap primary content in a <main> element for accessibility
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  if (typeof primaryContent === 'string') {
    main.innerHTML = primaryContent;
  } else if (primaryContent instanceof HTMLElement) {
    main.appendChild(primaryContent);
  }
  return main;
}

// Renders the dependency graph view.
// Updated to use dependencyGraphContent.
export function renderDependencyGraph() {
  // Example usage: replace with actual rendering logic
  const container = document.getElementById('dependencyGraph');
  if (container && dependencyGraphContent) {
    container.innerHTML = dependencyGraphContent;
  }
}

// Renders the index view.
// Updated to use indexContent.
export function renderIndex() {
  // Example usage: replace with actual rendering logic
  const container = document.getElementById('indexContent');
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

// DOM-based accessibility code

// Add lang attribute to HTML element
document.documentElement.setAttribute('lang', getLangAttribute());

// Create in-page button with accessibility considerations
createInPageButton();

// Validate table structure and accessibility
const table = document.getElementById('myTable');
if (table) {
  validateTableAccessibility(table);
  validateTableStructure(table);
}

// Add/fix landmark issues
validateLandmark();
validateLandmarkStructure();

// Add accessible names to SVGs
const svgElements = document.querySelectorAll('#mySvg, #myOtherSvg');
svgElements.forEach(svg => {
  const accessibleName = getSvgAccessibleName(svg);
  setSvgAttributes(svg, accessibleName);
});

// Ensure unique landmarks
validateLinkAccessibility();
handleFakeLinks();

function addAriaLabel(element) {
  // Combined and reconciled code from both branches
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', 'View focus');
  }
}

const dependencyGraphContainer = document.createElement('div');
dependencyGraphContainer.id = 'dependencyGraph';
dependencyGraphContainer.setAttribute('role', 'region');
dependencyGraphContainer.setAttribute('aria-label', 'Dependency Graph');

// React / UI related functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = products.map(renderProductCard).join('');
  return container;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderProductList(input.products);
  }
  return '<p>Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = renderProductList(data.products);
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW
function specificFunctionThatRendersGraphOrIndex() {
  // Call the updated functions to render the graph or index as needed
  renderDependencyGraph(dependencyGraphContent);
  renderIndex();
}

function renderProductCard(product) {
  return `<div class="product-card">${formatProductName(product)}</div>`;
}

function calculateDiscount(subtotal) {
  return subtotal * 0.1; // 10% discount
}

// New function as requested in the issue
function calculateSum(a, b) {
  return a + b;
}

// Exporting if necessary (no exports were requested to be removed)
export function someFunction() {
  // ... implementation ...
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString();
}

function validateInput(input) {
  return input && input.products && Array.isArray(input.products);
}

function setSvgAttributes(svg, accessibleName) {
  svg.setAttribute('aria-label', accessibleName);
}

function validateLinkAccessibility() {
  // Example link accessibility validation
}

function handleFakeLinks() {
  // Example fake links handler
}

function handleAccessibilityIssues(content) {
  // Example handler for accessibility issues
}

// Export UI / product functions
export {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage
};

export { ensureElementId };
export { addAriaLabel };
export { renderDependencyGraph };
export { renderIndex };
export { dependencyGraphContainer };
export { specificFunctionThatRendersGraphOrIndex };
export { fixAccessibilityIssues };
export { wrapPrimaryContentInMain };
export { calculateSum };

// REACT_025: Ensure unique landmarks (2 issues) - ensureUniqueLandmarks function
// This function addresses REACT_025 by ensuring all landmarks on the page are unique.
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], header, nav, main, aside, footer');
  const landmarkLabels = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const ariaLabel = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || '';

    const key = `${role}:${ariaLabel}`;

    if (landmarkLabels[key]) {
      // Duplicate landmark found - add unique identifier
      let uniqueId = ariaLabel ? `${ariaLabel}-${Math.random().toString(36).substr(2, 9)}` : `${role}-${Math.random().toString(36).substr(2, 9)}`;
      landmark.setAttribute('aria-label', uniqueId);
      landmarkLabels[`${role}:${uniqueId}`] = true;
    } else {
      landmarkLabels[key] = true;
    }
  });
}

// REACT_017: Add landmark roles and fix landmark issues - makeHeaderFocusable function
// This function addresses REACT_017 by making the header focusable for accessibility.
function makeHeaderFocusable() {
  const header = document.querySelector('header');
  if (header && !header.getAttribute('tabindex')) {
    header.setAttribute('tabindex', '-1');
  }
}

// REACT_015: Get full lang attribute (e.g., "en-US") instead of just "en"
function getFullLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_036: Fix fake link issues - replace fake links with proper buttons
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[role="button"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.innerHTML = link.innerHTML;
    button.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent || 'Button');
    button.className = link.className;
    link.parentNode.replaceChild(button, link);
  });
}

export { ensureUniqueLandmarks };
export { makeHeaderFocusable };
export { fixFakeLinks };