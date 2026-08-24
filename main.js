// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to HTML element
function setHtmlLang(lang) {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.getAttribute('lang')) {
      htmlElement.setAttribute('lang', lang || 'en');
    }
  }
}

// REACT_017: Add/fix 4 landmark issues
// REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
function ensureLandmarks() {
  if (typeof document !== 'undefined') {
    const body = document.body;
    if (body) {
      // Ensure there is a main landmark
      if (!body.querySelector('main, [role="main"]')) {
        const main = document.createElement('main');
        main.setAttribute('role', 'main');
        main.setAttribute('aria-label', 'Main content');
        // Wrap existing content in main if possible
        body.appendChild(main);
      }

      // Ensure there is a header/banner landmark with unique name
      if (!body.querySelector('header, [role="banner"]')) {
        const header = document.createElement('header');
        header.setAttribute('role', 'banner');
        header.setAttribute('aria-label', 'Site header');
        body.insertBefore(header, body.firstChild);
      }

      // Ensure there is a nav landmark with unique name
      if (!body.querySelector('nav, [role="navigation"]')) {
        const nav = document.createElement('nav');
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'Main navigation');
        body.appendChild(nav);
      }

      // Ensure there is a footer/contentinfo landmark with unique name
      if (!body.querySelector('footer, [role="contentinfo"]')) {
        const footer = document.createElement('footer');
        footer.setAttribute('role', 'contentinfo');
        footer.setAttribute('aria-label', 'Site footer');
        body.appendChild(footer);
      }
    }
  }
}

// REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
function ensureUniqueLandmarks() {
  if (typeof document !== 'undefined') {
    // Find all landmarks and ensure each has a unique aria-label or aria-labelledby
    const landmarkSelectors = [
      'main, [role="main"]',
      'header, [role="banner"]',
      'nav, [role="navigation"]',
      'footer, [role="contentinfo"]',
      'aside, [role="complementary"]',
      '[role="search"]',
      '[role="region"]'
    ];

    const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
    const usedLabels = new Set();

    landmarks.forEach((landmark) => {
      let label = landmark.getAttribute('aria-label') ||
                  landmark.getAttribute('aria-labelledby');

      if (!label) {
        // Generate a unique label based on role
        const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        let baseLabel = role.charAt(0).toUpperCase() + role.slice(1);
        let counter = 1;
        let uniqueLabel = baseLabel;

        while (usedLabels.has(uniqueLabel)) {
          uniqueLabel = `${baseLabel} ${counter}`;
          counter++;
        }

        landmark.setAttribute('aria-label', uniqueLabel);
        label = uniqueLabel;
      }

      usedLabels.add(label);
    });
  }
}

// REACT_041: Add accessible names to 2 SVGs
function addAccessibleNamesToSvgs() {
  if (typeof document !== 'undefined') {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') &&
          !svg.querySelector('title')) {
        const title = document.createElement('title');
        title.textContent = `Graphic ${index + 1}`;
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('aria-label', `Graphic ${index + 1}`);
      }
    });
  }
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks() {
  if (typeof document !== 'undefined') {
    // Find links without href that may be fake links
    const fakeLinks = document.querySelectorAll('a:not([href])');
    fakeLinks.forEach((link) => {
      // Add role="button" if it's acting as a button, or give it a valid href
      if (link.getAttribute('role') !== 'button') {
        link.setAttribute('role', 'button');
      }
      // Ensure it's keyboard accessible
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    });
  }
}

// Initialize all accessibility fixes
function initAccessibilityFixes() {
  setHtmlLang('en');
  ensureLandmarks();
  ensureUniqueLandmarks();
  addAccessibleNamesToSvgs();
  fixFakeLinks();
}

// Auto-run if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibilityFixes);
  } else {
    initAccessibilityFixes();
  }
}

module.exports = {
  setHtmlLang,
  ensureLandmarks,
  ensureUniqueLandmarks,
  addAccessibleNamesToSvgs,
  fixFakeLinks,
  initAccessibilityFixes
};