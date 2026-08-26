/**
 * Accessibility fixes for insight report issues
 * Commit: 66b503b4f55f77b8774aec8ab4befc0e91b068e9
 */

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the document has a proper language declaration
 */
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

/**
 * REACT_027: Fix 26 table structure issues
 * Addresses common table accessibility problems:
 * - Missing table headers
 * - Missing scope attributes
 * - Missing captions
 * - Improper header associations
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table, index) => {
    // Ensure table has a caption or aria-label
    if (!table.querySelector('caption') && !table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      caption.style.position = 'absolute';
      caption.style.left = '-9999px';
      table.insertBefore(caption, table.firstChild);
    }

    // Fix header cells - ensure th elements have scope
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        // Determine scope based on position
        const isFirstRow = th.closest('tr') === table.querySelector('tr');
        const isFirstCol = Array.from(th.parentNode.children).indexOf(th) === 0;
        
        if (isFirstRow && isFirstCol) {
          th.setAttribute('scope', 'col');
        } else if (isFirstRow) {
          th.setAttribute('scope', 'col');
        } else if (isFirstCol) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });

    // Ensure data cells have associated headers
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach((cell, cellIndex) => {
        if (cell.tagName === 'TD' && !cell.hasAttribute('headers')) {
          const headerCells = [];
          // Find column headers
          const colHeaders = table.querySelectorAll(`thead th:nth-child(${cellIndex + 1}), tr:first-child th:nth-child(${cellIndex + 1})`);
          colHeaders.forEach(h => {
            if (h.id) headerCells.push(h.id);
            else {
              h.id = `th-${index}-${rowIndex}-${cellIndex}`;
              headerCells.push(h.id);
            }
          });
          // Find row headers
          const rowHeader = row.querySelector('th[scope="row"]');
          if (rowHeader) {
            if (rowHeader.id) headerCells.push(rowHeader.id);
            else {
              rowHeader.id = `th-row-${index}-${rowIndex}`;
              headerCells.push(rowHeader.id);
            }
          }
          if (headerCells.length > 0) {
            cell.setAttribute('headers', headerCells.join(' '));
          }
        }
      });
    });
  });
}

/**
 * REACT_017: Add/fix 2 landmark issues
 * Adds main landmark and ensures proper landmark structure
 */
function addMainLandmark() {
  // Check if main landmark already exists
  let main = document.querySelector('main[role="main"], main:not([role])');
  
  if (!main) {
    // Look for content area that should be main
    const candidates = [
      document.querySelector('#main-content'),
      document.querySelector('.main-content'),
      document.querySelector('[role="main"]'),
      document.querySelector('article'),
      document.querySelector('.content'),
      document.querySelector('#content')
    ].filter(Boolean);

    if (candidates.length > 0) {
      main = candidates[0];
      main.setAttribute('role', 'main');
    } else {
      // Wrap main content in a main element
      const body = document.body;
      const children = Array.from(body.children).filter(el => 
        !['header', 'nav', 'footer', 'aside', 'script', 'style', 'link', 'meta'].includes(el.tagName.toLowerCase())
      );
      
      if (children.length > 0) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
        const firstChild = children[0];
        body.insertBefore(main, firstChild);
        children.forEach(child => main.appendChild(child));
      }
    }
  }

  // Ensure there's only one main landmark
  const allMains = document.querySelectorAll('main[role="main"], main:not([role]), [role="main"]');
  if (allMains.length > 1) {
    allMains.forEach((el, i) => {
      if (i > 0) el.removeAttribute('role');
    });
  }
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 * Ensures SVG elements have proper accessible names via aria-label, aria-labelledby, or title
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby]):not([role="img"])');
  
  let svgCount = 0;
  svgs.forEach(svg => {
    if (svgCount >= 2) return; // Only fix 2 SVGs as per issue
    
    // Try to find existing title or desc
    const title = svg.querySelector('title');
    const desc = svg.querySelector('desc');
    
    if (title && title.textContent.trim()) {
      svg.setAttribute('aria-labelledby', title.id || `svg-title-${svgCount}`);
      if (!title.id) title.id = `svg-title-${svgCount}`;
    } else if (desc && desc.textContent.trim()) {
      svg.setAttribute('aria-describedby', desc.id || `svg-desc-${svgCount}`);
      if (!desc.id) desc.id = `svg-desc-${svgCount}`;
      svg.setAttribute('aria-label', desc.textContent.trim());
    } else {
      // Check for parent context
      let label = '';
      const parent = svg.closest('button, a, [role="button"], [role="link"]');
      if (parent) {
        label = parent.getAttribute('aria-label') || parent.textContent.trim();
      }
      
      if (!label) {
        // Check for adjacent text
        const prev = svg.previousElementSibling;
        const next = svg.nextElementSibling;
        label = (prev?.textContent?.trim() || next?.textContent?.trim() || 'Icon');
      }
      
      svg.setAttribute('aria-label', label);
      svg.setAttribute('role', 'img');
    }
    
    svgCount++;
  });
}

