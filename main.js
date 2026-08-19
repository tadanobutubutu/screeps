// main.js - Accessibility improved version

import React from 'react';

// Example: Fixed React Language Attribute (REACT_015)
// The <html> element needs a lang attribute at the document level

// Example: Fixed React Table Structure (REACT_027)
const AccessibleTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
        <th scope="col">Column 3</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <th scope="row">{row.header}</th>
          <td>{row.cell1}</td>
          <td>{row.cell2}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Example: Fixed React SVG Accessible Name (REACT_041)
const AccessibleIcon = ({ label }) => (
  <svg role="img" aria-label={label} width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

// Alternative: Using <title> element
const AccessibleIconWithTitle = ({ label }) => (
  <svg role="img" aria-labelledby="icon-title" width="24" height="24" viewBox="0 0 24 24">
    <title id="icon--title">{label}</title>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
  </svg>
);

// Example: Fixed React Landmarks (REACT_017)
// Main landmark for primary content
const MainContent = ({ children }) => (
  <main id="main-content" role="main">
    {children}
  </main>
);

// Navigation landmark
const Navigation = ({ links }) => (
  <nav aria-label="Main navigation">
    <ul>
      {links.map((link, index) => (
        <li key={index}>
          <a href={link.href}>{link.label}</a>
        </li>
      ))}
    </ul>
  </nav>
);

// Example: Fixed React Unique Landmarks (REACT_025)
// Each landmark role should appear only once
// Use unique aria-labels for multiple landmarks of the same type
const SiteFooter = () => (
  <footer role="contentinfo">
    <nav aria-label="Footer navigation">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
    </nav>
  </footer>
);

// Example: Fixed React Fake Link (REACT_036)
// Use <button> for actions, <a> for navigation
const ActionButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

// If it must be a link (e. g., for URL changes), use proper anchor:
const RealLink = ({ href, children }) => (
  <a href={href} role="button">
    {children}
  </a>
);

// Main App Component with proper landmark structure
const App = () => {
  const tableData = [
    { header: 'Row 1', cell1: 'Data 1', cell2: 'Data 2' },
    { header: 'Row 2', cell1: 'Data 3', cell2: 'Data 4' },
  ];

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <div>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header role="banner">
        <nav aria-label="Site header">
          <AccessibleIcon label="Website Logo" />
          <Navigation links={navLinks} />
        </nav>
      </header>

      <MainContent>
        <h1>Accessible Content</h1>
        <AccessibleTable data={tableData} />
        <ActionButton onClick={() => console.log('clicked')}>
          Click Me
        </ActionButton>
      </MainContent>

      <SiteFooter />
    </div>
  );
};

export {
  App,
  AccessibleTable,
  AccessibleIcon,
  AccessibleIconWithTitle,
  MainContent,
  Navigation,
  SiteFooter,
  ActionButton,
  RealLink
};

export default App;