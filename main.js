// TODO: Import required module(s) and export the new necessary function(s) here in main.js
// Import required modules
import { icons, checkDependencyStatus, getDependencyAlerts, myFunction, dependencyGraphContent } from './dependencies.js';

// Function to add landmark roles and fix landmark issues
function addLandmarks() {
  // Add lang attribute to HTML
  const html = document.documentElement;
  html.setAttribute('lang', 'en');
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
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.setAttribute('role', 'search');
  }
  const loginLink = document.querySelector('.login-link');
  if (loginLink) {
    loginLink.setAttribute('role', 'link');
  }
  const logoSvg = document.querySelector('.logo svg');
  if (logoSvg && !logoSvg.getAttribute('aria-label') && !logoSvg.querySelector('title')) {
    logoSvg.setAttribute('aria-label', 'Site Logo');
  }
  const iconSvg1 = document.querySelector('.icon-1 svg');
  if (iconSvg1 && !iconSvg1.getAttribute('aria-label') && !iconSvg1.querySelector('title')) {
    iconSvg1.setAttribute('aria-label', 'Icon 1');
  }
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
  if (loginLink && !loginLink.textContent.trim() && !loginLink.getAttribute('aria-label')) {
    loginLink.setAttribute('aria-label', 'Login');
  }
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(thead.rows);
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
  });
  const headerCells = Array.from(table.querySelectorAll('th, td'));
  if (headerCells.length === 0) return;
  const columnIds = [];
  headerCells.forEach((cell, index) => {
    const id = `table-column-${index}`;
    cell.setAttribute('data-col-id', id);
    columnIds.push(id);
  });
  table.querySelectorAll('th, td').forEach((cell, index) => {
    if (columnIds[index]) {
      cell.setAttribute('scope', 'col');
    }
  });
}

// Function to add missing ARIA labels and improve accessibility
function addMissingAriaLabels() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const fallbackLabel = svg.getAttribute('aria-label') || 'Icon';
      svg.setAttribute('aria-label', fallbackLabel);
    }
  });
  document.querySelectorAll('[role="button"]').forEach(el => {
    if (!el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Activate');
    }
  });
  const searchInput = document.querySelector('.search-form input[type="search"], .search-form button');
  if (searchInput && !searchInput.hasAttribute('aria-label')) {
    searchInput.setAttribute('aria-label', 'Search this site');
  }
}

// Export functions
export { icons, checkDependencyStatus, getDependencyAlerts, myFunction, addLandmarks, addMissingAriaLabels };