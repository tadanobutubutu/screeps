// main.js

/**
 * Address accessibility issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix table structure issues
 * - REACT_017: Add/fix landmark issues
 * - REACT_041: Add accessible names to SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix fake link issue
 */

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has role="table" if missing
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }
    // Ensure each table has a caption
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

// Add main landmark
function addMainLandmark() {
  const main = document.querySelector('main');
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
}

// Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'SVG graphic');
    }
  });
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  const seen = new Set();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seen.has(role)) {
      // If duplicate, change to generic region landmark
      landmark.removeAttribute('role');
      landmark.setAttribute('role', 'region');
    } else {
      seen.add(role);
    }
  });
}

// Fix fake link issue
function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (link.textContent.trim() === '' && !link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Link');
    }
  });
}

// Export functions for use in tests or other modules
export {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue
};