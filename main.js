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

// NEW FUNCTION: Fix table structure issues (REACT_027)
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, tableIndex) => {
    // Ensure table has caption if it has meaningful data
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${tableIndex + 1}`;
      caption.style.display = 'none';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure thead exists for tables with header rows
    let thead = table.querySelector('thead');
    if (!thead) {
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.querySelector('th')) {
        thead = document.createElement('thead');
        table.insertBefore(thead, table.firstChild);
        thead.appendChild(firstRow);
      }
    }

    // Ensure tbody exists for data rows
    let tbody = table.querySelector('tbody');
    if (!tbody) {
      tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr:not(:first-child)');
      rows.forEach(row => tbody.appendChild(row));
      if (thead) {
        thead.parentNode.insertBefore(tbody, thead.nextSibling);
      } else {
        table.appendChild(tbody);
      }
    }

    // Fix header cell scope attributes
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        // Determine if column or row header based on context
        const parentRow = th.closest('tr');
        const isFirstRow = parentRow === table.querySelector('tr');
        const hasRowHeaders = table.querySelectorAll('tr th:first-child').length > 1;
        
        if (isFirstRow && !hasRowHeaders) {
          th.setAttribute('scope', 'col');
        } else if (hasRowHeaders && th === parentRow.querySelector('th:first-child')) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
      
      // Add unique IDs for header association
      if (!th.hasAttribute('id')) {
        const text = th.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        th.setAttribute('id', `table-${tableIndex}-header-${index}-${text || index}`);
      }
    });

    // Associate data cells with headers
    const dataCells = table.querySelectorAll('td');
    dataCells.forEach((td, cellIndex) => {
      const row = td.closest('tr');
      const rowIndex = Array.from(row.parentNode.children).indexOf(row);
      const cellIndexInRow = Array.from(row.children).indexOf(td);
      
      // Find corresponding header
      const headers = [];
      if (thead) {
        const colHeader = thead.querySelectorAll('th')[cellIndexInRow];
        if (colHeader && colHeader.hasAttribute('id')) {
          headers.push(colHeader.id);
        }
      }
      
      // Check for row header
      const rowHeader = row.querySelector('th');
      if (rowHeader && rowHeader.hasAttribute('id')) {
        headers.push(rowHeader.id);
      }
      
      if (headers.length > 0) {
        td.setAttribute('headers', headers.join(' '));
      }
    });

    // Fix nested tables - ensure they have proper structure
    const nestedTables = table.querySelectorAll('table');
    nestedTables.forEach((nestedTable, nestedIndex) => {
      if (!nestedTable.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = `Nested Table ${nestedIndex + 1}`;
        caption.style.display = 'none';
        nestedTable.insertBefore(caption, nestedTable.firstChild);
      }
    });

    // Ensure proper heading structure in table headers
    table.querySelectorAll('th').forEach(th => {
      if (!th.querySelector('h1, h2, h3, h4, h5, h6') && th.textContent.trim()) {
        // Headers should not contain heading elements, but ensure text is accessible
        const hasAbbr = th.hasAttribute('abbr');
        if (!hasAbbr && th.textContent.length > 20) {
          th.setAttribute('abbr', th.textContent.substring(0, 20) + '...');
        }
      }
    });
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