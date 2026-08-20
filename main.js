// main.js - Accessibility-improved version

// Issue: REACT_015 - React Language Attribute
// Make sure your _document.js or html has: <html lang="en">

// Issue: REACT_017/REACT_025 - React Landmarks
// Use semantic landmarks properly:
export const MainContent = ({ children }) => (
  <main id="main-content" role="main" aria-label="Main content">
    {children}
  </main>
);

// Issue: REACT_036 - React Fake Link
// If using buttons that navigate, use proper links:
export const NavigationLink = ({ href, children, onClick }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="nav-link"
    // Skip link for keyboard users
  >
    {children}
  </a>
);

// Issue: REACT_041 - React SVG Accessible Name
export const IconComponent = ({ name, size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    aria-hidden="true" 
    focusable="false"
    role="img"
    aria-label={name}
  >
    {/* SVG content */}
  </svg>
);

// Issue: REACT_027 - React Table Structure
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

// Default export
export default {
  MainContent,
  NavigationLink,
  IconComponent,
  AccessibleTable,
};