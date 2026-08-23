// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// For accessibility, when rendering SVGs, add aria-label or <title> elements:
// Example:
// <svg aria-label="Accessible description of the icon" ...>
//   <title>Description for screen readers</title>
//   ...
// </svg>

// For "fake links", ensure they have proper button/link semantics or role attributes:

import React from 'react';

// Accessible SVG component with proper accessible name
export const AccessibleIcon = ({ label = 'Icon', children }) => (
  <svg 
    aria-label={label} 
    role="img"
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    width="24" 
    height="24"
  >
    <title>{label}</title>
    {children}
  </svg>
);

// Accessible table component with proper structure
export const AccessibleTable = ({ headers, rows, caption }) => (
  <table>
    {caption && <caption>{caption}</caption>}
    <thead>
      <tr>
        {headers.map((header, index) => (
          <th key={index} scope="col">{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            cellIndex === 0 ? (
              <th key={cellIndex} scope="row">{cell}</th>
            ) : (
              <td key={cellIndex}>{cell}</td>
            )
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// Fixed "fake link" - either use button or add proper role
export const AccessibleButton = ({ onClick, children, ariaLabel }) => (
  <button 
    type="button" 
    onClick={onClick}
    aria-label={ariaLabel}
  >
    {children}
  </button>
);

// Alternative: if must be a link, add proper semantics
export const AccessibleLink = ({ href, children, ariaLabel }) => (
  <a 
    href={href}
    aria-label={ariaLabel}
  >
    {children}
  </a>
);

// Accessible landmark structure
export const AccessiblePageLayout = ({ 
  logo, 
  nav, 
  mainContent, 
  sidebar, 
  footer 
}) => (
  <>
    <header role="banner">
      {logo}
      <nav role="navigation" aria-label="Main navigation">
        {nav}
      </nav>
    </header>
    
    <div role="main" id="main-content">
      {mainContent}
    </div>
    
    {sidebar && (
      <aside role="complementary" aria-label="Supplementary content">
        {sidebar}
      </aside>
    )}
    
    <footer role="contentinfo">
      {footer}
    </footer>
  </>
);

// Example page component
export default function Page({ data }) {
  return (
    <AccessiblePageLayout
      logo={
        <AccessibleIcon label="Company Logo - Homepage">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
        </AccessibleIcon>
      }
      nav={
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      }
      mainContent={
        <div>
          <h1>Main Content</h1>
          <AccessibleTable 
            caption="Data results"
            headers={['Name', 'Value', 'Status']}
            rows={data.map(item => [item.name, item.value, item.status])}
          />
          <AccessibleButton 
            onClick={() => console.log('clicked')}
            ariaLabel="Submit form"
          >
            Submit
          </AccessibleButton>
        </div>
      }
      sidebar={
        <div>
          <h2>Related Links</h2>
          <ul>
            <li><a href="/link1">Related Link 1</a></li>
            <li><a href="/link2">Related Link 2</a></li>
          </ul>
        </div>
      }
      footer={
        <p>&copy; 2024 Company Name. All rights reserved.</p>
      }
    />
  );
}

// Your existing code here...