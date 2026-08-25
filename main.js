// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for accessibility
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (e.g., 'en', 'es')
 */
function addLangAttribute(doc, lang = 'en') {
  if (doc && doc.documentElement) {
    doc.documentElement.lang = lang;
  }
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper semantic structure with headers and captions
 * @param {Document} doc - The document object
 */
function fixTableStructure(doc) {
  if (!doc) return;
  
  const tables = doc.querySelectorAll('table');
  tables.forEach((table, index) => {
    // Ensure tables have captions
    let caption = table.querySelector('caption');
    if (!caption) {
      caption = doc.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.insertBefore(caption, table.firstChild);
    }
    
    // Ensure tables with headers have proper th elements
    const headerCells = table.querySelectorAll('th');
    const dataCells = table.querySelectorAll('td');
    
    if (headerCells.length > 0) {
      // Ensure scope attributes are present
      headerCells.forEach(th => {
        if (!th.getAttribute('scope')) {
          const rows = table.querySelectorAll('tr');
          const firstRow = rows[0];
          if (firstRow && firstRow.contains(th)) {
            th.setAttribute('scope', 'col');
          }
        }
      });
    }
    
    // Ensure proper table structure with thead and tbody
    let thead = table.querySelector('thead');
    let tbody = table.querySelector('tbody');
    
    if (!thead && headerCells.length > 0) {
      thead = doc.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow.cloneNode(true));
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    
    if (!tbody) {
      tbody = doc.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (!row.querySelector('th')) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
  });
}

/**
 * REACT_017: Add/fix landmark issues
 * Ensures proper landmark regions for screen readers
 * @param {Document} doc - The document object
 */
function addLandmarkIssues(doc) {
  if (!doc) return;
  
  // Ensure main landmark exists
  let main = doc.querySelector('main');
  if (!main) {
    main = doc.createElement('main');
    const body = doc.querySelector('body');
    if (body && body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else if (body) {
      body.appendChild(main);
    }
  }
  main.setAttribute('role', 'main');
  
  // Ensure nav landmark with accessible name
  const navs = doc.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Ensure header has banner role if appropriate
  const header = doc.querySelector('header');
  if (header && !header.getAttribute('role')) {
    const hasNav = header.querySelector('nav');
    if (hasNav) {
      header.setAttribute('role', 'banner');
    }
  }
  
  // Ensure footer has contentinfo role if appropriate
  const footer = doc.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

/**
 * REACT_041: Add accessible names to SVGs
 * Ensures all SVG elements have accessible names for screen readers
 * @param {Document} doc - The document object
 */
function addSvgAccessibleNames(doc) {
  if (!doc) return;
  
  const svgs = doc.querySelectorAll('svg');
  let svgCount = 0;
  
  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      const title = doc.createElement('title');
      title.textContent = `SVG graphic ${index + 1}`;
      title.id = `svg-title-${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      svg.setAttribute('aria-labelledby', title.id);
      
      svgCount++;
    }
  });
  
  return svgCount;
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures landmarks have unique accessible names
 * @param {Document} doc - The document object
 */
function ensureUniqueLandmarks(doc) {
  if (!doc) return;
  
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  
  landmarkTypes.forEach(role => {
    const landmarks = doc.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : role}`);
    const seen = new Map();
    
    landmarks.forEach(landmark => {
      const label = landmark.getAttribute('aria-label') || 
                    (landmark.id ? doc.getElementById(landmark.id) : null);
      
      if (label) {
        const currentLabel = typeof label === 'string' ? label : (landmark.id || '');
        if (seen.has(role)) {
          const count = seen.get(role) + 1;
          seen.set(role, count);
          
          if (!landmark.getAttribute('aria-label')) {
            landmark.setAttribute('aria-label', `${role} ${count}`);
          }
        } else {
          seen.set(role, 1);
        }
      }
    });
    
    // Handle multiple landmarks of same type without labels
    const unlabelledLandmarks = Array.from(landmarks).filter(l => 
      !l.getAttribute('aria-label') && !l.getAttribute('aria-labelledby')
    );
    
    unlabelledLandmarks.forEach((landmark, index) => {
      if (unlabelledLandmarks.length > 1) {
        landmark.setAttribute('aria-label', `${role} region ${index + 1}`);
      }
    });
  });
}

/**
 * REACT_036: Fix fake link issue
 * Converts elements that look like links but aren't to proper links or buttons
 * @param {Document} doc - The document object
 */
function fixFakeLinkIssue(doc) {
  if (!doc) return;
  
  const fakeLinks = doc.querySelectorAll('a[href="#"], a[href=""], a[href^="javascript:"]');
  
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href');
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    const isButton = onclick && (onclick.includes('submit') || onclick.includes('button'));
    
    if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
      if (isButton || role === 'button') {
        // Convert to proper button
        const button = doc.createElement('button');
        button.innerHTML = link.innerHTML;
        
        // Copy relevant attributes
        const classes = link.getAttribute('class');
        if (classes) button.setAttribute('class', classes);
        
        if (onclick) {
          button.setAttribute('onclick', onclick);
        }
        
        const tabIndex = link.getAttribute('tabindex');
        if (tabIndex) button.setAttribute('tabindex', tabIndex);
        
        const type = link.getAttribute('type');
        if (type) button.setAttribute('type', type);
        
        link.parentNode.replaceChild(button, link);
      } else {
        // Keep as link but make href valid
        if (href === '#') {
          link.setAttribute('href', '#main-content');
        }
        
        // Ensure proper semantics
        if (!link.getAttribute('role')) {
          link.setAttribute('role', 'link');
        }
        
        // Add screen reader text if needed
        if (link.textContent === link.innerHTML && !link.querySelector('span, img, svg')) {
          const srText = doc.createElement('span');
          srText.className = 'sr-only';
          srText.textContent = ` (link to ${link.textContent})`;
          link.appendChild(srText);
        }
      }
    }
  });
}

// Export functions for use in tests
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addLandmarkIssues,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};