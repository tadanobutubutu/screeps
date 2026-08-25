// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue
//

(function() {
  'use strict';

  // REACT_015: Add lang attribute to HTML element
  function ensureLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  }

  // REACT_017: Add/fix 4 landmark issues
  // REACT_025: Ensure unique landmarks (2 issues)
  function ensureUniqueLandmarks() {
    // Get all main landmarks
    const mainElements = document.querySelectorAll('main');
    
    // If multiple main elements exist, add unique labels
    if (mainElements.length > 1) {
      mainElements.forEach((main, index) => {
        const existingLabel = main.getAttribute('aria-label');
        if (!existingLabel) {
          main.setAttribute('aria-label', `Main content section ${index + 1}`);
        }
      });
    }

    // Get all nav landmarks
    const navElements = document.querySelectorAll('nav');
    if (navElements.length > 1) {
      navElements.forEach((nav, index) => {
        const existingLabel = nav.getAttribute('aria-label');
        if (!existingLabel) {
          const labels = ['Primary navigation', 'Secondary navigation', 'Footer navigation'];
          nav.setAttribute('aria-label', labels[index] || `Navigation ${index + 1}`);
        }
      });
    }

    // Get all footer landmarks
    const footerElements = document.querySelectorAll('footer');
    if (footerElements.length > 1) {
      footerElements.forEach((footer, index) => {
        const existingLabel = footer.getAttribute('aria-label');
        if (!existingLabel) {
          footer.setAttribute('aria-label', `Footer section ${index + 1}`);
        }
      });
    }
  }

  // REACT_041: Add accessible names to 2 SVGs
  function ensureSVGsAccessible() {
    const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
    svgs.forEach((svg, index) => {
      // Check if SVG has a title child element
      let hasTitle = svg.querySelector('title');
      
      if (!hasTitle) {
        // Add a title element to the SVG
        const title = document.createElement('title');
        title.textContent = `Icon ${index + 1}`;
        title.id = `svg-title-${index}`;
        svg.insertBefore(title, svg.firstChild);
      }

      // Add aria-labelledby if not present
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        const titleId = hasTitle ? hasTitle.id : `svg-title-${index}`;
        if (titleId) {
          svg.setAttribute('aria-labelledby', titleId);
        } else {
          svg.setAttribute('aria-label', `Graphic ${index + 1}`);
        }
      }
    });
  }

  // REACT_036: Fix 1 fake link issue
  function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
    
    fakeLinks.forEach(link => {
      // Check if it's meant to be a button (no real navigation)
      const isFakeLink = link.getAttribute('href') === '#' || link.getAttribute('href') === '';
      
      if (isFakeLink && !link.hasAttribute('role')) {
        // Convert to button or add proper role
        const hasClickHandler = link.getAttribute('onclick') || 
                                link.addEventListener;
        
        if (hasClickHandler) {
          // It's a JavaScript link - add button role and prevent default
          link.setAttribute('role', 'button');
          link.setAttribute('tabindex', '0');
          
          // Add keyboard support
          if (!link.getAttribute('onkeydown')) {
            link.addEventListener('keydown', function(e) {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
              }
            });
          }
        }
      }
    });
  }

  // Initialize all accessibility fixes
  function init() {
    ensureLangAttribute();
    ensureUniqueLandmarks();
    ensureSVGsAccessible();
    fixFakeLinks();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export functions for testing (if needed)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      ensureLangAttribute,
      ensureUniqueLandmarks,
      ensureSVGsAccessible,
      fixFakeLinks,
      init
    };
  }
})();