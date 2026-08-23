// main.js - Accessible Next.js Page
import { Html, Head, Main, NextScript } from 'next/document';

// Example: Custom Document with proper lang attribute (fixes REACT_015)
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        {/* Example: Proper landmark structure (fixes REACT_017, REACT_025) */}
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        
        <Header />
        
        <main id="main-content" role="main">
          <AccessibleTable />
          <AccessibleLinks />
          <AccessibleSVGs />
        </main>
        
        <Footer />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// Accessible Header with proper landmarks
function Header() {
  return (
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
  );
}

// Accessible Footer
function Footer() {
  return (
    <footer role="contentinfo">
      <p>© 2024 Company Name</p>
    </footer>
  );
}

// Fixed Table Structure (fixes REACT_027)
function AccessibleTable() {
  return (
    <table>
      <caption>Monthly Sales Report</caption>
      <thead>
        <tr>
          <th scope="col">Month</th>
          <th scope="col">Revenue</th>
          <th scope="col">Expenses</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">January</th>
          <td>$10,000</td>
          <td>$5,000</td>
        </tr>
        <tr>
          <th scope="row">February</th>
          <td>$12,000</td>
          <td>$4,500</td>
        </tr>
      </tbody>
    </table>
  );
}

// Fixed Links (fixes REACT_036)
function AccessibleLinks() {
  return (
    <div>
      {/* Real links that navigate */}
      <a href="/products" onClick={(e) => { e.preventDefault(); }}>
        View Products
      </a>
      
      {/* For JavaScript actions, use button */}
      <button type="button" onClick={() => handleAction()}>
        Perform Action
      </button>
    </div>
  );
}

// Fixed SVGs with accessible names (fixes REACT_041)
function AccessibleSVGs() {
  return (
    <div>
      {/* SVG with aria-label */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        aria-label="Close menu"
        role="img"
      >
        <path d="M6 18L18 6M6 6l12 12" />
      </svg>
      
      {/* Decorative SVG - marked as presentation */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="presentation"
      >
        <circle cx="12" cy="12" r="10" fill="blue" />
      </svg>
    </div>
  );
}

// Utility styles for screen reader only content
const styles = `
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
`;

// CSS to be added to globals.css
export const accessibilityStyles = styles;