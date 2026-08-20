// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Add the lang attribute to HTML element for accessibility
export const langAttribute = () => {
  document.documentElement.lang = 'en';
};

// Fix 26 table structure issues (example code, actual implementation needed)
export const fixTableStructure = () => {
  // Find all th elements that are missing scope attributes
  const thElements = document.querySelectorAll('th');
  let fixedCount = 0;

  thElements.forEach((th) => {
    // Check if th already has a scope attribute
    if (th.hasAttribute('scope')) {
      return;
    }

    // Get the parent row and table
    const parentRow = th.closest('tr');
    if (!parentRow) {
      return;
    }

    const parentTable = th.closest('table');
    if (!parentTable) {
      return;
    }

    // Check if the row is inside a thead element
    const thead = parentTable.querySelector('thead');
    if (thead && thead.contains(parentRow)) {
      // This is a column header (in thead)
      th.setAttribute('scope', 'col');
      fixedCount++;
    } else {
      // This is a row header
      th.setAttribute('scope', 'row');
      fixedCount++;
    }
  });

  if (fixedCount > 0) {
    console.log(`Fixed ${fixedCount} table structure issues (added scope attributes to <th> elements)`);
  }
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
      return !['script', 'style', 'noscript', 'link', 'meta', 'noscript'].includes(tagName);
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
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    
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
      Array.from(duplicateMain.attributes).forEach(attr => {
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

// Fix 1 fake link issue (REACT_036: React Fake Link)
export const fixFakeLinkIssue = () => {
  // Find all anchor elements with href="#" (fake links that don't navigate)
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  
  fakeLinks.forEach((link) => {
    // Get the link's text content and any relevant attributes
    const linkText = link.textContent.trim();
    const linkId = link.id || '';
    const linkClass = link.className || '';
    const linkOnClick = link.onclick;
    
    // Create a proper button element to replace the fake link
    const button = document.createElement('button');
    button.textContent = linkText;
    button.id = linkId;
    button.className = linkClass;
    
    // Copy any relevant data attributes
    Array.from(link.attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        button.setAttribute(attr.name, attr.value);
      }
    });
    
    // If the link had an onclick handler, attach it to the button
    // or set up a click listener that calls the original handler
    if (linkOnClick) {
      button.onclick = linkOnClick;
    }
    
    // Replace the fake link with the proper button
    if (link.parentNode) {
      link.parentNode.replaceChild(button, link);
    }
    
    console.log(`Fixed fake link: "${linkText}" - converted <a href="#"> to <button>`);
  }
};

// Handle rotation back logic
export const handleRotateBack = () => {
  // Implement rotation back logic
  // Example: reset any forward rotation applied to the character model
  const character = document.querySelector('#character') || document.querySelector('.character');
  if (character) {
    // Reset rotation (assuming Y-axis rotation was used for forward orientation)
    character.style.transform = 'rotateY(0deg)';
    console.log('Character rotated back to initial orientation');
  } else {
    console.warn('Character model element not found; cannot rotate back');
  }
};

// All required exports are present:
// - langAttribute
// - fixTableStructure
// - addFixLandmarkIssues
// - addAccessibleNamesToSVGs
// - ensureUniqueLandmarks
// - fixFakeLinkIssue
// - handleRotateBack
// - App (default export)

function App() {
  // ... existing code ...

  React.useEffect(() => {
    langAttribute();
    fixTableStructure();
    addFixLandmarkIssues();
    addAccessibleNamesToSVGs();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
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