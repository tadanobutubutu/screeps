// main.js - Accessibility fixes applied

// This is a Next.js main entry point example
// The actual file structure depends on your project

// Assuming this is pages/_document.js for Next.js (fixes REACT_015):
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">  {/* Fixed: Added lang attribute (REACT_015) */}
      <Head />
      <body>
        <a href="#main-content">Skip to main content</a>  {/* Fixed: Skip link for accessibility */}
        <header>
          <nav aria-label="Main navigation">  {/* Fixed: Added aria-label (REACT_017) */}
            {/* Navigation items */}
          </nav>
        </header>
        <Main id="main-content" tabIndex="-1">  {/* Fixed: Added main landmark with id (REACT_017) */}
        </Main>
        <footer>  {/* Fixed: Added footer landmark (REACT_017) */}
          <p>
            {/* Fixed: Changed <a> to <button> for non-navigation actions (REACT_036) */}
            <button type="button" onClick={() => console.log('action')}>
              Perform Action
            </button>
          </p>
          {/* Fixed: SVG with aria-label (REACT_041) */}
          <svg aria-label="Close menu" role="img" width="24" height="24">
            <title>Close</title>
            <path d="..." />
          </svg>
        </footer>
        <NextScript />
      </body>
    </Html>
  );
}

// Example table component (fixes REACT_027):
export function AccessibleTable({ data }) {
  return (
    <table>
      <caption>Data Summary</caption>  {/* Fixed: Added caption */}
      <thead>
        <tr>
          <th scope="col">Column 1</th>  {/* Fixed: Added scope */}
          <th scope="col">Column 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.col1}</td>
            <td>{row.col2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Example component with accessible SVG (REACT_041):
export function IconButton({ icon, label, onClick }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      aria-label={label}  // Fixed: Button has accessible name
    >
      <svg 
        aria-hidden="true"  // Fixed: Hidden from screen readers since button has aria-label
        role="img"
        width="20" 
        height="20"
        viewBox="0 0 24 24"
      >
        {icon}
      </svg>
    </button>
  );
}

// Example using icons with proper accessibility (REACT_041):
export function SocialLinks() {
  return (
    <div role="list" aria-label="Social media links">  {/* Fixed: Proper landmark/region */}
      <a href="https://twitter.com" aria-label="Follow us on Twitter">
        <svg aria-hidden="true" role="img">
          <use href="#icon-twitter" />
        </svg>
      </a>
      <a href="https://github.com" aria-label="View our GitHub">
        <svg aria-hidden="true" role="img">
          <use href="#icon-github" />
        </svg>
      </a>
    </div>
  );
}

// Example of landmark with unique identifying label (REACT_025):
export function PageLayout({ children }) {
  return (
    <div>
      <header role="banner">
        <nav aria-label="Primary navigation">
          {/* Nav content */}
        </nav>
      </header>
      <main 
        id="main-content" 
        role="main" 
        aria-label="Main content"  // Fixed: Unique label
      >
        {children}
      </main>
      <aside role="complementary" aria-label="Related information">
        {/* Sidebar content */}
      </aside>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default Document;