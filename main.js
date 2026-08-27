// TODO: This is the existing code that needs to be preserved
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createElement } from 'react';

// Helper function to get document reference
function getDocument() {
  return typeof document !== 'undefined' ? document : null;
}

// REACT_015: Add lang attribute to HTML element
function addLangAttribute(documentRef = getDocument()) {
  if (!documentRef) return false;
  
  const htmlElement = documentRef.documentElement || documentRef.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    const lang = htmlElement.getAttribute('xml:lang') || 'en';
    htmlElement.setAttribute('lang', lang);
    return true;
  }
  return false;
}

// REACT_027: Fix table structure issues
function fixTableStructure(table) {
  if (!table) return false;
  
  // Ensure proper table structure with thead, tbody, and tfoot
  if (!table.querySelector('thead')) {
    const thead = table.ownerDocument.createElement('thead');
    const firstRow = table.querySelector('tr');
    if (firstRow) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
  
  // Ensure all rows are within tbody
  const tbody = table.querySelector('tbody') || table.ownerDocument.createElement('tbody');
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    if (row.parentElement !== tbody) {
      tbody.appendChild(row);
    }
  });
  
  if (!table.querySelector('tbody')) {
    table.appendChild(tbody);
  }
  
  return true;
}

// REACT_017: Add main landmark
function addMainLandmark(mainElement) {
  if (!mainElement) return false;
  
  if (!mainElement.hasAttribute('role') && !mainElement.tagName.toLowerCase() === 'main') {
    mainElement.setAttribute('role', 'main');
  }
  return true;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container = getDocument()) {
  if (!container) return false;
  
  const landmarks = ['banner', 'navigation', 'main', 'contentinfo', 'complementary'];
  let fixed = false;
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : 'div'}`);
    if (elements.length > 1) {
      // Keep only the first landmark of each type for unique landmarks
      for (let i = 1; i < elements.length; i++) {
        const currentRole = elements[i].getAttribute('role');
        if (landmarks.includes(currentRole)) {
          // Remove role attribute to avoid duplicate landmark
          elements[i].removeAttribute('role');
          fixed = true;
        }
      }
    }
  });
  
  return fixed;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(svgElement, accessibleName) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') return false;
  
  // Add aria-label if not present
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', accessibleName || 'Decorative or informational graphic');
    return true;
  }
  
  return false;
}

// REACT_036: Fix fake link issue
function fixFakeLinkIssue(element) {
  if (!element) return false;
  
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const isClickable = element.getAttribute('role') === 'button' || 
                      element.onclick || 
                      element.style.cursor === 'pointer';
  
  // If element looks like a link but isn't an anchor
  if (isClickable && tagName !== 'a' && tagName !== 'button') {
    // Add button role if it behaves like a link
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'button');
    }
    // Add tabindex for keyboard accessibility
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    return true;
  }
  
  return false;
}

// Trigger accessibility mode (combined)
function triggerAccessibilityMode() {
  const doc = getDocument();
  if (!doc) return false;
  
  // Apply all accessibility fixes
  addLangAttribute(doc);
  
  // Fix tables
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => fixTableStructure(table));
  
  // Fix main landmark
  const mainElement = doc.querySelector('main') || doc.querySelector('[role="main"]');
  if (mainElement) {
    addMainLandmark(mainElement);
  }
  
  // Ensure unique landmarks
  ensureUniqueLandmarks(doc);
  
  // Add accessible names to SVGs
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      addSvgAccessibleNames(svg, 'Graphic element');
    }
  });
  
  // Additional UI mode styling
  if (doc.body) {
    doc.body.classList.add('accessibility-mode');
    doc.body.setAttribute('data-accessibility', 'enabled');
  }
  
  return true;
}

// Implement the handleErrorState function to handle the new accessibility issue
function handleErrorState(errorElement, container, trigger = false) {
  if (!errorElement) return;

  const doc = getDocument();
  if (!doc) return;

  // Wrap the error in a <section> and container element (if provided)
  const errorSection = doc.createElement('section');
  errorSection.setAttribute('role', 'alert');
  errorSection.setAttribute('aria-live', 'polite');
  
  // Clone the error element content into the section
  if (errorElement.innerHTML) {
    errorSection.innerHTML = errorElement.innerHTML;
  }
  
  if (container) {
    const errorContainer = doc.createElement('div');
    errorContainer.setAttribute('class', 'error-container');
    errorContainer.setAttribute('role', 'alert');
    errorContainer.appendChild(errorSection);
    container.appendChild(errorContainer);
  } else {
    // Append directly to body or document
    const target = doc.body || doc.documentElement;
    target.appendChild(errorSection);
  }

  // If trigger is true, trigger the accessibility mode
  if (trigger) {
    triggerAccessibilityMode();
  }
}

// Implement the handleAccessibilityError function that wraps handleErrorState with triggering the accessibility mode
function handleAccessibilityError(errorElement, container) {
  handleErrorState(errorElement, container, true);
}

// Placeholder for updateAriaAttributes (if needed)
function updateAriaAttributes() {
  // TODO: Implement actual functionality if needed
  return false;
}

// Export the existing handleErrorState function
export { handleErrorState };

// Export the new handleAccessibilityError function
export { handleAccessibilityError };

// Export accessibility utility functions
export { 
  addLangAttribute, 
  fixTableStructure, 
  addMainLandmark, 
  ensureUniqueLandmarks, 
  addSvgAccessibleNames, 
  fixFakeLinkIssue,
  triggerAccessibilityMode 
};

// Export updateAriaAttributes
export { updateAriaAttributes };