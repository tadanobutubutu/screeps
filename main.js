// main.js - Accessibility fixes applied

// Add the scope attributes to the table headers in the dependency graph
export function updateDependencyGraphTable() {
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

//aron-edited: Integrated updates from both branches

// main.js - Accessibility fixes applied

// Fix 1: Add lang attribute to html element
// This should be in your _document.js or html file:
// <html lang="en">

// Fix 6: Replace fake links with real anchor elements
// BAD: <div onClick={handleClick}>Click here</div>
// GOOD: <a href="/destination" onClick={handleClick}>Click here</a>
// OR if it's not a navigation: <button onClick={handleClick}>Click here</button>

export const FakeLink = ({ onClick, children }) => (
  // Fixed: Using proper button element instead of fake link
  <button
    type="button"
    onClick={onClick}
    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit' }}
  >
    {children}
  </button>
);

// Fix 4: Add accessible names to SVG elements
export const Icon = ({ name, size = 24 }) => (
  <svg
    width={size}
    height={size}
    aria-label={name} // Fixed: Added aria-label for screen readers
    role="img"
  >
    <use href={`#icon-${name}`} />
  </svg>
);

// Fix 4: Alternative with aria-labelledby reference
export const DecorativeIcon = ({ titleId }) => (
  <svg
    width="24"
    height="24"
    aria-labelledby={titleId} // Fixed: Links to title element
    role="img"
  >
    <title id={titleId}>Icon description</title>
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// Fix 2 & Fix 3: Proper table structure with landmarks
export const DataTable = ({ headers, rows }) => (
  <main> {/* Fix 3: Proper main landmark */}
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th> // Fixed: Added scope
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </main>
);

// Fix 3: Proper landmark structure
export const PageLayout = ({ children }) => (
  <>
    <header> {/* Fix 3: Header landmark */}
      <nav aria-label="Main navigation"> {/* Fix 3: Nav with label for uniqueness */}
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>

     <main id="main-content"> {/* Fix 3: Main landmark */}
      {children}
    </main>

    <footer> {/* Fix 3: Footer landmark */}
      <p>Copyright 2024</p>
    </footer>
  </>
);

// Fix 5: Unique landmark example with aria-labels for disambiguation
export const NavigationMenus = () => (
  <>
    <nav aria-label="Primary navigation">
      {/* Primary nav content */}
    </nav>

    <nav aria-label="Secondary navigation">
      {/* Secondary nav content */}
    </nav>

    <nav aria-label="Footer navigation">
      {/* Footer nav content */}
    </nav>
  </>
);

// Utility function to generate proper table headers
export const TableHeader = ({ children }) => (
  <th scope="col">{children}</th>
);

// Utility function for table cells in header row
export const TableHeadCell = ({ children }) => (
  <th scope="col">{children}</th>
);

// Utility function for table cells in body
export const TableBodyCell = ({ children }) => (
  <td>{children}</td>
);

// Accessible SVG with title and description
export const AccessibleSVG = ({ title, description, children }) => (
  <svg
    role="img"
    aria-labelledby="svg-title svg-desc"
  >
    <title id="svg-title">{title}</title>
    <desc id="svg-desc">{description}</desc>
    {children}
  </svg>
);

// Export all utilities
export default {
  FakeLink,
  Icon,
  DecorativeIcon,
  DataTable,
  PageLayout,
  NavigationMenus,
  TableHeader,
  TableHeadCell,
  TableBodyCell,
  AccessibleSVG,
};