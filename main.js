import { icons, checkDependencyStatus, getDependencyAlerts, myFunction, dependencyGraphContent } from './dependencies.js';

// Function to add landmark roles and fix landmark issues
function addLandmarks() {
  // Add lang attribute to HTML
  const html = document.documentElement;
  html.setAttribute('lang', 'en');
  // or your language code
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }
  const nav = document.querySelector('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
  }
  let mainContent = document.querySelector('main');
  if (!mainContent) {
    mainContent = document.createElement('main');
    mainContent.setAttribute('role', 'main');
    const container = document.querySelector('.container');
    if (container) {
      mainContent.appendChild(container);
    } else {
      const table = document.querySelector('table');
      if (table) {
        mainContent.appendChild(table);
      }
    }
    const headerNode = document.querySelector('header');
    const navNode = document.querySelector('nav');
    let insertNode = headerNode;
    if (navNode) {
      insertNode = navNode;
    }
    if (insertNode) {
      insertNode.parentNode.insertBefore(mainContent, insertNode.nextSibling);
    } else {
      document.body.appendChild(mainContent);
    }
  } else {
    mainContent.setAttribute('role', 'main');
  }
  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }
  // Find the elements with the classes corresponding to the roles you want to add
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.setAttribute('role', 'search');
  }
  const loginLink = document.querySelector('.login-link');
  if (loginLink) {
    loginLink.setAttribute('role', 'link');
  }
  // Add accessible names to the SVGs
  const logoSvg = document.querySelector('.logo svg');
  if (logoSvg && !logoSvg.getAttribute('aria-label') && !logoSvg.querySelector('title')) {
    logoSvg.setAttribute('aria-label', 'Site Logo');
  }
  const iconSvg1 = document.querySelector('.icon-1 svg');
  if (iconSvg1 && !iconSvg1.getAttribute('aria-label') && !iconSvg1.querySelector('title')) {
    iconSvg1.setAttribute('aria-label', 'Icon 1');
  }
  // Ensure unique landmarks - include all landmark roles
  const landmarkRoles = [
    { role: 'banner', label: 'Site Header' },
    { role: 'navigation', label: 'Main Navigation' },
    { role: 'main', label: 'Main Content' },
    { role: 'contentinfo', label: 'Site Footer' },
    { role: 'search', label: 'Site Search' }
  ];
  landmarkRoles.forEach((landmark, index) => {
    const element = document.querySelector(`[role="${landmark.role}"]`);
    if (element) {
      const uniqueId = `landmark-${landmark.role}-${index}`;
      element.setAttribute('aria-labelledby', uniqueId);
      const existingLabel = element.querySelector(`#${uniqueId}`);
      if (!existingLabel) {
        const label = document.createElement('span');
        label.id = uniqueId;
        label.textContent = landmark.label;
        label.style.display = 'none';
        element.insertBefore(label, element.firstChild);
      }
    }
  });
  // Ensure login link has accessible name if it's just an icon
  if (loginLink && !loginLink.textContent.trim() && !loginLink.getAttribute('aria-label')) {
    loginLink.setAttribute('aria-label', 'Login');
  }
  // Fix table structure issues - integrated from both branches
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // First approach: Add proper table headers with unique IDs
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(thead ? thead.rows : []);
    if (rows.length > 0) {
      rows.forEach((rowHeader, indexHeader) => {
        const columnCells = Array.from(rowHeader.children);
        const columnHeaders = [];
        tbody.querySelectorAll('tr th, tr td').forEach((cell) => {
          if (!columnHeaders.includes(cell)) {
            columnHeaders.push(cell);
          }
        });
        if (columnHeaders.length > indexHeader) {
          columnCells.forEach((headerCell) => {
            headerCell.setAttribute('id', `header-${columnHeaders[indexHeader].textContent.toLowerCase().replace(/\s/g, '-')}`);
            headerCell.setAttribute('scope', 'col');
          });
        }
      });
    }
    
    // Second approach: Create unique IDs for each column and set scope
    const headerCells = Array.from(table.querySelectorAll('th, td'));
    if (headerCells.length === 0) return;
    
    const columnIds = [];
    headerCells.forEach((cell, index) => {
      const id = `table-column-${index}`;
      cell.setAttribute('data-col-id', id);
      columnIds.push(id);
    });
    
    // Set scope for each column header
    table.querySelectorAll('th, td').forEach((cell, index) => {
      if (columnIds[index]) {
        cell.setAttribute('scope', 'col');
      }
    });
  });
}

// Function to add missing ARIA labels and improve accessibility
function addMissingAriaLabels() {
  // Ensure all SVG elements have accessible labels
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const fallbackLabel = svg.getAttribute('aria-label') || 'Icon';
      svg.setAttribute('aria-label', fallbackLabel);
    }
  });
  // Ensure elements that act as buttons have accessible names
  document.querySelectorAll('[role="button"]').forEach(el => {
    if (!el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Activate');
    }
  });
  // Ensure search inputs have accessible names
  const searchInput = document.querySelector('.search-form input[type="search"], .search-form button');
  if (searchInput && !searchInput.hasAttribute('aria-label')) {
    searchInput.setAttribute('aria-label', 'Search this site');
  }
}

// Add lang attribute to HTML (REACT_015)
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// Fix landmark issues (REACT_017 & REACT_025)
function fixLandmarkIssues() {
  // Ensure landmarks are added via the main addLandmarks routine
  addLandmarks();
}

// Add accessible names to SVGs (REACT_041)
function addSvgAccessibleNames() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', 'Icon');
    }
  });
}

// Fix fake link issue (REACT_036)
function fixFakeLinks() {
  document.querySelectorAll('a[href="#"], a[href=""][role="button"]').forEach(a => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = a.textContent || 'Link';
    btn.setAttribute('aria-label', 'Activate');
    a.replaceWith(btn);
  });
}

// Placeholder export for missing components
function exportMissingComponents() {
  // Placeholder function to demonstrate export of missing components
}

// Placeholder export for additional utility functions
function exportAdditionalUtilityFunctions() {
  // Placeholder function to demonstrate export of additional utility functions
}

// Export functions
export {
  icons,
  checkDependencyStatus,
  getDependencyAlerts,
  myFunction,
  addLandmarks,
  addMissingAriaLabels,
  addLangAttribute,
  fixLandmarkIssues,
  addSvgAccessibleNames,
  fixFakeLinks,
  exportMissingComponents,
  exportAdditionalUtilityFunctions
};