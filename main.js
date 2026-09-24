// Your existing code (including exports and functions)

// Remove the TODO comment
// Instead, make any additional changes requested in the issue here

// Any additional functions, exports, or changes related to the issue

// REACT_017: Add landmark roles - Ensure proper landmark regions
function ensureLandmarkRoles(container) {
  const landmarks = {
    header: { role: 'banner', count: 0 },
    nav: { role: 'navigation', count: 0 },
    main: { role: 'main', count: 0 },
    aside: { role: 'complementary', count: 0 },
    footer: { role: 'contentinfo', count: 0 },
  };

  const elements = container.querySelectorAll('header, nav, main, aside, footer');
  elements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (landmarks[tagName]) {
      landmarks[tagName].count++;
    }
  });

  return landmarks;
}

// REACT_025: Ensure unique landmarks - Prevent duplicate landmark roles
function ensureUniqueLandmarks(container) {
  const landmarkCounts = {};
  const landmarkElements = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

  landmarkElements.forEach(el => {
    const role = el.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;

    // If multiple of same landmark type, add unique labels
    if (landmarkCounts[role] > 1) {
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', `${role} section ${landmarkCounts[role]}`);
      }
    }
  });
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(container) {
  const svgs = container.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${index}`;
      title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      svg.setAttribute('aria-label', `SVG graphic ${index + 1}`);
    }
  });
}

// REACT_036: Fix fake link issues - Convert buttons styled as links or links styled as buttons
function fixFakeLinks(container) {
  const fakeLinks = container.querySelectorAll('a[href="#"], a[onclick], a[role="button"], button[href]');
  fakeLinks.forEach(el => {
    if (el.tagName === 'A' && el.getAttribute('role') === 'button') {
      // Keep as button role, ensure proper button semantics
      el.setAttribute('aria-pressed', 'false');
    } else if (el.tagName === 'A' && (el.getAttribute('href') === '#' || el.getAttribute('onclick'))) {
      // Convert to proper button
      el.setAttribute('role', 'button');
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', el.textContent.trim());
      }
    }
  });
}

// REACT_015: Add lang attribute helper (for dynamic content injection)
function ensureLangAttribute(document) {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', document.documentElement.lang || 'en');
  }
  return html.getAttribute('lang');
}

// New function to address REACT_025: Ensure unique landmarks (static case for already created elements)
function ensureStaticUniqueLandmarks(container) {
  const landmarkCounts = {};
  const landmarkElements = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

  landmarkElements.forEach(el => {
    const role = el.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;

    // If multiple of same landmark type, add unique ids
    if (landmarkCounts[role] > 1) {
      if (!el.id) {
        el.id = `landmark-${role}-${landmarkCounts[role]}`;
      }
    }
  });
}

// Export all functions for testing
export {
  ensureLandmarkRoles,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureLangAttribute,
  ensureStaticUniqueLandmarks // Added for REACT_025
};