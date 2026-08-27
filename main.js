// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinks)

/**
 * Add lang attribute to HTML element for accessibility (REACT_015)
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (default: 'en')
 * @returns {boolean} - Whether the operation was successful
 */
function addLangAttribute(doc, lang = 'en') {
  if (!doc || !doc.documentElement) return false;
  
  const html = doc.documentElement;
  html.setAttribute('lang', lang);
  
  return true;
}

/**
 * Fix table structure issues for accessibility (REACT_027)
 * @param {Document} doc - The document object
 * @returns {number} - Number of tables fixed
 */
function fixTableStructure(doc) {
  let tablesFixed = 0;
  const tables = doc.querySelectorAll('table');
  
  tables.forEach(table => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    if (!thead && table.rows.length > 0) {
      const newThead = doc.createElement('thead');
      const firstRow = table.rows[0];
      
      if (firstRow.parentNode === table) {
        table.insertBefore(newThead, firstRow);
        newThead.appendChild(firstRow);
        tablesFixed++;
      }
    }
    
    if (!tbody && table.rows.length > 1) {
      const newTbody = doc.createElement('tbody');
      const rows = Array.from(table.rows).slice(1);
      rows.forEach(row => {
        table.removeChild(row);
        newTbody.appendChild(row);
      });
      table.appendChild(newTbody);
      tablesFixed++;
    }
    
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
        tablesFixed++;
      }
    });
  });
  
  return tablesFixed;
}

/**
 * Add or fix main landmark for accessibility (REACT_017)
 * @param {Document} doc - The document object
 * @returns {boolean} - Whether the operation was successful
 */
function addMainLandmark(doc) {
  let main = doc.querySelector('main');
  let added = false;
  
  if (!main) {
    const header = doc.querySelector('header');
    main = doc.createElement('main');
    
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(main, header.nextSibling);
    } else if (doc.body) {
      doc.body.insertBefore(main, doc.body.firstChild);
    }
    added = true;
  }
  
  if (!main.id) {
    main.id = 'main-content';
  }
  
  if (!main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  
  return added;
}

/**
 * Add accessible names to SVGs for accessibility (REACT_041)
 * @param {Document} doc - The document object
 * @returns {number} - Number of SVGs fixed
 */
function addSvgAccessibleNames(doc) {
  let svgsFixed = 0;
  const svgs = doc.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      const title = doc.createElement('title');
      title.textContent = 'Decorative graphic';
      title.setAttribute('id', `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
      
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      
      svg.setAttribute('aria-labelledby', title.getAttribute('id'));
      svgsFixed++;
    }
  });
  
  return svgsFixed;
}

/**
 * Ensure unique landmarks for accessibility (REACT_025)
 * @param {Document} doc - The document object
 * @returns {number} - Number of landmarks made unique
 */
function ensureUniqueLandmarks(doc) {
  let landmarksFixed = 0;
  const landmarkSelectors = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
  const usedIds = new Set();
  
  function generateUniqueId(baseId) {
    let id = baseId;
    let counter = 1;
    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }
    return id;
  }
  
  doc.querySelectorAll('[id]').forEach(el => {
    usedIds.add(el.id);
  });
  
  landmarkSelectors.forEach(selector => {
    const elements = doc.querySelectorAll(selector);
    let count = 0;
    
    elements.forEach(el => {
      const isLandmark = el.tagName.toLowerCase() === selector || 
                         el.getAttribute('role') === selector;
      
      if (isLandmark || ['header', 'nav', 'main', 'footer', 'aside'].includes(selector)) {
        if (count > 0 && !el.id) {
          el.id = generateUniqueId(`${selector}-landmark`);
          landmarksFixed++;
        }
        count++;
      }
    });
  });
  
  return landmarksFixed;
}

/**
 * Fix fake links for accessibility (REACT_036)
 * @param {Document} doc - The document object
 * @returns {number} - Number of fake links fixed
 */
function fixFakeLinks(doc) {
  let linksFixed = 0;
  const clickableElements = doc.querySelectorAll('[onclick]');
  
  clickableElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    const isAnchor = tagName === 'a' && el.getAttribute('href');
    
    if (!isAnchor && !el.getAttribute('role')) {
      const hasHref = el.hasAttribute('href');
      const isClickable = el.style.cursor === 'pointer' || 
                          window.getComputedStyle(el).cursor === 'pointer';
      
      if (hasHref || isClickable) {
        el.setAttribute('role', 'link');
        el.setAttribute('tabindex', '0');
        linksFixed++;
      }
    }
  });
  
  return linksFixed;
}

/**
 * MyComponent - React component with accessibility enhancements
 * Includes ARIA roles for better tab focusability on interactive elements
 */
import React from 'react';

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  return (
    <div>
      {/* Existing component JSX */}

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />
    </div>
  );
};

// Export MyComponent
export default MyComponent;

module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  MyComponent
};