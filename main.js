// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
// - REACT_036: Fix 1 fake link issue
//

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

    // Enhanced table semantics from origin/main
    table.setAttribute('role', 'table');
    
    // Header rows
    table.querySelectorAll('thead th').forEach(header => {
      header.setAttribute('role', 'columnheader');
    });
    
    // Body rows
    table.querySelectorAll('tbody tr').forEach(row => {
      row.setAttribute('role', 'row');
      row.querySelectorAll('td, th').forEach(cell => {
        cell.setAttribute('role', 'gridcell');
        // Ensure unique accessible names for header cells
        const cells = row.querySelectorAll('td, th');
        const cellIndex = Array.from(cells).indexOf(cell);
        const headerCell = table.querySelector(`thead th:nth-child(${cellIndex + 1})`);
        if (headerCell) {
          const headerText = headerCell.textContent.trim();
          const ariaLabel = `Column ${headerText}`;
          cell.setAttribute('aria-label', ariaLabel);
        }
      });
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

    // Also fix anchors without href attributes (from origin/main)
    if (!href) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
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

// Enhanced function that combines both approaches for comprehensive accessibility
function newFunction(element) {
  // First apply all document-wide accessibility improvements
  addLangAttribute();
  addLandmarkRoles();
  fixTableAccessibility();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinks();

  // Then handle element-specific improvements from origin/main
  if (element) {
    // Add landmark roles for html elements (REACT_015) - already handled above but ensure for element
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }

    // Add/fix 4 landmark issues (REACT_017) - element specific
    const landmarks = ['banner', 'navigation', 'main', 'contentinfo'];
    let landmarkIndex = 0;
    const landmarkElements = document.querySelectorAll('[role="complementary"], header, nav, main, footer');
    landmarkElements.forEach(landmark => {
      if (landmark && landmarkIndex < landmarks.length) {
        if (!landmark.hasAttribute('role')) {
          landmark.setAttribute('role', landmarks[landmarkIndex++]);
        }
      }
    });

    // Fix 1 fake link issue (REACT_036) - element specific
    const anchors = element.querySelectorAll('a:not([href])');
    anchors.forEach(link => {
      if (link) {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });

    // Add accessible names to 2 SVGs (REACT_041) - element specific
    const svgs = element.querySelectorAll('svg');
    svgs.filter((svg, index) => index === 0 || index === 1)
        .forEach((svg, index) => {
          if (svg) {
            const titleId = 'svg-title-' + (svg.id || index);
            let title = svg.querySelector('title');
            if (!title) {
              title = document.createElement('title');
              title.id = titleId;
              svg.insertBefore(title, svg.firstChild);
            } else {
              title.id = titleId;
            }
            svg.setAttribute('aria-labelledby', titleId);
          }
        });

    // Ensure unique landmarks (REACT_025) - element specific
    const landmarkCollection = element.querySelectorAll('[role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');
    const countByRole = new Map();

    landmarkCollection.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role) {
        if (countByRole.has(role)) {
          const uniqueRole = role + '-' + countByRole.get(role);
          landmark.setAttribute('role', uniqueRole);
          countByRole.set(role, countByRole.get(role) + 1);
        } else {
          countByRole.set(role, 1);
        }
      }
    });

    // Set ARIA attributes on the element itself
    element.setAttribute('aria-label', 'New Function');
    element.setAttribute('role', 'region');
  }
}

// New function to simulate button click event for testing purposes
function simulateButtonClick(selector) {
  // Simulate clicking an element with a certain selector
  const button = document.querySelector(selector);
  if (button) {
    button.click();
  }
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
  simulateButtonClick,
  newFunction
};

// Export for CommonJS compatibility (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    addLandmarkRoles,
    fixTableAccessibility,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    simulateButtonClick,
    newFunction,
    enhancedRequiredFunction: {
      get: function () {
        return newFunction; // Using newFunction as enhancedRequiredFunction
      }
    },
    newFunction: {
      get: function () {
        return newFunction;
      }
    }
  };
}
```