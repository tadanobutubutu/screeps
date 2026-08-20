// main.js - Accessibility fixes for all 6 open checks

import React from 'react';

// ============================================
// REACT_015: React Language Attribute (critical)
// Fix: Add lang attribute to html element
// ============================================
export const HtmlDocument = ({ children, lang = 'en' }) => (
  <html lang={lang}>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>{children}</body>
  </html>
);

// ============================================
// REACT_027: React Table Structure (warning)
// Fix: Proper table structure with thead, tbody, and scope attributes
// ============================================
export const AccessibleTable = ({ headers, rows }) => (
  <table>
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
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// ============================================
// REACT_017: React Landmarks (warning)
// REACT_025: React Unique Landmarks (warning)
// Fix: Proper landmark elements, unique main landmark
// ============================================
export const AccessiblePage = ({ children }) => (
  <div>
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
    
    <main role="main" id="main-content">
      {children}
    </main>
    
    <footer role="contentinfo">
      <p>&copy; 2024 Company Name</p>
    </footer>
  </div>
);

// ============================================
// REACT_041: React SVG Accessible Name (warning)
// Fix: Add aria-label or title element to SVGs
// ============================================
export const AccessibleIcon = ({ name, size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label={name}
    role="img"
  >
    <title>{name}</title>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

export const IconWithAriaHidden = ({ onClick }) => (
  <button onClick={onClick} aria-label="Close dialog">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="img"
    >
      <title>Close icon</title>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
    </svg>
  </button>
);

// ============================================
// REACT_036: React Fake Link (warning)
// Fix: Use proper anchor elements or buttons for links
// ============================================
export const RealLink = ({ href, children }) => (
  <a href={href}>{children}</a>
);

export const RealButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

// ============================================
// Combined example with all fixes applied
// ============================================
export const AccessibleComponent = () => (
  <HtmlDocument lang="en">
    <AccessiblePage>
      <section>
        <h1>Dashboard</h1>
        
        {/* Table with proper structure */}
        <AccessibleTable
          headers={['Name', 'Status', 'Actions']}
          rows={[
            ['Project A', 'Active', 'View'],
            ['Project B', 'Pending', 'Edit'],
          ]}
        />
        
        {/* SVG icons with accessible names */}
        <div>
          <AccessibleIcon name="Settings gear icon" />
          <IconWithAriaHidden onClick={() => {}} />
        </div>
        
        {/* Real links instead of fake ones */}
        <nav aria-label="Actions">
          <RealLink href="/dashboard">Back to Dashboard</RealLink>
          <RealButton onClick={() => {}}>Export Data</RealButton>
        </nav>
        
        {/* Additional content area */}
        <aside role="complementary" aria-label="Related information">
          <h2>Quick Stats</h2>
          <p>Loading...</p>
        </aside>
      </section>
    </AccessiblePage>
  </HtmlDocument>
);

export default AccessibleComponent;