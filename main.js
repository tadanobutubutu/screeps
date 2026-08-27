// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Adds lang attribute to the HTML element for accessibility
 * Addresses REACT_015
 */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Fixes table structure issues for accessibility
 * Addresses REACT_027 (26 table structure issues)
 */
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure with headers
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');
    
    if (!hasThead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newFirstRow = firstRow.cloneNode(true);
        thead.appendChild(newFirstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    
    if (!hasTbody) {
      const rows = table.querySelectorAll('tr');
      const tbody = document.createElement('tbody');
      rows.forEach((row, index) => {
        if (index > 0 && !row.closest('thead')) {
          tbody.appendChild(row);
        }
      });
      if (tbody.children.length > 0) {
        table.appendChild(tbody);
      }
    }
    
    // Add scope attributes to header cells
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        const row = th.closest('tr');
        const rowIndex = Array.from(row.parentElement.children).indexOf(th);
        th.setAttribute('scope', rowIndex === 0 ? 'col' : 'row');
      }
    });
  });
}

/**
 * Adds main landmark to the page for accessibility
 * Addresses REACT_017 (2 landmark issues)
 */
function addMainLandmark() {
  // Find existing main element or create one
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // Try common main content containers
    const contentSelectors = ['#main-content', '#main', '.main', '[role="main"]'];
    let contentElement = null;
    
    for (const selector of contentSelectors) {
      contentElement = document.querySelector(selector);
      if (contentElement) break;
    }
    
    if (contentElement) {
      mainElement = document.createElement('main');
      mainElement.setAttribute('id', 'main-content');
      mainElement.setAttribute('role', 'main');
      
      // Wrap the content
      while (contentElement.firstChild) {
        mainElement.appendChild(contentElement.firstChild);
      }
      contentElement.appendChild(mainElement);
    }
  } else {
    if (!mainElement.hasAttribute('role')) {
      mainElement.setAttribute('role', 'main');
    }
    if (!mainElement.id) {
      mainElement.setAttribute('id', 'main-content');
    }
  }
}

/**
 * Ensures landmarks have unique accessible names
 * Addresses REACT_025
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]');
  
  const seenLabels = new Map();
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role') || '';
    const ariaLabel = landmark.getAttribute('aria-label');
    const ariaLabelledby = landmark.getAttribute('aria-labelledby');
    
    let label = ariaLabel || '';
    
    if (!label && ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby);
      if (labelElement) {
        label = labelElement.textContent.trim();
      }
    }
    
    if (!label) {
      // Generate unique label based on tag/role
      const key = `${tagName}-${role}`;
      const count = seenLabels.get(key) || 0;
      seenLabels.set(key, count + 1);
      
      if (count > 0) {
        const defaultLabels = {
          'nav': 'Navigation',
          'header': 'Header',
          'footer': 'Footer',
          'aside': 'Sidebar',
          'section': 'Section',
          'section-region': 'Section'
        };
        label = defaultLabels[key] || `${tagName.charAt(0).toUpperCase() + tagName.slice(1)} ${count + 1}`;
        landmark.setAttribute('aria-label', label);
      }
    }
  });
}

/**
 * Adds accessible names to SVG elements
 * Addresses REACT_041 (2 SVGs)
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  
  svgs.forEach((svg, index) => {
    // Check for title element inside SVG
    const title = svg.querySelector('title');
    if (title) {
      const titleId = title.id || `svg-title-${index}`;
      if (!title.id) title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      // Generate accessible name based on context or position
      const context = svg.closest('a, button, [aria-label]') || svg.parentElement;
      let accessibleName = 'Decorative graphic';
      
      if (context) {
        const contextLabel = context.getAttribute('aria-label') || 
                            context.getAttribute('alt') ||
                            context.textContent?.trim().slice(0, 30);
        if (contextLabel) {
          accessibleName = contextLabel;
        }
      }
      
      svg.setAttribute('aria-label', accessibleName);
    }
  });
}

/**
 * Fixes fake link issues - converts non-link elements that behave as links
 * Addresses REACT_036 (1 fake link issue)
 */
function fixFakeLinkIssue() {
  // Find elements with onclick that navigate but aren't links or buttons
  const fakeLinks = document.querySelectorAll('div[onclick], span[onclick], p[onclick]');
  
  fakeLinks.forEach(element => {
    const onclick = element.getAttribute('onclick') || '';
    const navigationPatterns = ['window.location', 'location.href', 'navigate', 'href='];
    
    const isNavigation = navigationPatterns.some(pattern => 
      onclick.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (isNavigation) {
      // Check if parent is not already an anchor
      if (!element.closest('a')) {
        // Get href from onclick if available
        const hrefMatch = onclick.match(/['"]([^'"]+)['"]/);
        const href = hrefMatch ? hrefMatch[1] : '#';
        
        // Create proper link
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.setAttribute('role', 'link');
        
        // Copy styles and attributes
        link.className = element.className;
        link.style.cssText = element.style.cssText;
        link.onclick = element.onclick;
        
        // Copy children
        while (element.firstChild) {
          link.appendChild(element.firstChild);
        }
        
        // Replace element
        element.parentNode.replaceChild(link, element);
      }
    }
  });
  
  // Also fix elements with href="#" used as buttons
  const fakeButtons = document.querySelectorAll('a[href="#"]:not([role="button"]), a[href="javascript:void(0)"]:not([role="button"])');
  
  fakeButtons.forEach(a => {
    const onclick = a.getAttribute('onclick') || '';
    const isButtonLike = onclick.includes('return false') || 
                         onclick.includes('preventDefault') ||
                         !a.getAttribute('href');
    
    if (isButtonLike) {
      a.setAttribute('role', 'button');
      a.setAttribute('tabindex', '0');
      
      // Add keyboard support if not present
      if (!a.hasAttribute('onkeydown')) {
        a.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            a.click();
          }
        });
      }
    }
  });
}

/**
 * Initialize accessibility fixes
 */
function initAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// Export functions for testing
module.exports = {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  initAccessibility
};