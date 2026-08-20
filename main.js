// [Previous existing code remains unchanged]

// Add the scope attributes to the table headers in the dependency graph
function updateDependencyGraphTable() {
  const table = document.querySelector('#dependency-graph-table');
  if (!table) return;

  // Update headers in the first section
  const headers1 = table.querySelectorAll('thead tr:nth-child(1) th');
  headers1.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // Update headers in the second section
  const headers2 = table.querySelectorAll('thead tr:nth-child(2) th');
  headers2.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // Update data cells to ensure proper association
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, index) => {
      if (!cell.hasAttribute('headers')) {
        const headerId = `header-${index}`;
        cell.setAttribute('headers', headerId);
        // Also add id to corresponding header if needed
        const header = table.querySelector(`thead th:nth-child(${index + 1})`);
        if (header && !header.hasAttribute('id')) {
          header.setAttribute('id', headerId);
        }
      }
    });
  });
}

// Call this function when the page loads or when the table is rendered
document.addEventListener('DOMContentLoaded', updateDependencyGraphTable);

// Function to wrap content in main landmark
function wrapContentInMain() {
  // For app/layout.tsx and dashboard/app/layout.tsx
  const body = document.querySelector('body');
  if (body && !body.querySelector('main')) {
    const main = document.createElement('main');
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  }

  // For docs/index.html
  const container = document.querySelector('.container');
  if (container && !container.closest('main')) {
    const main = document.createElement('main');
    container.parentNode.insertBefore(main, container);
    main.appendChild(container);
  }

  // For docs/dependency-graph.html
  const table = document.querySelector('#table-rotated');
  if (table && !table.closest('main')) {
    const main = document.createElement('main');
    table.parentNode.insertBefore(main, table);
    main.appendChild(table);
  }
}

// Call the function to wrap content when the page loads
document.addEventListener('DOMContentLoaded', wrapContentInMain);

// [Rest of the existing code remains unchanged]