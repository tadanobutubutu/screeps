// TODO: Address accessibility issues from insight report:
// - Add lang attribute to HTML element (for example, add it to index.html file)
// - Fix table structure issues (... add relevant functions here if needed)
// - Add/fix landmark issues (... add relevant functions here if needed)
// - Add accessible names to 2 SVGs (... add relevant functions here if needed)
// - Ensure unique landmarks (... add relevant functions here if needed)
// - Fix fake link issues (... add relevant functions here if needed)

/**
 * Adds the lang attribute to the HTML element for accessibility
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 */
function setHtmlLangAttribute(langCode = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', langCode);
  }
}

/**
 * Fixes table structure issues by ensuring proper table markup
 * Adds caption, thead, and proper structure to tables without them
 */
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    // Check if table has a caption
    let caption = table.querySelector('caption');
    if (!caption) {
      caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.insertBefore(caption, table.firstChild);
    }
    
    // Check if table has a thead
    const firstRow = table.querySelector('tr');
    if (firstRow && !table.querySelector('thead')) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  });
}

/**
 * Adds or fixes landmark roles for semantic structure
 */
function fixLandmarkRoles() {
  // Ensure main content has role="main"
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.querySelector('[role="main"]');
  }
  if (mainElement && !mainElement.hasAttribute('role') && mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }
  
  // Ensure navigation has role="navigation" or is a nav element
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Ensure header has role="banner" if not using header element
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // Ensure footer has role="contentinfo" if not using footer element
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

/**
 * Adds accessible names to SVG elements that lack them
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let svgIndex = 0;
  
  svgs.forEach((svg) => {
    // Check if SVG already has an accessible name
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title');
    
    if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
      // Add a title element for accessibility
      const title = document.createElement('title');
      title.textContent = `SVG icon ${svgIndex + 1}`;
      title.setAttribute('id', `svg-title-${svgIndex + 1}`);
      svg.insertBefore(title, svg.firstChild);
      
      // Add aria-labelledby to reference the title
      svg.setAttribute('aria-labelledby', `svg-title-${svgIndex + 1}`);
    }
    svgIndex++;
  });
}

/**
 * Ensures all landmarks have unique labels to avoid duplicates
 */
function ensureUniqueLandmarks() {
  const landmarks = {
    navigation: document.querySelectorAll('nav, [role="navigation"]'),
    main: document.querySelectorAll('main, [role="main"]'),
    banner: document.querySelectorAll('header, [role="banner"]'),
    contentinfo: document.querySelectorAll('footer, [role="contentinfo"]'),
    complementary: document.querySelectorAll('aside, [role="complementary"]'),
    search: document.querySelectorAll('[role="search"]')
  };
  
  Object.keys(landmarks).forEach(landmarkType => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
          const labels = {
            navigation: `Navigation menu ${index + 1}`,
            main: `Main content section ${index + 1}`,
            banner: `Site header ${index + 1}`,
            contentinfo: `Site footer ${index + 1}`,
            complementary: `Complementary content ${index + 1}`,
            search: `Search interface ${index + 1}`
          };
          el.setAttribute('aria-label', labels[landmarkType] || `${landmarkType} ${index + 1}`);
        }
      });
    }
  });
}

/**
 * Fixes fake link issues by converting buttons styled as links or adding proper roles
 */
function fixFakeLinks() {
  // Find links without href (which are fake links)
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    // If it's styled as a link but should be a button, convert it
    const computedStyle = window.getComputedStyle(link);
    if (computedStyle.cursor === 'pointer' && !link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
      
      // Add tabindex to make it keyboard accessible
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
  
  // Fix buttons styled as links
  const buttonLinks = document.querySelectorAll('button.link-style, button[class*="link"]');
  buttonLinks.forEach(button => {
    if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
      console.warn('Button with link styling lacks accessible name');
    }
  });
}

/**
 * Initialize all accessibility fixes
 */
function initAccessibility() {
  setHtmlLangAttribute();
  fixTableStructure();
  fixLandmarkRoles();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinks();
}

// Export functions for testing
module.exports = {
  setHtmlLangAttribute,
  fixTableStructure,
  fixLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  initAccessibility
};

// Run initialization when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}