// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

(function() {
  'use strict';

  // Your existing code here...

  // Helper function to set lang attribute
  function setLangAttribute() {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }

  // Helper function to fix table structure issues
  function fixTableStructure() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // Ensure tables have proper structure
      if (!table.querySelector('thead')) {
        const firstRow = table.querySelector('tr');
        if (firstRow && firstRow.querySelector('th')) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow.cloneNode(true));
          table.insertBefore(thead, table.firstChild);
          firstRow.remove();
        }
      }
      if (!table.querySelector('tbody')) {
        const tbody = document.createElement('tbody');
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          if (row.parentNode !== thead) {
            tbody.appendChild(row);
          }
        });
        table.appendChild(tbody);
      }
      // Ensure proper scope attributes on header cells
      const headers = table.querySelectorAll('th');
      const rows = table.querySelectorAll('tr');
      headers.forEach(th => {
        if (!th.hasAttribute('scope')) {
          const row = th.closest('tr');
          if (row && row.parentNode && row.parentNode.tagName === 'THEAD') {
            th.setAttribute('scope', 'col');
          } else {
            th.setAttribute('scope', 'row');
          }
        }
      });
    });
  }

  // Helper function to ensure unique landmark roles
  function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('nav, [role="banner"], [role="contentinfo"], [role="main"], [role="navigation"], [role="complementary"], [role="search"]');
    const seenTypes = {};
    
    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
      if (seenTypes[role]) {
        // Add aria-label to make landmark unique
        if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
          const label = role === 'nav' ? `Navigation ${seenTypes[role] + 1}` : `${role.charAt(0).toUpperCase() + role.slice(1)} ${seenTypes[role] + 1}`;
          landmark.setAttribute('aria-label', label);
        }
        seenTypes[role]++;
      } else {
        seenTypes[role] = 1;
      }
    });
  }

  // Helper function to add accessible names to SVGs
  function addSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    let svgIndex = 0;
    svgs.forEach(svg => {
      const role = svg.getAttribute('role');
      const ariaLabel = svg.getAttribute('aria-label');
      const ariaLabelledby = svg.getAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      
      if ((!ariaLabel && !ariaLabelledby && !hasTitle) || role === 'img') {
        svgIndex++;
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
          svg.setAttribute('aria-label', `SVG icon ${svgIndex}`);
        }
        // Add title element if missing
        if (!hasTitle) {
          const title = document.createElement('title');
          title.textContent = `SVG icon ${svgIndex}`;
          title.setAttribute('id', `svg-title-${svgIndex}`);
          svg.insertBefore(title, svg.firstChild);
          if (!svg.hasAttribute('aria-labelledby')) {
            svg.setAttribute('aria-labelledby', `svg-title-${svgIndex}`);
          }
        }
      }
    });
  }

  // Helper function to fix fake links (anchors without href)
  function fixFakeLinks() {
    const anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
      const hasHref = anchor.hasAttribute('href');
      const hasOnClick = anchor.onclick !== null;
      const href = anchor.getAttribute('href') || '';
      const isEmptyHref = href === '' || href === '#';
      
      if ((!hasHref || isEmptyHref) && (hasOnClick || anchor.getAttribute('role') === 'button')) {
        // If it's acting as a link but has no href, either add button role or proper href
        if (!anchor.hasAttribute('role')) {
          anchor.setAttribute('role', 'button');
        }
        // Add tabindex to make it keyboard accessible
        if (!anchor.hasAttribute('tabindex')) {
          anchor.setAttribute('tabindex', '0');
        }
      }
    });
  }

  // Initialize accessibility fixes
  function initAccessibility() {
    setLangAttribute();
    ensureUniqueLandmarks();
    fixTableStructure();
    addSvgAccessibleNames();
    fixFakeLinks();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
})();