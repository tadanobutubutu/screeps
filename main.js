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

// NEW FUNCTION: Fix table structure issues (REACT_027)
function fixTableStructureIssues() {
  document.querySelectorAll('table').forEach((table, tableIndex) => {
    // Ensure a caption is present for accessibility
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${tableIndex + 1}`;
      caption.className = 'visually-hidden';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure thead exists for header rows
    let thead = table.querySelector('thead');
    if (!thead) {
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.querySelector('th, td')) {
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
      // Remove header rows that were moved to thead
      if (thead) {
        rows.shift();
      }
      rows.forEach(row => {
        // Skip rows already placed in thead
        if (thead && row.parentNode === thead) return;
        tbody.appendChild(row);
      });
      if (thead) {
        thead.parentNode.insertBefore(tbody, thead.nextSibling);
      } else {
        table.appendChild(tbody);
      }
    }

    // Assign proper scope attributes to header cells
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach((header, idx) => {
      if (!header.hasAttribute('scope')) {
        // Determine if header represents a column or a row
        const isFirstColumn = idx === 0;
        const columnHeaders = Array.from(table.querySelectorAll('tr th'));
        const isRowHeader = columnHeaders.some(th => th === header && th.cellIndex === 0 && columnHeaders.filter(c => c.cellIndex === 0).length > 1);
        header.setAttribute('scope', isRowHeader ? 'row' : 'col');
      }
      if (!header.hasAttribute('id')) {
        const headerText = header.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        header.setAttribute('id', `table-${tableIndex}-header-${idx}-${headerText || `col${idx}`}`);
      }
    });

    // Associate data cells with their corresponding headers via the headers attribute
    const dataCells = table.querySelectorAll('tbody td, tbody th');
    dataCells.forEach(cell => {
      const headers = [];
      // Find column header
      const colIndex = Array.from(cell.parentNode.children).indexOf(cell);
      const colHeader = table.querySelector(`thead th:nth-child(${colIndex + 1})`);
      if (colHeader && colHeader.hasAttribute('id')) {
        headers.push(colHeader.id);
      }
      // Find row header (first cell of the row)
      const rowHeader = cell.closest('tr').querySelector('th');
      if (rowHeader && rowHeader.hasAttribute('id')) {
        headers.push(rowHeader.id);
      }
      if (headers.length) {
        cell.setAttribute('headers', headers.join(' '));
      }
    });

    // Add an ARIA description for the table if not already present
    const ariaDescId = `table-${tableIndex}-description`;
    let ariaDesc = document.getElementById(ariaDescId);
    if (!ariaDesc) {
      ariaDesc = document.createElement('span');
      ariaDesc.id = ariaDescId;
      ariaDesc.className = 'visually-hidden';
      ariaDesc.textContent = `Table ${tableIndex + 1}`;
      document.body.appendChild(ariaDesc);
    }
    if (!table.hasAttribute('aria-describedby')) {
      table.setAttribute('aria-describedby', ariaDescId);
    }

    // Ensure nested tables are also structured correctly
    const nestedTables = table.querySelectorAll('table');
    nestedTables.forEach(nested => fixTableStructureIssuesHelper(nested));
  });
}

// Helper to apply the same fixes to nested tables
function fixTableStructureIssuesHelper(table) {
  // Re‑apply caption check
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = `Nested Table`;
    caption.className = 'visually-hidden';
    table.insertBefore(caption, table.firstChild);
  }

  // Ensure thead/tbody as above (same logic, simplified)
  let thead = table.querySelector('thead');
  if (!thead) {
    const firstRow = table.querySelector('tr');
    if (firstRow && firstRow.querySelector('th')) {
      thead = document.createElement('thead');
      table.insertBefore(thead, table.firstChild);
      thead.appendChild(firstRow);
    }
  }

  let tbody = table.querySelector('tbody');
  if (!tbody) {
    tbody = document.createElement('tbody');
    const rows = Array.from(table.querySelectorAll('tr'));
    if (thead) rows.shift(); // skip header row removed earlier
    rows.forEach(row => {
      if (thead && row.parentNode === thead) return;
      tbody.appendChild(row);
    });
    if (thead) thead.parentNode.insertBefore(tbody, thead.nextSibling);
    else table.appendChild(tbody);
  }

  // Ensure headers have proper scope and id
  const headerCells = table.querySelectorAll('thead th');
  headerCells.forEach((h, i) => {
    if (!h.hasAttribute('scope')) {
      const isRowHeader = table.querySelectorAll('tr th:first-child').length > 1 && i === 0;
      h.setAttribute('scope', isRowHeader ? 'row' : 'col');
    }
    if (!h.hasAttribute('id')) {
      const txt = h.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      h.setAttribute('id', `nested-${txt || i}`);
    }
  });
}

// NEW FUNCTION: Ensure unique landmarks (REACT_025)
function ensureUniqueLandmarks() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo', 'search', 'complementary', 'region'];
  const landmarkCounts = {};

  // Count existing landmarks
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    landmarkCounts[role] = elements.length;
  });

  // Fix duplicate landmarks by making them unique
  landmarkRoles.forEach(role => {
    if (landmarkCounts[role] > 1) {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((element, index) => {
        // Add unique accessible name
        const uniqueLabel = `${role.charAt(0).toUpperCase() + role.slice(1)} ${index + 1}`;
        const labelId = `${role}-label-${index}`;
        
        // Remove existing aria-labelledby if present
        if (element.hasAttribute('aria-labelledby')) {
          element.removeAttribute('aria-labelledby');
        }
        
        // Add hidden label for screen readers
        let label = element.querySelector(`#${labelId}`);
        if (!label) {
          label = document.createElement('span');
          label.id = labelId;
          label.textContent = uniqueLabel;
          label.style.position = 'absolute';
          label.style.width = '1px';
          label.style.height = '1px';
          label.style.padding = '0';
          label.style.margin = '-1px';
          label.style.overflow = 'hidden';
          label.style.clip = 'rect(0, 0, 0, 0)';
          label.style.whiteSpace = 'nowrap';
          label.style.border = '0';
          element.insertBefore(label, element.firstChild);
        }
        
        element.setAttribute('aria-labelledby', labelId);
        
        // For navigation landmarks, distinguish them
        if (role === 'navigation') {
          const navLabel = index === 0 ? 'Primary Navigation' : `Secondary Navigation ${index}`;
          label.textContent = navLabel;
        }
        
        // For region landmarks, ensure they have accessible names
        if (role === 'region' && !element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          element.setAttribute('aria-label', `Region ${index + 1}`);
        }
      });
    } else if (landmarkCounts[role] === 1) {
      // Single landmark - ensure it has proper labeling
      const element = document.querySelector(`[role="${role}"]`);
      if (element) {
        const labelId = `${role}-label-0`;
        let label = element.querySelector(`#${labelId}`);
        if (!label) {
          label = document.createElement('span');
          label.id = labelId;
          label.textContent = role.charAt(0).toUpperCase() + role.slice(1);
          label.style.position = 'absolute';
          label.style.width = '1px';
          label.style.height = '1px';
          label.style.padding = '0';
          label.style.margin = '-1px';
          label.style.overflow = 'hidden';
          label.style.clip = 'rect(0, 0, 0, 0)';
          label.style.whiteSpace = 'nowrap';
          label.style.border = '0';
          element.insertBefore(label, element.firstChild);
        }
        if (!element.hasAttribute('aria-labelledby') && !element.hasAttribute('aria-label')) {
          element.setAttribute('aria-labelledby', labelId);
        }
      }
    }
  });

  // Handle main landmark specifically - should be unique
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0) {
        // Convert additional main elements to region
        main.removeAttribute('role');
        main.setAttribute('role', 'region');
        main.setAttribute('aria-label', `Additional Content ${index}`);
      }
    });
  }

  // Ensure banner and contentinfo are unique (per spec)
  ['banner', 'contentinfo'].forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          // Convert to region
          element.removeAttribute('role');
          element.setAttribute('role', 'region');
          element.setAttribute('aria-label', `${role.charAt(0).toUpperCase() + role.slice(1)} ${index + 1}`);
        }
      });
    }
  });
}

// Export functions
export { icons, checkDependencyStatus, getDependencyAlerts, myFunction, addLandmarks, addMissingAriaLabels, fixTableStructureIssues, ensureUniqueLandmarks };