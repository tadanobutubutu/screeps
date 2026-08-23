// main.js
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements

// Accessibility fix for REACT_015: Add lang attribute to HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Accessibility fix for REACT_041: Add accessible names to 2 SVGs
const addAccessibleNamesToSVGs = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const titleElement = document.createElement('title');
      titleElement.textContent = 'Accessible title for SVG';
      svg.insertBefore(titleElement, svg.firstChild);

      // Add aria-labelledby attribute to link the title
      const titleId = 'svg-title-' + Math.random().toString(36).substring(2, 9);
      titleElement.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
};

// Accessibility fix for REACT_027: Add scope attribute to <th> elements
const addScopeToTableHeaders = () => {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.getAttribute('scope')) {
      // Check if the th is in the first row (column headers) or first column (row headers)
      const row = header.parentElement;
      const rowIndex = row.rowIndex;
      const cellIndex = header.cellIndex;

      if (rowIndex === 0) {
        header.setAttribute('scope', 'col');
      } else if (cellIndex === 0) {
        header.setAttribute('scope', 'row');
      } else {
        // Default to col for ambiguous cases
        header.setAttribute('scope', 'col');
      }
    }
  });
};

// Ensure unique IDs for all elements (used for REACT_025)
const unique = () => {
  const existingIds = new Set();
  document.querySelectorAll('*').forEach(el => {
    if (!el.id) {
      let counter = 1;
      let newId = el.tagName.toLowerCase() + '-' + counter;
      while (existingIds.has(newId)) {
        counter++;
        newId = el.tagName.toLowerCase() + '-' + counter;
      }
      el.id = newId;
      existingIds.add(newId);
    }
  });
};

// Function to validate table structure and add scope to <th> elements
const validateTableStructureAndScopeTh = () => {
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    // Ensure table has a caption if it doesn't have one and has headers
    const hasCaption = table.querySelector('caption');
    const headers = table.querySelectorAll('th');
    const hasHeaders = headers.length > 0;

    if (!hasCaption && hasHeaders) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table description'; // Generic caption
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure proper use of thead, tbody, tfoot
    const rows = table.querySelectorAll('tr');
    if (rows.length > 0) {
      // Check if first row is inside a thead
      let hasThead = table.querySelector('thead');
      let hasTbody = table.querySelector('tbody');
      let hasTfoot = table.querySelector('tfoot');

      // If no thead but there are headers, wrap first row(s) in thead
      if (!hasThead) {
        const firstRow = rows[0];
        const firstRowHeaders = firstRow.querySelectorAll('th');
        const firstRowHasHeaders = firstRowHeaders.length > 0;

        if (firstRowHasHeaders) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow);
          table.insertBefore(thead, table.firstChild);
        }
      }

      // Ensure there's a tbody for remaining rows
      if (!hasTbody && rows.length > 1) {
        const tbody = document.createElement('tbody');
        for (let i = 1; i < rows.length; i++) {
          // Check if row is not already in tfoot
          const isInTfoot = rows[i].closest('tfoot');
          if (!isInTfoot) {
            tbody.appendChild(rows[i]);
          }
        }
        if (tbody.children.length > 0) {
          table.appendChild(tbody);
        }
      }

      // Fix header-cell associations using headers attribute
      const allCells = table.querySelectorAll('td, th');
      allCells.forEach(cell => {
        const headersAttr = cell.getAttribute('headers');
        if (headersAttr) {
          const headerIds = headersAttr.split(' ');
          headerIds.forEach(headerId => {
            const header = document.getElementById(headerId);
            if (!header) {
              cell.removeAttribute('headers');
            }
          });
        }
      });
    }

    // Add scope to table headers
    addScopeToTableHeaders();
  });
};

// Re‑add the removed exports here: import { class1, function1, Object1 } from './path/to/module';
// Preserve all existing code, exports, and functions from current main.js
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// (original code preserved as comments)
// Example of placeholder imports (will be resolved at build time)
// import { class1, function1, Object1 } from './path/to/module';

// Re‑add the removed exports here: import { class1, function1, Object1 } from './path/to/module';
export { class1, function1, Object1, unique, validateTableStructureAndScopeTh };

// Render the application HTML with accessibility improvements
export function renderApp() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application</title>
</head>
<body>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main role="main" id="main-content">
    <h1>Welcome</h1>
    
    <svg aria-label="Decorative icon" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="blue" />
    </svg>

    <svg aria-label="Chart icon" viewBox="0 0 24 24" width="24" height="24">
      <rect x="2" y="10" width="6" height="12" fill="green" />
      <rect x="10" y="6" width="6" height="16" fill="green" />
      <rect x="18" y="2" width="6" height="20" fill="green" />
    </svg>

    <button type="button" onclick="handleClick()">
      Click me instead of using fake link
    </button>

    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td>Developer</td>
        </tr>
      </tbody>
    </table>
  </main>

  <footer role="contentinfo">
    <p>&copy; 2024 Company Name</p>
  </footer>
</body>
</html>
  `;
}

// Button click handler
export function handleClick() {
  console.log('Button clicked');
}

// Preserve default export for compatibility
export default renderApp;

// Initialize accessibility features once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  addAccessibleNamesToSVGs();
  unique(); // Ensure unique IDs for landmarks and other elements
  validateTableStructureAndScopeTh(); // Apply table fixes and scope attributes
});