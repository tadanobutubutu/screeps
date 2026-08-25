const renderDependencyGraph1 = function() {
    // Your implementation here
};
const renderDependencyGraph2 = function() {
    // Your implementation here
};

/**
 * Check if the user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply accessibility attributes to interactive elements
 */
function applyAccessibilityAttributes() {
  const interactiveElements = document.querySelectorAll('a, input, select, textarea');
  
  interactiveElements.forEach(element => {
    if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
      console.warn('Interactive element missing accessible label:', element);
    }
  });
}

// Add lang attribute to HTML element (REACT_015)
const addLangAttribute = function(html) {
    if (html && !html.includes('lang=')) {
        return html.replace(/<html/, '<html lang="en"');
    }
    return html;
};

// Fix table structure issues (REACT_027)
const fixTableStructureIssues = function(tables) {
    return tables.map(table => {
        if (!table.querySelector('thead')) {
            const firstRow = table.querySelector('tr');
            if (firstRow) {
                const thead = document.createElement('thead');
                thead.appendChild(firstRow.cloneNode(true));
                table.insertBefore(thead, table.firstChild);
                firstRow.remove();
            }
        }
        return table;
    });
};

// Add main landmark (REACT_017)
const addMainLandmark = function(content) {
    if (content && !content.includes('<main')) {
        return `<main id="main-content" role="main">${content}</main>`;
    }
    return content;
};

// Add accessible names to SVGs (REACT_041)
const addSvgAccessibleNames = function(svgs) {
    return svgs.map((svg, index) => {
        const existingTitle = svg.querySelector('title');
        if (!existingTitle) {
            const title = document.createElement('title');
            title.textContent = `SVG Icon ${index + 1}`;
            svg.insertBefore(title, svg.firstChild);
        }
        if (!svg.getAttribute('role')) {
            svg.setAttribute('role', 'img');
        }
        if (!svg.getAttribute('aria-labelledby')) {
            const title = svg.querySelector('title');
            if (title) {
                const titleId = `svg-title-${index}`;
                title.id = titleId;
                svg.setAttribute('aria-labelledby', titleId);
            }
        }
        return svg;
    });
};

/**
 * Ensure a main landmark exists in the document for accessibility
 * Wraps the primary content in a <main> element if one doesn't exist
 * @returns {HTMLElement|null} The main element or null if already exists
 */
function ensureMainLandmark() {
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    mainElement = document.createElement('main');
    
    // Find the first table or significant content element to wrap
    const contentElement = document.querySelector('table, .container, #table-rotated, article, section');
    
    if (contentElement && contentElement.parentNode) {
      contentElement.parentNode.insertBefore(mainElement, contentElement);
      mainElement.appendChild(contentElement);
      console.info('Accessibility: Created <main> landmark and wrapped primary content');
    } else if (document.body) {
      // Fallback: wrap all direct body children except header, nav, footer
      const elementsToWrap = Array.from(document.body.children).filter(el => {
        const tagName = el.tagName.toLowerCase();
        return !['header', 'nav', 'footer', 'aside'].includes(tagName) && 
               !el.classList.contains('sr-only');
      });
      
      elementsToWrap.forEach(el => mainElement.appendChild(el));
      document.body.insertBefore(mainElement, document.body.firstChild);
      console.info('Accessibility: Created <main> landmark and wrapped main content');
    }
  }
  
  return mainElement;
}

/**
 * Validate that required landmarks exist on the page
 * @returns {Object} Object containing validation results
 */
function validateLandmarks() {
  const results = {
    hasMain: !!document.querySelector('main'),
    hasHeader: !!document.querySelector('header'),
    hasNav: !!document.querySelector('nav'),
    hasFooter: !!document.querySelector('footer'),
    isValid: false
  };
  
  results.isValid = results.hasMain;
  
  if (!results.hasMain) {
    console.warn('Accessibility: Page is missing <main> landmark. Use ensureMainLandmark() to create one.');
  }
  
  return results;
}

// Ensure unique landmarks (REACT_025)
const ensureUniqueLandmarks = function(landmarks) {
    const seenTypes = {};
    landmarks.forEach(landmark => {
        const type = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role') || type;
        
        if (seenTypes[role]) {
            if (type === 'nav') {
                const label = landmark.getAttribute('aria-label');
                if (!label) {
                    landmark.setAttribute('aria-label', `Navigation ${Object.keys(seenTypes).filter(k => k.includes('nav')).length + 1}`);
                }
            }
        }
        seenTypes[role] = true;
    });
    return landmarks;
};

// Fix fake link issue (REACT_036)
const fixFakeLinkIssue = function(elements) {
    return elements.map(el => {
        const isFakeLink = el.tagName === 'a' && !el.href && !el.getAttribute('role');
        if (isFakeLink) {
            el.setAttribute('role', 'button');
        }
        return el;
    });
};

// ... Existing code ...

// Export the updated functions
module.exports = {
    // ... Existing exports ...
    prefersReducedMotion,
    applyAccessibilityAttributes,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureMainLandmark,
    validateLandmarks,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    renderDependencyGraph1,
    renderDependencyGraph2,
    // ... Add any other exports that were found to be affected by the update ...
};