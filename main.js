function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// - REACT_041: Add accessible names to 2 SVGs
// These are decorative favicon SVGs, so marking them as hidden from assistive tech
const svg1 = document.querySelector('link[rel="icon"] svg');
const svg2 = document.querySelector('link[rel="shortcut icon"] svg');
if (svg1) svg1.setAttribute('aria-hidden', 'true');
if (svg2) svg2.setAttribute('aria-hidden', 'true');

// - REACT_017: Add/fix 4 landmark issues
function addProperLandmarkRegions() {
  // Header landmark
  const header = document.querySelector('header:not([role])');
  if (header) {
    header.setAttribute('role', 'banner');
    if (!header.getAttribute('aria-label') && !header.getAttribute('aria-labelledby')) {
      header.setAttribute('aria-label', 'Site header');
    }
  }

  // - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
  const landmark1 = document.querySelector('aside:first-of-type');
  const landmark2 = document.querySelector('aside:last-of-type');
  if (landmark1) {
    landmark1.setAttribute('role', 'complementary');
    if (!landmark1.getAttribute('aria-label') && !landmark1.getAttribute('aria-labelledby')) {
      landmark1.setAttribute('aria-label', 'Supplementary content');
    }
  }
  if (landmark2) {
    landmark2.setAttribute('role', 'complementary');
    if (!landmark2.getAttribute('aria-label') && !landmark2.getAttribute('aria-labelledby')) {
      landmark2.setAttribute('aria-label', 'Additional information');
    }
  }

  const nav = document.querySelector('nav:not([role])');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      const navCount = document.querySelectorAll('nav').length;
      nav.setAttribute('aria-label', navCount > 1 ? `Navigation ${navCount}` : 'Main navigation');
    }
  }

  const main = document.querySelector('main:not([role]), main[role=""], [role="main"]');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer:not([role])');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
    if (!footer.getAttribute('aria-label') && !footer.getAttribute('aria-labelledby')) {
      footer.setAttribute('aria-label', 'Site footer');
    }
  }

  // Additional landmark regions
  // Search landmark
  const searchForms = document.querySelectorAll('form[role="search"], form[aria-label*="search" i], form[aria-label*="Search" i]');
  searchForms.forEach((form, index) => {
    if (!form.closest('nav') && !form.getAttribute('role')) {
      form.setAttribute('role', 'search');
      if (searchForms.length > 1 && !form.getAttribute('aria-label')) {
        form.setAttribute('aria-label', `Search ${index + 1}`);
      } else if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
        form.setAttribute('aria-label', 'Search');
      }
    }
  });

  // Contentinfo landmark (additional footer if multiple)
  const additionalFooters = document.querySelectorAll('footer[role="contentinfo"]');
  additionalFooters.forEach((footer, index) => {
    if (index > 0 && !footer.getAttribute('aria-label')) {
      footer.setAttribute('aria-label', `Footer section ${index + 1}`);
    }
  });

  // Banner landmark (additional headers if multiple)
  const additionalHeaders = document.querySelectorAll('header[role="banner"]');
  additionalHeaders.forEach((header, index) => {
    if (index > 0 && !header.getAttribute('aria-label')) {
      header.setAttribute('aria-label', `Header section ${index + 1}`);
    }
  });

  // Form landmark for contact/info forms
  const forms = document.querySelectorAll('form:not([role]):not([aria-label])');
  forms.forEach((form, index) => {
    const parent = form.parentElement;
    if (parent && (parent.tagName === 'FOOTER' || parent.tagName === 'ASIDE')) {
      form.setAttribute('role', 'form');
      if (!form.getAttribute('aria-label')) {
        form.setAttribute('aria-label', `${parent.tagName.toLowerCase()} form`);
      }
    }
  });
}

function initAccessibility() {
  const header = document.querySelector('header:not([role])');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  // - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
  const landmark1 = document.querySelector('aside:first-of-type');
  const landmark2 = document.querySelector('aside:last-of-type');
  if (landmark1) {
    landmark1.setAttribute('role', 'complementary');
    if (!landmark1.getAttribute('aria-label')) {
      landmark1.setAttribute('aria-label', 'Primary sidebar');
    }
  }
  if (landmark2) {
    landmark2.setAttribute('role', 'complementary');
    if (!landmark2.getAttribute('aria-label')) {
      landmark2.setAttribute('aria-label', 'Secondary sidebar');
    }
  }

  const nav = document.querySelector('nav:not([role])');
  if (nav) {
    nav.setAttribute('role', 'navigation');
    if (!nav.getAttribute('aria-label')) {
      const navElements = document.querySelectorAll('nav');
      nav.setAttribute('aria-label', navElements.length > 1 ? `Navigation menu ${navElements.length}` : 'Navigation');
    }
  }

  const main = document.querySelector('main:not([role]), [role="main"]');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer:not([role])');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
    if (!footer.getAttribute('aria-label')) {
      footer.setAttribute('aria-label', 'Site information');
    }
  }

  // Function to ensure all SVG elements have accessible names
  const ensureSvgAccessibleNames = () => {
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
      const hasAriaLabel = svg.getAttribute('aria-label');
      const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      const hasDesc = svg.querySelector('desc');

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('role') === 'img' && svg.closest('head');

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
  };

  // Function to handle updating accessible SVG names when DOM mutates
  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      ensureSvgAccessibleNames();
    }, 0);
  };

  // Initial call
  ensureSvgAccessibleNames();

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateAccessibleSvgNames();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby']
      });
    }
  }

  // Call addProperLandmarkRegions to ensure all landmarks are properly configured
  if (typeof addProperLandmarkRegions === 'function') {
    addProperLandmarkRegions();
  }

  // ... Add more checks for identifying and addressing other accessibility problems here
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotateBack,
    addProperLandmarkRegions,
    initAccessibility
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAccessibility();
      addProperLandmarkRegions();
    });
  } else {
    initAccessibility();
    addProperLandmarkRegions();
  }
}