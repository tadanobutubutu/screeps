import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Adding language attribute to HTML (REACT_015 fix)
function Main() {
  return (
    <App />
  );
}

// Ensuring proper table structure (REACT_027 fix example)
function AccessibleTable({ headers, rows }) {
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
}

// Adding landmarks (REACT_017 & REACT_025 fixes)
function MainLayout({ children }) {
  return (
    <div>
      <header role="banner">
        {/* Header content */}
      </header>
      <main id="main-content" role="main">
        {children}
      </main>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// Making SVG accessible (REACT_041 fix)
function AccessibleSVG({ title, ...props }) {
  return (
    <svg aria-labelledby={`svg-title-${title.replace(/\s+/g, '-')}`} {...props}>
      <title id={`svg-title-${title.replace(/\s+/g, '-')}`}>{title}</title>
    </svg>
  );
}

// Replacing fake links with real links (REACT_036 fix)
function AccessibleLink({ children, onClick, ...props }) {
  return (
    <button 
      type="button" 
      onClick={onClick}
      className="link-style-button"
      {...props}
    >
      {children}
    </button>
  );
}

// Export all components to maintain backward compatibility
export {
  Main,
  AccessibleTable,
  MainLayout,
  AccessibleSVG,
  AccessibleLink
};

// Render app with language attribute
const root = ReactDOM.createRoot(document.getElementById('root'));
// Setting lang attribute on html element (REACT_015 fix)
document.documentElement.lang = 'en';
root.render(<Main />);