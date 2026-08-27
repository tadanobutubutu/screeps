// main.js - Fixed Accessibility Issues

// Issue: REACT_015 - React Language Attribute (Critical)
// Fix: Ensure the html element has a lang attribute

import { Html } from '@react-pdf/renderer';

// Example 1: Correct lang attribute on Html component
const Document = () => (
  <Html lang="en">
    <body>
      <main>
        <h1>Accessible Document</h1>
      </main>
    </body>
  </Html>
);

// Issue: REACT_036 - React Fake Link
// Fix: Use proper anchor elements instead of styled divs/buttons

// Example 2: Proper link implementation
const AccessibleLink = ({ href, children }) => (
  <a href={href} style={{ color: 'blue', textDecoration: 'underline' }}>
    {children}
  </a>
);

// Issue: REACT_041 - React SVG Accessible Name
// Fix: Add title and role to SVG elements

// Example 3: Accessible SVG
const AccessibleIcon = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    role="img" 
    aria-label="Close menu"
    viewBox="0 0 24 24"
  >
    <title>Close icon</title>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Issue: REACT_017 - React Landmarks
// Fix: Use semantic landmark elements

// Example 4: Proper landmark structure
const PageLayout = ({ children }) => (
  <div>
    <header>
      <nav aria-label="Main navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
    </header>
    <main id="main-content">
      {children}
    </main>
    <footer>
      <p>© 2024</p>
    </footer>
  </div>
);

// Issue: REACT_025 - React Unique Landmarks
// Fix: Ensure landmarks have unique labels or only one of each landmark type

// Example 5: Unique landmark labels
const UniqueLandmarks = () => (
  <div>
    <header role="banner">
      <nav aria-label="Primary navigation">...</nav>
    </header>
    <aside aria-label="Related articles">...</aside>
    <footer role="contentinfo">...</footer>
  </div>
);

// Issue: REACT_027 - React Table Structure
// Fix: Ensure tables have proper thead and tbody

// Example 6: Proper table structure
const AccessibleTable = ({ data }) => (
  <table>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          <td>{item.name}</td>
          <td>{item.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export {
  Document,
  AccessibleLink,
  AccessibleIcon,
  PageLayout,
  UniqueLandmarks,
  AccessibleTable
};