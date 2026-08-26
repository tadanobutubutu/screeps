// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * REACT_015
 * @param {Document} document - The document object
 * @param {string} lang - The language code to set (default: 'en')
 * @returns {HTMLElement} The html element with lang attribute
 */
function addLangAttribute(document, lang = 'en') {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Fixes table structure issues for accessibility
 * REACT_027
 * @param {NodeList|Array} tables - Collection of table elements
 * @returns {Array} Array of fixed table elements
 */
function fixTableStructure(tables) {
  const fixedTables = [];
  
  tables.forEach(table => {
    // Ensure tables have proper structure: thead, tbody, and th elements
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
      }
    }
    
    // Wrap all rows in tbody if not present
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      const tbody = document.createElement('tbody');
      rows.forEach(row => tbody.appendChild(row));
      table.appendChild(tbody);
    }
    
    // Ensure header cells have proper th elements
    const headerCells = table.querySelectorAll('thead td');
    headerCells.forEach(cell => {
      const th = document.createElement('th');
      th.innerHTML = cell.innerHTML;
      Array.from(cell.attributes).forEach(attr => th.setAttribute(attr.name, attr.value));
      cell.parentNode.replaceChild(th, cell);
    });
    
    fixedTables.push(table);
  });
  
  return fixedTables;
}

/**
 * Adds or fixes main landmark for accessibility
 * REACT_017
 * @param {Document} document - The document object
 * @returns {HTMLElement|null} The main element
 */
function addMainLandmark(document) {
  let main = document.querySelector('main');
  
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('role', 'main');
    
    // Move existing content into main or insert as wrapper
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  } else if (!main.id && !main.getAttribute('aria-label')) {
    // Ensure existing main has proper labeling
    main.setAttribute('role', 'main');
  }
  
  return main;
}

/**
 * Ensures unique landmarks for accessibility
 * REACT_025
 * @param {Document} document - The document object
 * @returns {Map} Map of landmark elements with their assigned IDs
 */
function ensureUniqueLandmarks(document) {
  const landmarkMap = new Map();
  const counters = {
    nav: 0,
    header: 0,
    footer: 0,
    aside: 0,
    section: 0,
    main: 0
  };
  
  const existingIds = new Set();
  document.querySelectorAll('[id]').forEach(el => existingIds.add(el.id));
  
  const landmarks = document.querySelectorAll('nav, header, footer, aside, section[aria-label], main');
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const key = role || tagName;
    
    // Skip if already has proper labeling
    if (landmark.id && landmark.getAttribute('aria-label')) {
      landmarkMap.set(landmark, landmark.id);
      return;
    }
    
    // Generate unique ID
    let baseId = role || tagName;
    counters[key] = (counters[key] || 0) + 1;
    let newId = `${baseId}-${counters[key]}`;
    
    // Ensure uniqueness
    while (existingIds.has(newId)) {
      counters[key]++;
      newId = `${baseId}-${counters[key]}`;
    }
    
    // Add ID if missing
    if (!landmark.id) {
      landmark.id = newId;
      existingIds.add(newId);
    }
    
    // Add aria-label if missing and has role
    if (role && !landmark.getAttribute('aria-label')) {
      landmark.setAttribute('aria-label', role.charAt(0).toUpperCase() + role.slice(1).replace(/-/g, ' '));
    }
    
    landmarkMap.set(landmark, landmark.id || newId);
  });
  
  return landmarkMap;
}

/**
 * Adds accessible names to SVG elements
 * REACT_041
 * @param {Document} document - The document object
 * @returns {NodeList} Collection of SVG elements that were labeled
 */
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  
  svgs.forEach((svg, index) => {
    // Check if svg has a title element
    let title = svg.querySelector('title');
    
    if (!title) {
      title = document.createElement('title');
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
    
    // Link title to svg using aria-labelledby
    const titleId = title.id || `svg-title-${index + 1}`;
    if (!title.id) {
      title.id = titleId;
    }
    
    svg.setAttribute('aria-labelledby', titleId);
    
    // Ensure svg has role
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  
  return svgs;
}

/**
 * Fixes fake link issues for accessibility
 * REACT_036
 * @param {Document} document - The document object
 * @returns {NodeList} Collection of fixed elements
 */
function fixFakeLinkIssue(document) {
  // Find elements that look like links but aren't <a> tags
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a), [onclick]:not(a):not(button)');
  const fixed = [];
  
  fakeLinks.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isClickable = element.hasAttribute('onclick') || 
                        element.getAttribute('role') === 'link' ||
                        getComputedStyle(element).cursor === 'pointer';
    
    // If it looks like a link but isn't an anchor
    if (isClickable && tagName !== 'a' && tagName !== 'button') {
      // Convert to proper button or add proper link semantics
      element.setAttribute('role', 'button');
      
      // Add keyboard support
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      
      // Add keyboard activation handler
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
      
      fixed.push(element);
    }
  });
  
  // Also ensure all real links have proper href
  document.querySelectorAll('a:not([href])').forEach(link => {
    if (link.textContent.trim() && !link.getAttribute('href')) {
      // If it's an empty anchor without href, add href="#"
      link.setAttribute('href', '#');
    }
    fixed.push(link);
  });
  
  return fixed;
}

// Export all accessibility functions
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue
};