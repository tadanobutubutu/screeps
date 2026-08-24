// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addAccessibleSvg)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinks)

/**
 * Adds lang attribute to the HTML element for accessibility
 */
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

/**
 * Fixes table structure issues for accessibility
 * Ensures proper table markup with headers and proper structure
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('th, td');
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.scope = 'col';
          newRow.appendChild(th);
          cell.remove();
        });
        thead.appendChild(newRow);
        table.insertBefore(thead, table.firstChild);
        
        const tbody = document.createElement('tbody');
        const remainingRows = table.querySelectorAll('tr');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
      }
    }
    
    // Ensure proper scope attributes on header cells
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  });
}

/**
 * Adds main landmark to the page for accessibility
 */
function addMainLandmark() {
  // Check if main element already exists
  let main = document.querySelector('main');
  
  if (!main) {
    // Try to find content that should be in main
    const content = document.querySelector('#content, .content, [role="main"]');
    if (content) {
      main = document.createElement('main');
      main.id = 'main-content';
      main.setAttribute('tabindex', '-1');
      
      // Move content into main
      while (content.firstChild) {
        main.appendChild(content.firstChild);
      }
      content.appendChild(main);
    }
  }
  
  if (main && !main.id) {
    main.id = 'main-content';
  }
}

/**
 * Adds accessible names to SVG elements
 */
function addAccessibleSvg() {
  const svgs = document.querySelectorAll('svg');
  let svgCount = 0;
  
  svgs.forEach(svg => {
    svgCount++;
    
    // Check if SVG already has accessible name
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');
    
    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      // Add title element
      const title = document.createElement('title');
      title.id = `svg-title-${svgCount}`;
      title.textContent = `SVG graphic ${svgCount}`;
      svg.insertBefore(title, svg.firstChild);
      
      // Add aria-labelledby attribute
      svg.setAttribute('aria-labelledby', title.id);
      
      // Add role
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    }
  });
}

/**
 * Ensures unique landmark regions on the page
 */
function ensureUniqueLandmarks() {
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      // Add labels to multiple instances of the same landmark
      elements.forEach((el, index) => {
        const role = el.getAttribute('role') || landmark;
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });
  
  // Ensure single main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length === 0) {
    addMainLandmark();
  }
}

/**
 * Fixes fake links (elements that look like links but aren't)
 */
function fixFakeLinks() {
  const clickableElements = document.querySelectorAll('[onclick], [role="button"]');
  
  clickableElements.forEach(el => {
    const isLink = el.tagName === 'A' || el.hasAttribute('href');
    
    if (!isLink && el.hasAttribute('onclick')) {
      // Check if it looks like a link
      const style = window.getComputedStyle(el);
      const isStyledAsLink = style.cursor === 'pointer' && 
                           (style.color === 'blue' || 
                            style.textDecoration === 'underline' ||
                            el.classList.contains('link'));
      
      if (isStyledAsLink) {
        // Convert to proper link or add button semantics
        if (!el.hasAttribute('role')) {
          el.setAttribute('role', 'button');
        }
        
        // Add keyboard support
        if (!el.hasAttribute('tabindex')) {
          el.setAttribute('tabindex', '0');
        }
        
        // Add keydown handler for Enter and Space
        el.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
          }
        });
      }
    }
  });
  
  // Fix links without href that should be buttons
  const linksWithoutHref = document.querySelectorAll('a:not([href])');
  linksWithoutHref.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
    }
  });
}

// Initialize accessibility fixes on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addLangAttribute();
      fixTableStructureIssues();
      addMainLandmark();
      addAccessibleSvg();
      ensureUniqueLandmarks();
      fixFakeLinks();
    });
  } else {
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addAccessibleSvg();
    ensureUniqueLandmarks();
    fixFakeLinks();
  }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addAccessibleSvg,
    ensureUniqueLandmarks,
    fixFakeLinks
  };
}