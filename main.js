// Accessibility issues from insight report addressed
// Added accessibility-related functionality
// Import required modules
import { icons, checkDependencyStatus, getDependencyAlerts, myFunction, dependencyGraphContent } from './dependencies.js';

// Export required functions that might have been removed
export { addLandmarks, addMissingAriaLabels, fixTableStructure };

// Function to add landmark roles and fix landmark issues
export function addLandmarks() {
  // Add lang attribute to HTML (REACT_015)
  const html = document.documentElement;
  if (html) {
    html.setAttribute('lang', 'en');
  }
  
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
      container.appendChild(mainContent);
    } else {
      const table = document.querySelector('table');
      if (table) {
        table.parentNode.insertBefore(mainContent, table);
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
      document.body.insertBefore(mainContent, document.body.firstChild);
    }
  } else {
    mainContent.setAttribute('role', 'main');
  }
  
  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }
  
  const searchForm = document.querySelector('form.search');
  if (searchForm) {
    searchForm.setAttribute('role', 'search');
  }
  
  const loginLink = document.querySelector('a[href*="login"]');
  if (loginLink) {
    loginLink.setAttribute('role', 'link');
  }
  
  const logoSvg = document.querySelector('.logo svg');
  if (logoSvg) {
    const title = document.createElement('title');
    title.textContent = 'Site Logo';
    logoSvg.insertBefore(title, logoSvg.firstChild);
    logoSvg.setAttribute('role', 'img');
  }
  
  const iconSvg1 = document.querySelector('.icon svg');
  if (iconSvg1) {
    const title = document.createElement('title');
    title.textContent = 'Icon 1';
    iconSvg1.insertBefore(title, iconSvg1.firstChild);
    iconSvg1.setAttribute('role', 'img');
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
      const uniqueId = `landmark-label-${index}`;
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
  
  if (loginLink && !loginLink.textContent.trim()) {
    loginLink.textContent = 'Login';
  }
  
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      rows.forEach((rowHeader, indexHeader) => {
        const columnCells = Array.from(tbody.querySelectorAll('tr td')).filter((cell) => cell.cellIndex === indexHeader);
        const columnHeaders = [];
        tbody.querySelectorAll('tr th, tr td').forEach((cell) => {
          if (!columnHeaders.includes(cell)) {
            columnHeaders.push(cell);
          }
        });
        if (columnCells.length > indexHeader) {
          columnCells.forEach((headerCell, idx) => {
            headerCell.setAttribute('id', `${table.alt || 'table'}-${indexHeader}-${idx}`);
            headerCell.setAttribute('scope', 'col');
          });
        }
      });
    }
    
    const headerCells = table.querySelectorAll('thead th');
    if (headerCells.length === 0) return;
    const columnIds = [];
    headerCells.forEach((cell, index) => {
      const id = cell.id || `header-${index}`;
      cell.id = id;
      columnIds.push(id);
    });
    table.querySelectorAll('tbody td').forEach((cell, index) => {
      if (columnIds[index]) {
        cell.setAttribute('headers', columnIds[index]);
        cell.setAttribute('scope', 'col');
      }
    });
  });
}

// Function to add missing ARIA labels and improve accessibility
export function addMissingAriaLabels() {
  // Fix REACT_041: SVG Accessible Name
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((el) => {
    if (!el.textContent.trim() && !el.getAttribute('aria-label') && !el.querySelector('title')) {
      const fallbackLabel = el.getAttribute('title') || 'Icon';
      el.setAttribute('aria-label', fallbackLabel);
    }
  });
  
  // Fix REACT_036: Fake Link - ensure links have proper accessible names
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach((el) => {
    if (el && !el.textContent.trim() && !el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Activate');
    }
  });
  
  const searchInput = document.querySelector('input[type="search"], .search-form button');
  if (searchInput) {
    searchInput.setAttribute('aria-label', 'Search this site');
  }
}

// NEW FUNCTION: Fix table structure issues (REACT_027)
export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, tableIndex) => {
    // Ensure a caption is present for accessibility
    let caption = table.querySelector('caption');
    if (!caption) {
      caption = document.createElement('caption');
      caption.textContent = `Table ${tableIndex + 1}`;
      caption.className = 'visually-hidden';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure thead exists for header rows
    let thead = table.querySelector('thead');
    if (!thead) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead = document.createElement('thead');
        table.insertBefore(thead, table.firstChild);
        thead.appendChild(firstRow);
      }
    }

    // Ensure tbody exists for data rows
    let tbody = table.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      const rows = Array.from(table.querySelectorAll('tr'));
      if (thead) {
        rows.shift();
      }
      rows.forEach((row) => {
        if (thead && row.parentNode === thead) return;
        tbody.appendChild(row);
      });
      if (thead) table.insertBefore(tbody, thead.nextSibling);
      else table.appendChild(tbody);
    }

    // Assign proper scope attributes to header cells
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach((header, idx) => {
      if (!header.hasAttribute('scope')) {
        const isFirstColumn = idx === 0;
        const columnHeaders = table.querySelectorAll('tbody tr').length;
        if (isFirstColumn && columnHeaders > 1) {
          header.setAttribute('scope', 'row');
        } else {
          header.setAttribute('scope', 'col');
        }
      }
    });
  });
}