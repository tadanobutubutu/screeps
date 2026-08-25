// Address accessibility issues from insight report

// Implement fixTableStructureIssues to fix table structure issues (updated)
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  for (let table of tables) {
    // Ensure table has caption or summary
    if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('data-table-title') || 'Data table';
      caption.style.display = 'none'; // Visually hidden but accessible
      table.insertBefore(caption, table.firstChild);
    }

    // Fix header cell scopes
    const headerCells = table.querySelectorAll('th');
    for (let th of headerCells) {
      if (!th.getAttribute('scope')) {
        const parentRow = th.closest('tr');
        const parentSection = th.closest('thead, tfoot, tbody');
        if (parentSection && parentSection.tagName.toLowerCase() === 'thead') {
          th.setAttribute('scope', 'col');
        } else if (parentSection && parentSection.tagName.toLowerCase() === 'tfoot') {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    }

    // Associate data cells with headers
    const dataCells = table.querySelectorAll('td');
    for (let td of dataCells) {
      if (!td.getAttribute('headers')) {
        const headers = [];
        const row = td.closest('tr');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        const cellIndex = Array.from(row.children).indexOf(td);

        // Find column headers
        const headerRow = table.querySelector('thead');
        if (headerRow) {
          const headerCells = headerRow.querySelectorAll('th');
          let foundHeader = false;
          for (let hc of headerCells) {
            if (Number(hc.getAttribute('data-cell-index')) === cellIndex) {
              headers.push(hc.id || `col-${cellIndex}`);
              foundHeader = true;
              break;
            }
          }
          if (!foundHeader) {
            headerCells.forEach((hc, i) => {
              if (!hc.id && !headers.includes(`col-${i}`)) {
                hc.id = `col-${i}`;
                headers.push(hc.id);
              }
            });
          }
        }

        // Find row headers
        const firstCell = row.querySelector('th');
        if (firstCell) {
          headers.push(firstCell.id || `row-${rowIndex}`);
        }

        if (headers.length > 0) {
          td.setAttribute('headers', headers.join(' '));
        }
      }
    }
  }
}

// NEW: Fix React SVG Accessible Name issues
function fixSvgAccessibleNames() {
  const svgElements = document.querySelectorAll('svg');
  for (let svg of svgElements) {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = svg.getAttribute('data-description') || 'SVG description';
      svg.insertBefore(title, svg.firstChild);
    }
  }
}

// NEW: Fix React Language Attribute
function fixHtmlLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// NEW: Enhanced table structure fixes for React tables
function fixReactTableStructure() {
  const tables = document.querySelectorAll('table');
  for (let table of tables) {
    // Ensure table has caption or summary
    if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
      const caption = document.createElement('caption');
      caption.textContent = table.getAttribute('data-table-title') || 'Data table';
      caption.style.display = 'none'; // Visually hidden but accessible
      table.insertBefore(caption, table.firstChild);
    }

    // Fix header cell scopes
    const headerCells = table.querySelectorAll('th');
    for (let th of headerCells) {
      if (!th.getAttribute('scope')) {
        const parentRow = th.closest('tr');
        const parentSection = th.closest('thead, tfoot, tbody');
        if (parentSection && parentSection.tagName.toLowerCase() === 'thead') {
          th.setAttribute('scope', 'col');
        } else if (parentSection && parentSection.tagName.toLowerCase() === 'tfoot') {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    }

    // Associate data cells with headers (updated)
    const dataCells = table.querySelectorAll('td');
    for (let td of dataCells) {
      if (!td.getAttribute('headers')) {
        const headers = [];
        const row = td.closest('tr');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row);
        const cellIndex = Array.from(row.children).indexOf(td);

        // Find column headers
        const headerRow = table.querySelector('thead');
        if (headerRow) {
          const headerCells = headerRow.querySelectorAll('th');
          let foundHeader = false;
          for (let hc of headerCells) {
            if (Number(hc.getAttribute('data-cell-index')) === cellIndex) {
              headers.push(hc.id || `col-${cellIndex}`);
              foundHeader = true;
              break;
            }
          }
          if (!foundHeader) {
            headerCells.forEach((hc, i) => {
              if (!hc.id && !headers.includes(`col-${i}`)) {
                hc.id = `col-${i}`;
                headers.push(hc.id);
              }
            });
          }
        }

        // Find row headers
        const firstCell = row.querySelector('th');
        if (firstCell) {
          headers.push(firstCell.id || `row-${rowIndex}`);
        }

        if (headers.length > 0) {
          td.setAttribute('headers', headers.join(' '));
        }
      }
    }
  }
}

module.exports = {
  // ... (Keep the previous exports the same)
  fixTableStructureIssues,
  fixSvgAccessibleNames,
  fixHtmlLanguageAttribute,
  fixReactTableStructure,
  // ... (Keep the newPreservedFunction and runAllAccessibilityFixes the same)
};