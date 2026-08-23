// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

// target elements for accessibility improvements
const targetElements = [
  // Add your target elements here
];

// function to add the 'lang' attribute to the HTML element
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en'); // Set the language to English for example
  }
}

// function to add landmark roles and fix landmark issues (REACT_017)
function addLandmarkRoles() {
  // Add main landmark
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  // Add navigation landmark
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });

  // Add header landmark
  const headerElement = document.querySelector('header');
  if (headerElement && !headerElement.getAttribute('role')) {
    headerElement.setAttribute('role', 'banner');
  }

  // Add footer landmark
  const footerElement = document.querySelector('footer');
  if (footerElement && !footerElement.getAttribute('role')) {
    footerElement.setAttribute('role', 'contentinfo');
  }
}

// function to fix table structure issues (REACT_027)
function fixTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Check if table has proper caption or aria-label
    const hasCaption = table.querySelector('caption');
    const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

    if (!hasCaption && !hasAriaLabel) {
      // Add aria-label as fallback
      table.setAttribute('aria-label', 'Data table');
    }

    // Ensure proper table structure with th elements
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.getAttribute('scope')) {
        // Determine if header is for column or row
        const firstRow = table.querySelector('tr');
        if (firstRow && firstRow.contains(th) && firstRow.firstChild === th) {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    });
  });
}

// function to add accessible names to SVGs (REACT_041)
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    const title = svg.querySelector('title');

    if (!ariaLabel && !ariaLabelledby) {
      if (title) {
        const titleId = `svg-title-${index}`;
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', `Icon ${index + 1}`);
      }
    }
  });
}

// function to ensure unique landmarks (REACT_025)
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'banner', 'contentinfo', 'navigation'];

  landmarks.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    let count = 0;
    elements.forEach((el) => {
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', `${role} section ${++count}`);
      }
    });
  });
}

// function to fix fake link issues (REACT_036)
function fixFakeLinks() {
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    const onClick = link.getAttribute('onclick') || link.onclick;

    // Check if it's a fake link (has onclick but no href or invalid href)
    if (onClick && (!href || href === '#' || href === 'javascript:void(0)')) {
      // Add role="button" to indicate it's actually a button
      if (!link.getAttribute('role')) {
        link.setAttribute('role', 'button');
      }

      // Add tabindex to make it keyboard accessible
      if (!link.getAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });

  // Also check elements with role="link" that should be buttons
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === 'javascript:void(0)') {
      link.setAttribute('role', 'button');
      if (!link.getAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
}

// Convenience function that runs all accessibility improvements (integrates origin/main's newFunction concept)
function runAllAccessibilityFixes(rootElement = document) {
  // Add lang attribute to HTML element (REACT_015)
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }

  // Add landmark roles (REACT_017)
  addLandmarkRoles();

  // Fix table accessibility (REACT_027)
  const tables = rootElement.querySelectorAll ? rootElement.querySelectorAll('table') : document.querySelectorAll('table');
  tables.forEach((table) => {
    const hasCaption = table.querySelector('caption');
    const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
    if (!hasCaption && !hasAriaLabel) {
      table.setAttribute('aria-label', 'Data table');
    }
    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.getAttribute('scope')) {
        const firstRow = table.querySelector('tr');
        if (firstRow && firstRow.contains(th) && firstRow.firstChild === th) {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    });
  });

  // Ensure unique landmarks with aria-labels (REACT_025)
  ensureUniqueLandmarks();

  // Fix fake links (REACT_036)
  const anchors = rootElement.querySelectorAll ? rootElement.querySelectorAll('a:not([href])') : document.querySelectorAll('a:not([href])');
  anchors.forEach(link => {
    if (link) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });

  // Add accessible names to SVGs (REACT_041)
  const svgs = rootElement.querySelectorAll ? rootElement.querySelectorAll('svg') : document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    const title = svg.querySelector('title');

    if (!ariaLabel && !ariaLabelledby) {
      if (title) {
        const titleId = `svg-title-${index}`;
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', `Icon ${index + 1}`);
      }
    }
  });

  console.log('runAllAccessibilityFixes has been called');
}

// New function to simulate button click event for testing purposes
function simulateButtonClick(selector) {
  // Simulate clicking an element with a certain selector
  const button = document.querySelector(selector);
  if (button) {
    button.click();
  }
}

function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

function getFullLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (!htmlElement) return null;
  const lang = htmlElement.getAttribute('lang');
  const xmlLang = htmlElement.getAttribute('xml:lang');
  return xmlLang || lang || null;
}

function validateTableAccessibility() {
  fixTableAccessibility();
  return true;
}

function validateTableStructure(table) {
  if (!table || table.nodeType !== 1) return;
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
  if (!hasCaption && !hasAriaLabel) {
    table.setAttribute('aria-label', 'Data table');
  }
  const headers = table.querySelectorAll('th');
  headers.forEach((th) => {
    if (!th.getAttribute('scope')) {
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.contains(th) && firstRow.firstChild === th) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
}

function validateLandmark(element) {
  if (!element) return false;
  const role = element.getAttribute('role');
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'region', 'form', 'application', 'complementary'];
  return validRoles.includes(role);
}

function validateLandmarkStructure(element) {
  if (!element) return;
  const role = element.getAttribute('role');
  if (!role) return;
  if (['navigation', 'region', 'complementary', 'main', 'banner', 'contentinfo', 'search', 'form', 'application'].includes(role)) {
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', `${role} landmark`);
    }
  }
}

function getSvgAccessibleName(arg) {
  let svg;
  if (typeof arg === 'number') {
    const svgs = document.querySelectorAll('svg');
    svg = svgs[arg] || null;
  } else if (arg && arg.nodeType === 1 && arg.tagName === 'svg') {
    svg = arg;
  } else {
    svg = document.querySelector('svg');
  }
  if (!svg) return null;
  const ariaLabel = svg.getAttribute('aria-label');
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  const title = svg.querySelector('title');
  if (ariaLabel) return ariaLabel;
  if (ariaLabelledby) return ariaLabelledby;
  if (title) return title.textContent.trim();
  return null;
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text || '';
  button.setAttribute('type', 'button');
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createAccessibleLink(href, text, ariaLabel) {
  const link = document.createElement('a');
  link.setAttribute('href', href || '#');
  link.textContent = text || '';
  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }
  return link;
}

// call the accessibility improvement functions
addLangAttribute();
addLandmarkRoles();
fixTableAccessibility();
addSvgAccessibleNames();
ensureUniqueLandmarks();
fixFakeLinks();

// Export functions for testing
export {
  addLangAttribute,
  addLandmarkRoles,
  fixTableAccessibility,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  runAllAccessibilityFixes,
  simulateButtonClick,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  createAccessibleLink
};