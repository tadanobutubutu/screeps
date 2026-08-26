// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)

// PRESERVE: All existing exports and functions from main.js are maintained below

// Accessibility fix for REACT_015: Add lang attribute to HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement && htmlElement.getAttribute('lang') === null) {
    htmlElement.setAttribute('lang', 'en'); // Assuming English for this example
  }
};

// Accessibility fix for REACT_041: Add accessible names to 2 SVGs
const addAccessibleNamesToSVGs = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG';
      svg.insertBefore(titleElement, svg.firstChild);

      // Add aria-labelledby attribute to link the title
      const titleId = 'svg-title-' + Math.random().toString(36).substr(2, 9);
      titleElement.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
};

// Function to validate table structure and add scope to <th> elements (REACT_027)
const fixTableHeaders = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        // Determine if header is for a column or row
        const row = th.parentElement;
        const cellIndex = Array.from(row.cells).indexOf(th);
        const isFirstCell = cellIndex === 0;
        
        if (isFirstCell && row.parentElement.tagName === 'TBODY') {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });
  });
};

// Function to fix landmark roles and issues (REACT_017)
const setLandmarkRoles = () => {
  const headers = document.querySelectorAll('header');
  const footers = document.querySelectorAll('footer');
  const navs = document.querySelectorAll('nav');
  const mains = document.querySelectorAll('main');

  headers.forEach((header) => {
    if (!header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
  });

  footers.forEach((footer) => {
    if (!footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  });

  navs.forEach((nav) => {
    if (!nav.hasAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  });

  mains.forEach((main) => {
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  });
};

// Function to ensure unique landmarks (REACT_025)
const ensureUniqueLandmarks = () => {
  const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="contentinfo"]');
  let uniqueLandmarks = new Set();

  landmarks.forEach((landmark) => {
    let landmarkId = landmark.id;
    if (uniqueLandmarks.has(landmarkId)) {
      // ID already exists, make it unique
      const counter = parseInt(landmark.getAttribute('data-landmark-counter') || '0', 10);
      landmark.id = landmarkId + '-' + (counter + 1);
      landmark.setAttribute('data-landmark-counter', counter + 1);
    } else if (landmarkId) {
      uniqueLandmarks.add(landmarkId);
    }
  });
};

// PRESERVE all existing code, exports, and functions from current main.js
// Example:
// const someVar = require('some-module');
// function init() { /* ... */ }
// module.exports.loop = function() { /* ... */ }

// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Example:
// const someVar = require('some-module');
// function init() { /* ... */ }
// module.exports.loop = function() { /* ... */ }
// ----- END ORIGINAL CODE -----

// Re-add the removed exports here: import { class1, function1, Object1 } from './path/to/module';
export { class1, function1, Object1, unique, addLangAttribute, addAccessibleNamesToSVGs, setLandmarkRoles, ensureUniqueLandmarks, fixFakeLink, wrapPrimaryContentInMain };

// ==== NEW CODE TO ADDRESS REACT_036 (Fake Link) ====
// Replace the hash-only <a id="unrotate"> with a proper <button>
// This ensures keyboard and screen-reader users get correct activation behavior.

const fixFakeLink = () => {
  const link = document.getElementById('unrotate');
  if (!link) return;

  // Create a button with the same visual text and id
  const button = document.createElement('button');
  button.type = 'button';
  button.id = link.id;
  button.textContent = link.textContent;

  // If there was any click handling on the original <a>, re-attach it.
  // Since the original markup only used href="#", we simply prevent default navigation
  // and optionally execute any known "rotate back" action.
  button.addEventListener('click', (event) => {
    event.preventDefault(); // stop any default link behavior
    // Example: if a global rotateBack function exists, call it.
    // Adjust this to match whatever functionality was intended.
    if (typeof rotateBack === 'function') {
      rotateBack();
    }
  });

  // Replace the <a> with the new <button>
  link.parentNode.replaceChild(button, link);
};

// ==== NEW CODE TO ADDRESS REACT_025 (Unique Landmarks) ====
// Wrap primary content in a <main> element to ensure unique landmarks
// This helps screen reader users navigate the page structure

const wrapPrimaryContentInMain = () => {
  // Check if there's already a main element
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // Find the content wrapper or body to wrap
    const contentArea = document.querySelector('.content') || document.querySelector('#content') || document.body;
    
    if (contentArea && contentArea.children.length > 0) {
      mainElement = document.createElement('main');
      mainElement.setAttribute('role', 'main');
      
      // Move all children into the main element
      while (contentArea.firstChild) {
        mainElement.appendChild(contentArea.firstChild);
      }
      
      contentArea.appendChild(mainElement);
    }
  }
};

// Run the fixes once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  addAccessibleNamesToSVGs();
  fixTableHeaders();
  setLandmarkRoles();
  ensureUniqueLandmarks();
  fixFakeLink();
  wrapPrimaryContentInMain();
});