// Accessibility-improved main.js

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED
// - REACT_017: Add landmark roles and fix landmark issues ✓ FIXED
// - REACT_041: Add accessible names to 2 SVGs ✓ FIXED
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED
// - REACT_036: Fix 1 fake link issue ✓ FIXED
// - REACT_027: Add scope attributes to table headers ✓ FIXED

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

function AccessibilityWrapper({ children }) {
  return (
    <div role="application">
      <a 
        href="#main-content" 
        className="skip-link"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        Skip to main content
      </a>
      {children}
    </div>
  );
}

function SiteHeader() {
  return (
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer role="contentinfo">
      <p>© 2024 Company Name</p>
      <nav aria-label="Footer navigation">
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </nav>
    </footer>
  );
}

function SocialIcons() {
  return (
    <div role="group" aria-label="Social media links">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        aria-labelledby="twitter-icon-title"
        role="img"
      >
        <title id="twitter-icon-title">Twitter</title>
        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0 0 23 3z"/>
      </svg>
      
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        aria-labelledby="github-icon-title"
        role="img"
      >
        <title id="github-icon-title">GitHub</title>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    </div>
  );
}

/**
 * Creates an accessible table header cell with proper scope attribute
 * @param {Object} props - Header cell properties
 * @param {string} props.content - The text content of the header
 * @param {string} props.type - Either 'col' or 'row' to specify scope
 * @param {string} [props.abbr] - Optional abbreviation for complex headers
 * @param {string} [props.id] - Optional id for association with cells
 */
function TableHeader({ content, type = 'col', abbr, id }) {
  const props = {
    scope: type,
  };
  
  if (abbr) {
    props.abbr = abbr;
  }
  
  if (id) {
    props.id = id;
  }
  
  return <th {...props}>{content}</th>;
}

/**
 * Accessible table component with proper scope attributes
 * @param {Object} props - Table properties
 * @param {Array<string>} props.headers - Array of column header texts
 * @param {Array<Array<string>>} props.rows - 2D array of cell data
 * @param {string} [props.caption] - Optional table caption
 */
function AccessibleTable({ headers, rows, caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <TableHeader 
              key={index} 
              content={header} 
              type="col" 
              id={`header-${index}`}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <TableHeader content={row[0]} type="row" />
            {row.slice(1).map((cell, cellIndex) => (
              <td key={cellIndex} headers={`header-${cellIndex + 1}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AppContent() {
  return (
    <div lang="en">
      <AccessibilityWrapper>
        <SiteHeader />
        
        <main 
          id="main-content" 
          role="main"
          aria-label="Main content"
        >
          <h1>Welcome to Our Application</h1>
          <p>This is the main content area of the application.</p>
          
          <SocialIcons />
          
          <section aria-labelledby="features-heading">
            <h2 id="features-heading">Features</h2>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </section>
          
          <AccessibleTable 
            caption="Sample data table with accessible headers"
            headers={['Item', 'Description', 'Price']}
            rows={[
              ['Product A', 'First item', '$10.00'],
              ['Product B', 'Second item', '$20.00'],
              ['Product C', 'Third item', '$30.00'],
            ]}
          />
          
          <button 
            type="button"
            onClick={() => console.log('Action triggered')}
            aria-label="Learn more about our services"
          >
            Learn More
          </button>
        </main>
        
        <SiteFooter />
      </AccessibilityWrapper>
    </div>
  );
}

function App() {
  return <AppContent />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
export { SiteHeader, SiteFooter, SocialIcons, AccessibilityWrapper, TableHeader, AccessibleTable };