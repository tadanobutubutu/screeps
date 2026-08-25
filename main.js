// Example main.js with accessibility fixes applied

// FIX 1: REACT_015 - React Language Attribute
// Ensure the html element has a lang attribute (usually in _document.js for Next.js)
export const Document = () => (
  <html lang="en">
    <body>
      <Header />
      <main id="main-content">
        <HomePage />
      </main>
      <Footer />
    </body>
  </html>
);

// FIX 2: REACT_027 - React Table Structure
// Ensure tables have proper thead and tbody
const AccessibleTable = () => (
  <table>
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
      </tr>
    </tbody>
  </table>
);

// FIX 3: REACT_041 - React SVG Accessible Name
const AccessibleIcon = ({ label }) => (
  <svg role="img" aria-label={label}>
    {/* SVG content */}
  </svg>
);

// FIX 4 & 5: REACT_025 & REACT_017 - Unique Landmarks & Landmarks
// Use semantic HTML5 landmarks (one each: header, nav, main, footer)
const Layout = ({ children }) => (
  <>
    <header role="banner">
      <nav role="navigation" aria-label="main">
        {/* navigation items */}
      </nav>
    </header>
    <main role="main" id="main-content" tabIndex="-1">
      {children}
    </main>
    <footer role="contentinfo">
      {/* footer content */}
    </footer>
  </>
);

// FIX 6: REACT_036 - React Fake Link
// Use <a> for navigation, <button> for actions
const Navigation = () => (
  <>
    <a href="/about">About Page</a>
    <button onClick={handleSubmit}>Submit Form</button>
  </>
);