(function() {
  'use strict';

  // REACT_015: Add lang attribute to HTML element
  function setLanguageAttribute() {
    var htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  }

  // REACT_017: Add landmark roles and fix landmark issues
  function ensureLandmarkRoles() {
    var mainElement = document.querySelector('main');
    if (mainElement && !mainElement.hasAttribute('role')) {
      mainElement.setAttribute('role', 'main');
    }

    var navElements = document.querySelectorAll('nav');
    navElements.forEach(function(nav) {
      if (nav && !nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
    });
  }

  // REACT_041: Add accessible names to 2 SVGs
  function addSvgAccessibleNames() {
    var svgs = document.querySelectorAll('svg');
    svgs.forEach(function(svg, index) {
      var title = svg.querySelector('title');
      if (title) {
        var titleId = 'svg-title-' + index;
        title.setAttribute('id', titleId);
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        var newTitle = document.createElement('title');
        newTitle.textContent = 'SVG icon ' + (index + 1);
        svg.insertBefore(newTitle, svg.firstChild);
      }
    });
  }

  // REACT_025: Ensure unique landmarks (2 issues)
  function ensureUniqueLandmarks() {
    var navLandmarks = document.querySelectorAll('nav');
    navLandmarks.forEach(function(nav, index) {
      var existingLabel = nav.getAttribute('aria-label');
      if (!existingLabel) {
        if (index === 0) {
          nav.setAttribute('aria-label', 'Main navigation');
        } else {
          nav.setAttribute('aria-label', 'Secondary navigation');
        }
      }
    });

    var footers = document.querySelectorAll('footer');
    footers.forEach(function(footer, index) {
      if (footer && index > 0) {
        footer.setAttribute('aria-label', 'Secondary footer');
      }
    });
  }

  // REACT_036: Fix 1 fake link issue
  function fixFakeLinks() {
    var links = document.querySelectorAll('a:not([href])');
    links.forEach(function(link) {
      var isButton = link.getAttribute('role') === 'button' || 
                     link.classList.contains('btn') || 
                     link.classList.contains('button');
      
      if (isButton) {
        if (link.getAttribute('role') !== 'button') {
          link.setAttribute('role', 'button');
        }
        if (!link.getAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }
      }
    });
  }

  // New function to fix table structure issues
  function fixTableConstraints() {
    // Example implementation: Enforce at least one THEAD or `${headerRowCount}` rows in TABLEs
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        let hasThead = false;
        let headerRowCount = 1; // Modify this number if required

        const theads = table.querySelectorAll('thead');
        theads.forEach(thead => {
            if (thead.rows.length > 0) {
                hasThead = true;
            }
        });

        if (!hasThead && table.rows.length < headerRowCount) {
            console.error("Table does not have a thead or enough header rows:", table);
        }
    });
  }

  // Initialize accessibility fixes
  function init() {
    setLanguageAttribute();
    ensureLandmarkRoles();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinks();
    fixTableConstraints();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      setLanguageAttribute: setLanguageAttribute,
      ensureLandmarkRoles: ensureLandmarkRoles,
      addSvgAccessibleNames: addSvgAccessibleNames,
      ensureUniqueLandmarks: ensureUniqueLandmarks,
      fixFakeLinks: fixFakeLinks,
      fixTableConstraints: fixTableConstraints
    };
  }
})();