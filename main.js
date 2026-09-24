// TODO: This is the existing code that needs to be preserved

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for accessibility
 * @param {Document} doc - The document object to modify
 * @param {string} lang - The language code to set (default: 'en')
 */
function addLangAttribute(doc = document, lang = 'en') {
  if (!doc || !doc.documentElement) return;
  const html = doc.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html.getAttribute('lang');
}

/**
 * REACT_027: Fix 26 table structure issues
 * Ensures tables have proper accessibility structure with headers and captions
 * @param {Document} doc - The document object to modify
 */
function fixTableStructureIssues(doc = document) {
  if (!doc) return;
  const tables = doc.querySelectorAll('table');
  tables.forEach((table, index) => {
    // Ensure tables have proper semantic structure
    if (!table.querySelector('caption')) {
      const caption = doc.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      caption.style.cssText = 'caption-side: top; font-weight: bold; padding: 8px;';
      table.insertBefore(caption, table.firstChild);
    }
    
    // Ensure tables have proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const cells = firstRow.querySelectorAll('td');
        cells.forEach(cell => {
          const th = doc.createElement('th');
          th.textContent = cell.textContent;
          th.scope = 'col';
          cell.parentNode.replaceChild(th, cell);
        });
      }
    } else {
      headers.forEach(th => {
        if (!th.hasAttribute('scope')) {
          th.setAttribute('scope', 'col');
        }
      });
    }
  });
  return tables.length;
}

/**
 * REACT_017: Add/fix 2 landmark issues
 * Ensures proper use of landmark elements for screen readers
 * @param {Document} doc - The document object to modify
 */
function addMainLandmark(doc = document) {
  if (!doc) return;
  let mainElements = doc.querySelectorAll('main');
  
  // If no main element exists, create one
  if (mainElements.length === 0) {
    const main = doc.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('id', 'main-content');
    
    // Move body content into main
    const body = doc.body;
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
    mainElements = [main];
  } else {
    // Ensure existing main has proper attributes
    mainElements.forEach(main => {
      if (!main.id) {
        main.setAttribute('id', 'main-content');
      }
    });
  }
  
  return mainElements.length;
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Ensures all SVG elements have accessible titles and descriptions
 * @param {Document} doc - The document object to modify
 */
function addSvgAccessibleName(doc = document) {
  if (!doc) return;
  const svgs = doc.querySelectorAll('svg');
  let count = 0;
  
  svgs.forEach((svg, index) => {
    // Check if SVG already has a title
    let title = svg.querySelector('title');
    
    if (!title) {
      title = doc.createElement('title');
      title.textContent = `SVG image ${index + 1}`;
      title.id = `svg-title-${index}`;
      svg.insertBefore(title, svg.firstChild);
      count++;
    }
    
    // Add aria-labelledby to reference the title
    if (!svg.hasAttribute('aria-labelledby') && !svg.hasAttribute('aria-label')) {
      svg.setAttribute('aria-labelledby', title.id);
    }
    
    // Add role="img" if not present
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  
  return count;
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures only one main landmark and proper landmark structure
 * @param {Document} doc - The document object to modify
 */
function ensureUniqueLandmarks(doc = document) {
  if (!doc) return;
  
  // Get all main elements
  const mainElements = doc.querySelectorAll('main');
  
  // Keep only the first main element
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      const main = mainElements[i];
      // Replace additional main elements with divs
      const div = doc.createElement('div');
      div.setAttribute('role', 'main');
      div.setAttribute('aria-label', `Section ${i}`);
      while (main.firstChild) {
        div.appendChild(main.firstChild);
      }
      main.parentNode.replaceChild(div, main);
    }
  }
  
  // Ensure proper header, nav, footer landmarks
  const header = doc.querySelector('header');
  if (!header) {
    const newHeader = doc.createElement('header');
    newHeader.setAttribute('role', 'banner');
    doc.body.insertBefore(newHeader, doc.body.firstChild);
  }
  
  const nav = doc.querySelector('nav');
  if (!nav) {
    const newNav = doc.createElement('nav');
    newNav.setAttribute('role', 'navigation');
    newNav.setAttribute('aria-label', 'Main navigation');
    doc.body.insertBefore(newNav, doc.body.firstChild);
  }
  
  const footer = doc.querySelector('footer');
  if (!footer) {
    const newFooter = doc.createElement('footer');
    newFooter.setAttribute('role', 'contentinfo');
    doc.body.appendChild(newFooter);
  }
  
  return {
    mainCount: mainElements.length,
    headerExists: !!doc.querySelector('header'),
    navExists: !!doc.querySelector('nav'),
    footerExists: !!doc.querySelector('footer')
  };
}

/**
 * REACT_036: Fix 1 fake link issue
 * Converts elements that look like links but aren't to proper anchor elements
 * @param {Document} doc - The document object to modify
 */
function fixFakeLinkIssue(doc = document) {
  if (!doc) return;
  let count = 0;
  
  // Find elements with onclick that behave like links but aren't anchors
  const fakeLinks = doc.querySelectorAll('[onclick], [role="button"]');
  
  fakeLinks.forEach(element => {
    const hasHref = element.hasAttribute('href');
    const isAnchor = element.tagName === 'A';
    const hasOnClick = element.hasAttribute('onclick');
    
    // Check if it's a fake link (has onclick, no href, not an anchor)
    if (hasOnClick && !hasHref && !isAnchor) {
      // Convert to an anchor element
      const anchor = doc.createElement('a');
      anchor.setAttribute('href', '#');
      anchor.setAttribute('role', 'button');
      
      // Copy all attributes
      Array.from(element.attributes).forEach(attr => {
        if (attr.name !== 'href') {
          anchor.setAttribute(attr.name, attr.value);
        }
      });
      
      // Copy content
      anchor.innerHTML = element.innerHTML;
      
      // Replace element
      element.parentNode.replaceChild(anchor, element);
      count++;
    }
  });
  
  return count;
}

// Export all accessibility functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleName,
    ensureUniqueLandmarks,
    fixFakeLinkIssue
  };
}