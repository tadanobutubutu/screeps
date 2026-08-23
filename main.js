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
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
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
    // Add explicit table role for ARIA compliance
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }

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
      // Add explicit columnheader role for ARIA
      if (!th.getAttribute('role')) {
        th.setAttribute('role', 'columnheader');
      }
    });

    // Add row roles and gridcell roles for body cells
    const bodyRows = table.querySelectorAll('tbody tr');
    bodyRows.forEach((row) => {
      if (!row.getAttribute('role')) {
        row.setAttribute('role', 'row');
      }
      row.querySelectorAll('td, th').forEach((cell) => {
        if (!cell.getAttribute('role')) {
          cell.setAttribute('role', 'gridcell');
        }
        // Ensure accessible names for cells by referencing header
        const cellIndex = Array.from(row.querySelectorAll('td, th')).indexOf(cell);
        const headerCell = table.querySelector(`thead th:nth-child(${cellIndex + 1})`);
        if (headerCell && !cell.getAttribute('aria-label')) {
          const headerText = headerCell.textContent.trim();
          cell.setAttribute('aria-label', `Column ${headerText}`);
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
    let title = svg.querySelector('title');

    if (!ariaLabel && !ariaLabelledby) {
      if (!title) {
        title = document.createElement('title');
        svg.insertBefore(title, svg.firstChild);
      }
      const titleId = `svg-title-${index}`;
      title.id = titleId;
      title.textContent = title.textContent || `Icon ${index + 1}`;
      svg.setAttribute('aria-labelledby', titleId);
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
  simulateButtonClick
};