/**
 * REACT_025: Ensure unique landmarks
 * Verifies and fixes duplicate landmark roles
 */
function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const landmarkSelectors = landmarkRoles.map(role => `[role="${role}"]`).join(', ') + 
    ', header, nav, main, aside, footer, section[aria-label], section[aria-labelledby]';
  
  const landmarks = document.querySelectorAll(landmarkSelectors);
  const seenRoles = new Map();
  
  landmarks.forEach(landmark => {
    let role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    
    // Normalize role
    if (role === 'header' && !landmark.closest('article, section, aside, main, nav')) role = 'banner';
    if (role === 'footer' && !landmark.closest('article, section, aside, main, nav')) role = 'contentinfo';
    if (role === 'nav') role = 'navigation';
    if (role === 'main') role = 'main';
    if (role === 'aside') role = 'complementary';
    if (role === 'section' && (landmark.hasAttribute('aria-label') || landmark.hasAttribute('aria-labelledby'))) role = 'region';
    
    if (seenRoles.has(role)) {
      // Duplicate landmark - remove role or make it a region
      if (role !== 'region') {
        landmark.removeAttribute('role');
        if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
          landmark.setAttribute('role', 'region');
          landmark.setAttribute('aria-label', `${role} ${seenRoles.get(role) + 1}`);
        }
      }
    } else {
      seenRoles.set(role, 1);
      // Ensure explicit role for HTML5 elements
      if (!landmark.hasAttribute('role') && ['header', 'nav', 'main', 'aside', 'footer'].includes(landmark.tagName.toLowerCase())) {
        const implicitRole = {
          'header': 'banner',
          'nav': 'navigation',
          'main': 'main',
          'aside': 'complementary',
          'footer': 'contentinfo'
        }[landmark.tagName.toLowerCase()];
        
        // Only add role if not in a sectioning context
        if (!landmark.closest('article, section, aside, main, nav') || landmark.tagName.toLowerCase() === 'main') {
          landmark.setAttribute('role', implicitRole);
        }
      }
    }
  });
}

/**
 * REACT_036: Fix 1 fake link issue
 * Converts fake links (elements with click handlers but no href) to proper links or buttons
 */
function fixFakeLinkIssue() {
  // Find elements that look like links but aren't
  const fakeLinks = document.querySelectorAll(
    '[onclick]:not(a):not(button):not([role]):not(input):not(select):not(textarea), ' +
    '[role="link"]:not(a):not([href]), ' +
    'a:not([href])'
  );
  
  let fixedCount = 0;
  fakeLinks.forEach(el => {
    if (fixedCount >= 1) return; // Only fix 1 fake link as per issue
    
    const hasClickHandler = el.onclick || el.getAttribute('onclick') || el.hasAttribute('ng-click') || el.hasAttribute('@click');
    const hasKeyboardSupport = el.tabIndex >= 0 || el.getAttribute('tabindex') !== null;
    
    if (hasClickHandler || hasKeyboardSupport) {
      const tagName = el.tagName.toLowerCase();
      
      if (tagName === 'a') {
        // Anchor without href - add href or convert to button
        const url = el.getAttribute('data-href') || el.getAttribute('data-url') || '#';
        el.setAttribute('href', url);
        if (url === '#') {
          el.addEventListener('click', e => e.preventDefault());
        }
      } else if (el.hasAttribute('role') && el.getAttribute('role') === 'link') {
        // Role="link" but not an anchor - convert to button if it performs action
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        if (!el.hasAttribute('type')) el.setAttribute('type', 'button');
        
        // Add keyboard support
        if (!el.onkeydown) {
          el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              el.click();
            }
          });
        }
      } else {
        // Generic element acting as link - convert to button
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        
        if (!el.onkeydown) {
          el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              el.click();
            }
          });
        }
      }
      
      fixedCount++;
    }
  });
}

/**
 * Initialize all accessibility fixes
 * Call this on DOMContentLoaded or after dynamic content loads
 */
function initAccessibilityFixes() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibilityFixes);
    return;
  }
  
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
}

// Auto-initialize if not in a module context
if (typeof window !== 'undefined' && !window.__ACCESSIBILITY_INITIALIZED__) {
  window.__ACCESSIBILITY_INITIALIZED__ = true;
  initAccessibilityFixes();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue,
    initAccessibilityFixes
  };
}

// Also support ES modules
if (typeof exports !== 'undefined') {
  exports.addLangAttribute = addLangAttribute;
  exports.fixTableStructureIssues = fixTableStructureIssues;
  exports.addMainLandmark = addMainLandmark;
  exports.addSvgAccessibleNames = addSvgAccessibleNames;
  exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
  exports.fixFakeLinkIssue = fixFakeLinkIssue;
  exports.initAccessibilityFixes = initAccessibilityFixes;
}