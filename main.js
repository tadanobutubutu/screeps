// main.js

/**
 * Wraps primary content in a main element for better accessibility
 * @param {Document} document - The document object to wrap
 * @returns {Document} The modified document
 */
function wrapPrimaryContentInMain(document) {
  if (!document || !document.body) {
    return document;
  }

  // Check if main element already exists with main-content id
  const existingMain = document.querySelector('#main-content');
  if (existingMain) {
    return document;
  }

  // Check if any main element exists
  const anyMain = document.querySelector('[role="main"]');
  if (anyMain) {
    // Add id to existing main element if it doesn't have one
    if (!anyMain.id) {
      anyMain.id = 'main-content';
    }
    return document;
  }

  // Create main element and wrap appropriate content
  const main = document.createElement('main');
  main.id = 'main-content';
  main.setAttribute('role', 'main');

  const body = document.body;

  // Get all direct children of body
  const bodyChildren = Array.from(body.childNodes).filter(node => node.nodeType === 1);

  if (bodyChildren.length > 0) {
    // Move children to main element
    bodyChildren.forEach(child => {
      main.appendChild(child);
    });

    // Append main to body
    body.appendChild(main);
  }

  return document;
}

/**
 * Adds proper landmark regions for accessibility
 */
function addProperLandmarkRegions() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  const nav = document.querySelector('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
  }

  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// Add other existing functions and code here...

// ... existing code (preserved) ...

// ... rest of the original code continues here ...

// exports
export { wrapPrimaryContentInMain, addProperLandmarkRegions };