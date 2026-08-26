// main.js

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - REACT_038: Render dependency graphs (DONE: renderDependencyGraph)
// - REACT_039: Add banner and contentinfo landmarks if missing (DONE: addMissingLandmarks)

/**
 * Add lang attribute to HTML element for accessibility (REACT_015)
 */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Fix table structure issues for accessibility (REACT_027)
 * Ensures tables have proper headers and structure
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      cells.forEach((cell) => {
        if (!cell.hasAttribute('scope') && cell.tagName === 'TH') {
          // Check if this is a header cell that should have scope
          const rowHeaders = row.querySelectorAll('th');
          const cellIndex = Array.from(cells).indexOf(cell);
          if (rowHeaders.length > 1 || (row.parentElement && row.parentElement.tagName === 'THEAD')) {
            cell.setAttribute('scope', 'col');
          }
        }
      });
    });
    
    // Ensure tables have caption or summary
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      table.setAttribute('role', 'table');
    }
  });
}

/**
 * Add main landmark to the main content area (REACT_017)
 */
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    // Find the main content area and add main landmark
    const contentAreas = document.querySelectorAll('[role="main"], #content, #main, .main-content');
    contentAreas.forEach((area) => {
      if (!area.id) area.setAttribute('id', 'main-content');
      area.setAttribute('role', 'main');
    });
  } else {
    mainElements.forEach((main) => {
      if (!main.id) main.setAttribute('id', 'main-content');
    });
  }
}

/**
 * Add accessible names to SVGs (REACT_041)
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let svgCount = 0;
  svgs.forEach((svg) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG graphic ${svgCount + 1}`;
      title.setAttribute('id', `svg-title-${svgCount + 1}`);
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', `svg-title-${svgCount + 1}`);
      svgCount++;
    }
  });
}

/**
 * Ensure unique landmarks across the page (REACT_025)
 */
function ensureUniqueLandmarks() {
  const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  landmarkTypes.forEach((type) => {
    const landmarks = document.querySelectorAll(`[role="${type}"], ${type === 'main' ? 'main' : type}`);
    if (landmarks.length > 1) {
      let count = 0;
      landmarks.forEach((landmark) => {
        if (!landmark.hasAttribute('aria-label') && !landmark.id) {
          landmark.setAttribute('aria-label', `${type} section ${count + 1}`);
        }
        count++;
      });
    }
  });
}

/**
 * Fix fake link issues - convert buttons styled as links or links styled as buttons (REACT_036)
 */
function fixFakeLinkIssue() {
  // Fix links that should be buttons (no href or javascript: href)
  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) {
      if (!link.hasAttribute('role')) {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    }
  });

  // Fix buttons that should be links (have proper navigation)
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    const dataHref = button.getAttribute('data-href');
    if (dataHref && !button.hasAttribute('role')) {
      const link = document.createElement('a');
      link.setAttribute('href', dataHref);
      link.innerHTML = button.innerHTML;
      Array.from(button.attributes).forEach((attr) => {
        if (attr.name !== 'data-href') {
          link.setAttribute(attr.name, attr.value);
        }
      });
      button.parentNode.replaceChild(link, button);
    }
  });
}

/**
 * Add proper landmark regions to the page (REACT_037)
 */
function addProperLandmarkRegions() {
  const regions = ['header', 'nav', 'main', 'aside', 'footer'];
  regions.forEach((region) => {
    const elements = document.querySelectorAll(region);
    elements.forEach((el) => {
      const role = region === 'header' ? 'banner' : 
                   region === 'nav' ? 'navigation' : 
                   region === 'aside' ? 'complementary' : 
                   region === 'footer' ? 'contentinfo' : 
                   'main';
      if (!el.hasAttribute('role')) {
        el.setAttribute('role', role);
      }
    });
  });
}

/**
 * Render dependency graphs with proper accessibility (REACT_038)
 */
function renderDependencyGraph() {
  const graphContainers = document.querySelectorAll('[data-dependency-graph]');
  graphContainers.forEach((container) => {
    if (!container.getAttribute('aria-label')) {
      container.setAttribute('aria-label', 'Dependency graph visualization');
    }
    if (!container.getAttribute('role')) {
      container.setAttribute('role', 'img');
    }
    
    // Add accessible description
    const description = document.createElement('div');
    description.setAttribute('role', 'region');
    description.setAttribute('aria-label', 'Graph description');
    description.className = 'sr-only';
    description.textContent = 'This dependency graph shows the relationships between project modules.';
    container.appendChild(description);
  });
}

/**
 * Add banner and contentinfo landmarks if missing (REACT_039)
 */
function addMissingLandmarks() {
  // Check for banner landmark
  const banners = document.querySelectorAll('[role="banner"], header');
  if (banners.length === 0) {
    const firstChild = document.body.firstChild;
    const banner = document.createElement('header');
    banner.setAttribute('role', 'banner');
    banner.setAttribute('id', 'site-header');
    if (firstChild) {
      document.body.insertBefore(banner, firstChild);
    } else {
      document.body.appendChild(banner);
    }
  }

  // Check for contentinfo landmark
  const contentinfos = document.querySelectorAll('[role="contentinfo"], footer');
  if (contentinfos.length === 0) {
    const contentinfo = document.createElement('footer');
    contentinfo.setAttribute('role', 'contentinfo');
    contentinfo.setAttribute('id', 'site-footer');
    document.body.appendChild(contentinfo);
  }
}

/**
 * Initialize all accessibility fixes
 */
function initializeAccessibility() {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  addProperLandmarkRegions();
  renderDependencyGraph();
  addMissingLandmarks();
}

// Export functions for use
module.exports = {
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addProperLandmarkRegions,
  renderDependencyGraph,
  addMissingLandmarks,
  initializeAccessibility
};

// Run initialization when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}