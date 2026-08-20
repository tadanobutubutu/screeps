// main.js
// ... existing code ...

// To address the issue, add the language attribute to the root element if it's not already there.
// This is typically done in the HTML template file, not in the JavaScript file.

// Since the issue is related to an HTML file, ensure that the following changes are made in the HTML template:
// <html lang="en">
//   <!-- ... rest of the HTML content ... -->
// </html>

// No changes should be made to the JavaScript code in main.js unless they are directly related to the issue.

import React from 'react';
import ReactDOM from 'react-dom';

// Add the lang attribute to HTML element for accessibility
export const langAttribute = () => {
  document.documentElement.lang = 'en';
};

// Fix 26 table structure issues (example code, actual implementation needed)
export const fixTableStructure = () => {
  // This function needs to be implemented according to the specific issues found.
  // Example:
  // const tables = ...
  // tables.forEach((table) => {
  //   // Apply necessary fixes to each table element.
  // });
};

// Add/fix 4 landmark issues (example code, actual implementation needed)
export const addFixLandmarkIssues = () => {
  // Check if there's already a main landmark in the document
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // If no main landmark exists, create one and wrap the primary content
    const body = document.body;
    
    // Create a new main element
    mainElement = document.createElement('main');
    
    // Get all child elements from body that should be wrapped in main
    const children = Array.from(body.children);
    const contentElements = children.filter(child => {
      // Filter out non-content elements like scripts, styles, meta, etc.
      const tagName = child.tagName.toLowerCase();
      return !['script', 'style', 'noscript', 'link', 'meta'].includes(tagName);
    });
    
    if (contentElements.length > 0) {
      // Insert the main element at the beginning of body
      body.insertBefore(mainElement, body.firstChild);
      
      // Move all content elements into the main element
      contentElements.forEach(element => {
        mainElement.appendChild(element);
      });
      
      console.log('Added <main> landmark to page');
    }
  } else {
    console.log('<main> landmark already exists');
  }
};

// Add accessible names to 2 SVGs (fix for REACT_041)
export const addAccessibleNamesToSVGs = () => {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg) => {
    // Check if SVG already has an accessible name via aria-label or aria-labelledby
    const hasAriaLabel = svg.hasAttribute('aria-label') && svg.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby') && svg.getAttribute('aria-labelledby').trim() !== '';
    
    // Check if SVG has a title child element
    const titleElement = svg.querySelector('title');
    const hasTitleChild = titleElement !== null;
    
    // Check if SVG is marked as hidden from screen readers
    const ariaHidden = svg.getAttribute('aria-hidden') === 'true';
    
    // If SVG has no accessible name and is not hidden from screen readers
    if (!hasAriaLabel && !hasAriaLabelledby && !ariaHidden) {
      if (hasTitleChild) {
        // Use the existing title text as aria-label for screen readers
        const titleText = titleElement.textContent;
        svg.setAttribute('aria-label', titleText);
      } else {
        // Check if SVG contains text elements (indicating it may be decorative)
        const textElement = svg.querySelector('text');
        if (textElement) {
          // Add aria-hidden="true" since it contains text but no proper accessible name
          svg.setAttribute('aria-hidden', 'true');
        }
      }
    }
  });
};

// Ensure unique landmarks (2 issues)
// Fix REACT_025: React Unique Landmarks - ensure only one <main> landmark exists
export const ensureUniqueLandmarks = () => {
  // Find all main elements in the document
  const mainElements = document.querySelectorAll('main');
  
  // If there's more than one main element, fix the duplicate(s)
  if (mainElements.length > 1) {
    // Keep the first main element as-is, convert others to section elements
    // This fixes the accessibility violation where multiple main landmarks exist
    for (let i = 1; i < mainElements.length; i++) {
      const duplicateMain = mainElements[i];
      
      // Create a replacement section element with the same attributes
      const sectionReplacement = document.createElement('section');
      
      // Copy all attributes from the main element to the section element
      Array.from(duplicateMain.attributes).forEach((attr) => {
        sectionReplacement.setAttribute(attr.name, attr.value);
      });
      
      // Move all child nodes from main to section
      while (duplicateMain.firstChild) {
        sectionReplacement.appendChild(duplicateMain.firstChild);
      }
      
      // Replace the duplicate main with the section element
      duplicateMain.parentNode.replaceChild(sectionReplacement, duplicateMain);
    }
    
    console.log(`Fixed ${mainElements.length - 1} duplicate <main> landmark(s) - converted to <section> elements`);
  }
};

// Fix 1 fake link issue (example code, actual implementation needed)
export const fixFakeLinkIssue = () => {
  // This function needs to be implemented according to the specific issues found.
  // Example:
  // const fakeLinks = ...
  // fakeLinks.forEach((link) => {
  //   // Remove role attribute or replace with a proper element, like a button.
  // });
};

// Handle rotation back logic
export const handleRotateBack = () => {
  // Implement rotation back logic
  // Example: reset any forward rotation applied to the character model
  const character = document.querySelector('#character');
  if (character) {
    // Reset rotation (assuming Y-axis rotation was used for forward orientation)
    character.style.transform = 'rotateY(0deg)';
    console.log('Character rotated back to initial orientation');
  } else {
    console.warn('Character model element not found; cannot rotate back');
  }
};

// Add scope attributes to table headers in dependency-graph.html
// This is a temporary fix until the HTML can be properly generated with scope attributes
function addScopeAttributesToHeaders() {
  // Select all th elements in the document
  const headers = document.querySelectorAll('th');

  headers.forEach(header => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if it's a column or row header based on context
      if (header.closest('thead')) {
        header.setAttribute('scope', 'col');
      } else if (header.closest('tr')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Add scope attributes to table headers (called on mount)
function addScopeAttributesToHeadersOnMount() {
  addScopeAttributesToHeaders();
}

// React component
function App() {
  React.useEffect(() => {
    langAttribute();
    fixTableStructure();
    addFixLandmarkIssues();
    addAccessibleNamesToSVGs();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
    addScopeAttributesToHeadersOnMount();
    handleRotateBack();
  }, []);

  return (
    <div>
      {/* ... existing JSX ... */}

      <button id="unrotate" onClick={handleRotateBack}>
        rotate back
      </button>

      {/* ... rest of the JSX ... */}
    </div>
  );
}

// ... rest of the existing code ...

// Export App if needed
export default App;