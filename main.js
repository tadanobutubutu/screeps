// main.js - Fixed accessibility issues

// Issue: REACT_015 - React Language Attribute (Critical)
// Fix: Ensure the document has a lang attribute
// This should be set in your pages/_document.js or equivalent:
/*
<html lang="en">
*/

// Issue: REACT_017 & REACT_025 - React Landmarks / Unique Landmarks
// Fix: Use proper semantic HTML landmarks, each appearing only once
export const MainLayout = ({ children }) => (
  <>
    <a href="#main-content" className="sr-only">Skip to main content</a>
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        {/* navigation content */}
      </nav>
    </header>
    <main id="main-content" role="main">
      {children}
    </main>
    <footer role="contentinfo">
      {/* footer content */}
    </footer>
  </>
);

// Issue: REACT_027 - React Table Structure
// Fix: Ensure tables have proper semantic structure
export const AccessibleTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th scope="col">Header 1</th>
        <th scope="col">Header 2</th>
        <th scope="col">Header 3</th>
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={index}>
          <th scope="row">{row.label}</th>
          <td>{row.value1}</td>
          <td>{row.value2}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// Issue: REACT_036 - React Fake Link
// Fix: Use <button> for actions, <a> for navigation
export const ActionButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

// Use <a> for actual navigation:
// <a href="/page">Navigate to page</a>

// Issue: REACT_041 - React SVG Accessible Name
// Fix: Add title and aria-label to SVG elements
export const AccessibleIcon = ({ iconType }) => (
  <svg 
    role="img" 
    aria-label={`${iconType} icon`}
    width="24" 
    height="24" 
    viewBox="0 0 24 24"
  >
    <title>{iconType} icon</title>
    {/* SVG paths */}
  </svg>
);

// Screen Reader score fix (79/100 - 35 findings)
// Ensure interactive elements are properly labeled
export const AccessibleForm = () => (
  <form>
    <label htmlFor="email">Email address</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      aria-describedby="email-hint"
    />
    <span id="email-hint" className="sr-only">
      We'll never share your email address
    </span>
    
    <button type="submit">Submit</button>
  </form>
);

// Motor score fix (93/100 - 1 finding)
// Ensure interactive elements have adequate touch targets
export const TouchTargetButton = ({ onClick, children }) => (
  <button 
    type="button" 
    onClick={onClick}
    style={{ 
      minWidth: '44px',
      minHeight: '44px',
      padding: '12px'
    }}
    aria-label={children}
  >
    {children}
  </button>
);

// Screen Reader improvements
// Ensure images have alt text
export const AccessibleImage = ({ src, alt, caption }) => (
  <figure>
    <img src={src} alt={alt} />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

// Ensure focus indicators are visible
export const accessibleFocusStyles = `
  button:focus,
  a:focus,
  input:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }
`;

// Helper for screen reader only text
export const ScreenReaderOnly = ({ children }) => (
  <span className="sr-only">{children}</span>
);

export default {
  MainLayout,
  AccessibleTable,
  ActionButton,
  AccessibleIcon,
  AccessibleForm,
  TouchTargetButton,
  AccessibleImage,
  ScreenReaderOnly
};