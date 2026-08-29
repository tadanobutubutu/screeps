// main.js
// Implementation of unique landmark functions

// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    const candidate = `${baseName}-${Date.now()}`;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${candidate}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
  return document.documentElement.lang || '';
}

/**
 * Function to replace `my-button` with actual button id
 */
function replaceMyButtonId() {
  // Find the element with the `my-button` class and replace the class with the actual id.
  // Assuming you have already set the id on the button element in your code
  const button = document.querySelector('.my-button');
  if (button) {
    button.id = 'exampleButton';
  }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';
  
  // Create navigation landmark
  const nav = document.querySelector('nav') || document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';
  
  // Create banner/header landmark
  const header = document.querySelector('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';
  
  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';
  
  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('[aria-controls]');
  collapsibles.forEach(element => {
    if (!element.hasAttribute('aria-expanded')) {
      element.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add aria-labels to form inputs that don't have labels
  const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // Add required aria attributes to form controls
  const formControls = document.querySelectorAll('button, input, select, textarea');
  
  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (!control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')) {
      const label = control.id ? document.querySelector(`label[for="${control.id}"]`) : null;
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }
    
    // Mark required fields appropriately
    if (control.hasAttribute('required') && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

/**
 * Adds lang attribute to the HTML element if missing.
 * @returns {void}
 */
function addLangAttribute() {
  if (!document.documentElement.lang) {
    document.documentElement.lang = 'en';
  }
}

/**
 * Ensures there is a single main landmark by removing duplicate main elements.
 * @returns {void}
 */
function addMainLandmark() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    // Keep the first main landmark and remove others
    for (let i = 1; i < mains.length; i++) {
      const main = mains[i];
      const content = main.innerHTML;
      mains[0].insertAdjacentHTML('beforeend', content);
      main.remove();
    }
  } else if (mains.length === 1) {
    mains[0].setAttribute('role', 'main');
    mains[0].id = mains[0].id || 'main-content';
  }
}

/**
 * Fixes table structure issues by adding proper headers and scope attributes.
 * @returns {void}
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, tableIndex) => {
    const caption = table.querySelector('caption');
    if (!caption) {
      const cap = document.createElement('caption');
      cap.textContent = `Table ${tableIndex + 1}`;
      table.insertBefore(cap, table.firstChild);
    }
    
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const cells = firstRow.querySelectorAll('td, th');
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.scope = 'col';
          th.innerHTML = cell.innerHTML;
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
    
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
    
    const bodyCells = table.querySelectorAll('td');
    const colCount = Math.max(0, ...Array.from(table.querySelectorAll('tr')).map(tr => 
      tr.querySelectorAll('td, th').length));
    
    let rowIndex = 0;
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      if (rowIndex > 0) {
        const cells = row.querySelectorAll('td, th');
        cells.forEach((cell, cellIndex) => {
          if (cell.tagName.toLowerCase() === 'td') {
            cell.setAttribute('headers', `row${rowIndex}-col${cellIndex + 1}`);
          }
        });
      }
      rowIndex++;
    });
  });
}

/**
 * Adds accessible names to SVG elements that are missing them.
 * @returns {void}
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let svgCounter = 1;
  
  svgs.forEach(svg => {
    const hasTitle = svg.querySelector('title');
    const hasDesc = svg.querySelector('desc');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaHidden = svg.getAttribute('aria-hidden');
    
    if (!ariaHidden && (!ariaLabel || (!hasTitle && !hasDesc))) {
      if (!ariaLabel) {
        svg.setAttribute('aria-label', `Icon ${svgCounter}`);
      }
      
      if (!hasTitle) {
        const title = document.createElement('title');
        title.textContent = `Icon ${svgCounter}`;
        svg.insertBefore(title, svg.firstChild);
      }
      
      if (!hasDesc && svg.getAttribute('role') !== 'img') {
        svg.setAttribute('role', 'img');
      }
      
      svgCounter++;
    }
  });
}

/**
 * Fixes fake link issues by converting non-anchor elements with link roles to actual links.
 * @returns {void}
 */
function fixFakeLinkIssue() {
  // Find elements with link role but not actual anchor elements
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href') || link.getAttribute('data-href') || '#';
    const newLink = document.createElement('a');
    newLink.href = href;
    newLink.innerHTML = link.innerHTML;
    
    // Copy over relevant attributes
    const attrs = ['aria-label', 'aria-describedby', 'title', 'class', 'id'];
    attrs.forEach(attr => {
      const val = link.getAttribute(attr);
      if (val) {
        newLink.setAttribute(attr, val);
      }
    });
    
    // Copy event listeners by replacing in place
    link.parentNode.replaceChild(newLink, link);
  });
  
  // Also handle common fake link patterns
  const onClickLinks = document.querySelectorAll('[onclick*="location"], [onclick*="window.location"]');
  onClickLinks.forEach(element => {
    if (!element.getAttribute('href') && element.getAttribute('onclick')) {
      const onclick = element.getAttribute('onclick');
      // Try to extract URL from onclick
      const match = onclick.match(/(?:location\.href|window\.location\.href|window\.location)=(['"])([^'"]+)\1/);
      if (match && match[2]) {
        const newLink = document.createElement('a');
        newLink.href = match[2];
        newLink.innerHTML = element.innerHTML;
        
        // Copy attributes
        const attrs = ['aria-label', 'aria-describedby', 'title', 'class', 'id'];
        attrs.forEach(attr => {
          const val = element.getAttribute(attr);
          if (val) {
            newLink.setAttribute(attr, val);
          }
        });
        
        element.parentNode.replaceChild(newLink, element);
      }
    }
  });
}

// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

replaceMyButtonId();

addLangAttribute();
addProperLandmarkRegions();
addMainLandmark();
fixTableStructureIssues();
addSvgAccessibleNames();
fixFakeLinkIssue();
addProperAccountManagement();
addAriaToFormControls();

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  addLangAttribute,
  addMainLandmark,
  fixTableStructureIssues,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};