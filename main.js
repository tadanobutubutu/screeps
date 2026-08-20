// main.js - Fixed accessibility issues

import React from 'react';

// Fix 1: SVG Component with accessible names (addresses REACT_041)
// Added title and desc elements, plus aria-labelledby
const AccessibleIcon = ({ className }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    aria-labelledby="icon-title icon-desc"
    role="img"
  >
    <title id="icon-title">Icon</title>
    <desc id="icon-desc">A decorative icon for visual representation</desc>
    <circle cx="12" cy="12" r="10" fill="currentColor" />
  </svg>
);

// Fix 2: Proper Button component (addresses REACT_036)
// Using button instead of div/a for clickable elements
const CustomButton = ({ onClick, children, className }) => (
  <button 
    type="button"
    onClick={onClick} 
    className={className}
    aria-label="Click to perform action"
  >
    {children}
  </button>
);

// Fix 3: Navigation with proper landmarks (addresses REACT_017, REACT_025)
// Using nav element with unique aria-label
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

// Fix 4: Accessible Table (addresses REACT_027)
// Adding thead, tbody, proper th with scope
const AccessibleTable = ({ data, columns }) => (
  <table>
    <caption className="sr-only">Data table showing results</caption>
    <thead>
      <tr>
        {columns.map((col, index) => (
          <th key={index} scope="col">{col.header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {columns.map((col, colIndex) => (
            <td key={colIndex}>{row[col.accessor]}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

// Fix 5: Main content landmark (addresses REACT_017)
// Proper main element for landmark
const MainContent = ({ children }) => (
  <main id="main-content" role="main">
    {children}
  </main>
);

// Fix 6: Header with proper landmark
const Header = ({ title }) => (
  <header role="banner">
    <h1>{title}</h1>
  </header>
);

// Fix 7: Footer with proper landmark
const Footer = () => (
  <footer role="contentinfo">
    <p>Copyright 2024</p>
  </footer>
);

// Fix 8: App wrapper with lang attribute (addresses REACT_015)
const App = ({ children }) => (
  <div lang="en">
    <a href="#main-content" className="sr-only sr-only-focusable">
      Skip to main content
    </a>
    {children}
  </div>
);

// Screen reader only CSS class helper
const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0'
};

// Demo component showing all fixes together
const AccessiblePage = () => {
  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  const tableColumns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' }
  ];

  const tableData = [
    { name: 'Item 1', description: 'First item' },
    { name: 'Item 2', description: 'Second item' }
  ];

  return (
    <App>
      <Header title="Accessible Page" />
      <Navigation links={navLinks} />
      <MainContent>
        <AccessibleTable data={tableData} columns={tableColumns} />
        <CustomButton onClick={() => console.log('clicked')}>
          <AccessibleIcon className="icon" />
          Submit
        </CustomButton>
      </MainContent>
      <Footer />
    </App>
  );
};

export {
  AccessibleIcon,
  CustomButton,
  Navigation,
  AccessibleTable,
  MainContent,
  Header,
  Footer,
  App,
  AccessiblePage
};

export default AccessiblePage;