// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Ensure scope on <th> elements

export const init = () => {
  // Main initialization logic
  console.log('Application initialized');
};

// Accessibility Note: The lang attribute (REACT_015) should be set on the <html> element
// in your index.html or _document.js (for Next.js) file: <html lang="en">

// Landmark roles (REACT_017 & REACT_025) - Ensure unique landmarks with aria-label or aria-labelledby

// Example accessible SVG component (REACT_041)
export const AccessibleIcon = ({ iconId, label }) => {
  return (
    <svg role="img" aria-label={label}>
      <use href={`#${iconId}`} />
    </svg>
  );
};

// Example accessible table with scope (REACT_027)
export const AccessibleTable = ({ headers, rows }) => {
  return (
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
};

// Example navigation landmark (REACT_017)
export const Navigation = ({ children }) => {
  return (
    <nav role="navigation" aria-label="Main">
      {children}
    </nav>
  );
};

// Example button instead of fake link (REACT_036)
export const AccessibleButton = ({ onClick, children }) => {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
};

// Example header landmark (REACT_017)
export const Header = ({ children }) => {
  return (
    <header role="banner">
      {children}
    </header>
  );
};

// Example footer landmark (REACT_017)
export const Footer = ({ children }) => {
  return (
    <footer role="contentinfo">
      {children}
    </footer>
  );
};

// Example main landmark (REACT_017)
export const Main = ({ children }) => {
  return (
    <main role="main" id="main-content" tabIndex="-1">
      {children}
    </main>
  );
};

export default {
  init,
  AccessibleIcon,
  AccessibleTable,
  Navigation,
  AccessibleButton,
  Header,
  Footer,
  Main
};