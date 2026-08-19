// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code (preserved)
const App = () => {
  // ... existing app code ...
};

// Existing exports (preserved)
export { App };

// Accessible SVG - combining both approaches for best accessibility
const AccessibleSVG = ({ title, description, children }) => {
  // Use aria-labelledby for semantic labeling, respecting aria-hidden if set
  const ariaHidden = props['aria-hidden'] !== undefined ? props['aria-hidden'] : true;
  return (
    <svg
      {...props}
      aria-hidden={ariaHidden}
      role={props.role || "img"}
      aria-labelledby={`svg-title svg-desc`}
    >
      {children}
    </svg>
  );
};

// Update the layout components to use the accessible SVG
const Layout = ({ children }) => {
  return (
    <div>
      <AccessibleSVG>
        <title>Application Logo</title>
      </AccessibleSVG>
      {children}
    </div>
  );
};

// Export the updated layout
export { Layout };

// Dashboard layout with accessible SVG
const DashboardLayout = ({ children }) => {
  return (
    <div>
      <AccessibleSVG aria-label="Dashboard Icon">
        <title>Dashboard Icon</title>
      </AccessibleSVG>
      {children}
    </div>
  );
};

// Export the dashboard layout
export { DashboardLayout };

// New components from origin/main with accessibility improvements
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

// Improved table structure with landmarks
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

// Enhanced page layout with proper landmark structure
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

// Additional navigation menus with unique labels
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

// Utility functions for table cells
export const TableHeader = ({ children }) => (
  <th scope="col">{children}</th>
);

export const TableHeadCell = ({ children }) => (
  <th scope="col">{children}</th>
);

export const TableBodyCell = ({ children }) => (
  <td>{children}</td>
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