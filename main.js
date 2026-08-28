// main.js - Accessibility improvements implementation

/**
 * Accessibility improvement functions for main.js
 * Addressing issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix table structure issues
 * - REACT_017: Add/fix landmark issues
 * - REACT_041: Add accessible names to SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix fake link issue
 */

// main.js

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      updateThScopeAttribute(filePath);
    });

  // REACT_015: Ensure the <html> element has a lang attribute for accessibility
  if (!document.documentElement.lang) {
    document.documentElement.setAttribute('lang', 'en');
  }

  // Import accessibility helper functions
  const {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
  } = require('./accessibilityHelperFunctions');

  // Wrap the entire document content inside a <main> element and set its lang attribute
  const mainElement = document.createElement('main');
  document.documentElement.setAttribute('lang', 'en');
  document.body.appendChild(mainElement);

  // Add skip link for accessibility
  const existingSkipLink = document.querySelector('.skip-link, [href="#main-content"]');
  if (!existingSkipLink) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';

    const body = document.querySelector('body');
    if (body) {
      body.insertBefore(skipLink, body.firstChild);
    }
  }

  return document.documentElement.outerHTML;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} htmlString - HTML content with SVGs
 * @returns {string} HTML with accessible SVG names
 */
function addSvgAccessibleNames(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  const svgs = doc.querySelectorAll('svg');
  let svgCount = 0;

  svgs.forEach(svg => {
    // Check if SVG already has an accessible name
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      const title = doc.createElement('title');
      title.textContent = `SVG icon ${svgCount + 1}`;
      title.id = `svg-title-${svgCount + 1}`;

      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', title.id);
    }
    svgCount++;
  });

  return doc.documentElement.outerHTML;
}

/**
 * Ensures unique landmarks in the document
 * @param {string} htmlString - HTML content
 * @returns {string} HTML with unique landmarks
 */
function ensureUniqueLandmarks(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Ensure only one main landmark
  const mainElements = doc.querySelectorAll('main');
  if (mainElements.length > 1) {
    // Keep the first main element, convert others to divs
    for (let i = 1; i < mainElements.length; i++) {
      const newDiv = doc.createElement('div');
      newDiv.setAttribute('role', 'main');
      mainElements[i].parentNode.replaceChild(newDiv, mainElements[i]);
    }
  }

  // Add unique labels to repeated landmarks
  const landmarks = ['header', 'nav', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = doc.querySelectorAll(landmark);
    if (elements.length > 1) {
      let count = 0;
      elements.forEach(el => {
        if (!el.getAttribute('aria-label') && !el.id) {
          el.setAttribute('aria-label', `${landmark}-${count + 1}`);
        }
        count++;
      });
    }
  });

  return doc.documentElement.outerHTML;
}

/**
 * Fixes fake link issues (links that don't navigate properly)
 * @param {string} htmlString - HTML content
 * @returns {string} HTML with fixed fake links
 */
function fixFakeLinkIssue(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Find links that use onclick or javascript: but should be proper links
  const links = doc.querySelectorAll('a[href^="javascript:"], a[onclick]');

  links.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const href = link.getAttribute('href');

    // If it's a fake link (no valid href), convert to button or add proper href
    if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
      const onclickAttr = link.getAttribute('onclick');

      // If it has onclick functionality, convert to button
      if (onclickAttr && !href.startsWith('javascript:')) {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');

        // Copy all attributes
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            button.setAttribute(attr.name, attr.value);
          }
        });

        // Copy inner content
        button.innerHTML = link.innerHTML;

        link.parentNode.replaceChild(button, link);
      }
    }
  });

  return doc.documentElement.outerHTML;
}

/**
 * Main function to apply all accessibility fixes
 *