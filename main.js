// main.js

function setLandmarkRoles() {
  // REACT_017: Add landmark roles - use querySelector to get first instance only (REACT_025)
  const header = document.querySelector('header:not([role])');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  const nav = document.querySelector('nav:not([role])');
  if (nav) {
    nav.setAttribute('role', 'navigation');
  }

  const main = document.querySelector('main:not([role])');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer:not([role])');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// REACT_015: Add lang attribute to HTML element
function setLangAttribute() {
  const html = document.querySelector('html');
  if (html && !html.hasAttribute('lang')) {
    const lang = document.documentElement.lang || 'en';
    html.setAttribute('lang', lang);
  }
}

// REACT_041: Add accessible names to SVGs
function ensureSvgAccessibleNames() {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }

  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // Check if SVG is hidden
    const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                     svg.getAttribute('hidden') !== null ||
                     svg.style.display === 'none' ||
                     svg.style.visibility === 'hidden';

    if (isHidden) {
      return;
    }

    // Check for existing accessible name
    const hasAriaLabel = svg.hasAttribute('aria-label') && svg.getAttribute('aria-label').trim() !== '';
    const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');
    const hasTitle = svg.querySelector('title') !== null;
    const hasDesc = svg.querySelector('desc') !== null;

    if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
      return;
    }

    // Determine if decorative - SVGs used for favicons/decorative purposes
    const isFavicon = svg.closest('link') !== null ||
                      (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                      svg.getAttribute('aria-hidden') === 'true';

    if (isFavicon) {
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('role', 'presentation');
    } else {
      // Add a generic title for non-decorative SVGs
      const title = document.createElement('title');
      title.textContent = 'Icon';
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Icon');
    }
  });
}

// Function to handle updating accessible SVG names when DOM mutates
const updateAccessibleSvgNames = () => {
  setTimeout(() => {
    ensureSvgAccessibleNames();
  }, 0);
};

// REACT_036: Fix fake link issues - buttons styled as links should use <button> element
// For actual anchor tags without href, add role="button" and prevent default behavior
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach((link) => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
}

// Initialize accessibility features
function initAccessibility() {
  setLangAttribute();
  setLandmarkRoles();
  ensureSvgAccessibleNames();
  fixFakeLinks();

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      setLandmarkRoles();
      ensureSvgAccessibleNames();
      fixFakeLinks();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby', 'lang']
      });
    }
  }
}

// Run accessibility initialization when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

export { setLandmarkRoles, setLangAttribute, ensureSvgAccessibleNames, fixFakeLinks, initAccessibility };