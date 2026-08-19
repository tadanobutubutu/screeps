// Add lang attribute to HTML element (REACT_015)
import { useEffect } from 'react';

// Fix fake links by creating proper anchor elements (REACT_036)
const createLink = (href, children, onClick) => {
  if (!href && onClick) {
    return (
      <button 
        type="button"
        onClick={onClick}
        style={{ 
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
          textDecoration: 'underline'
        }}
      >
        {children}
      </button>
    );
  }
  return <a href={href || '#'} onClick={onClick}>{children}</a>;
};

// Fix table structures (REACT_027)
const Table = ({ caption, headers, rows }) => (
  <table>
    {caption && <caption>{caption}</caption>}
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

// Fix SVG accessible names (REACT_041)
const AccessibleSVG = ({ label, icon, ...props }) => (
  <svg 
    role="img"
    aria-label={label}
    {...props}
  >
    {icon}
  </svg>
);

// Fix landmarks by using semantic elements (REACT_017, REACT_025)
const PageLayout = ({ header, navigation, main, footer, aside }) => (
  <>
    {header && <header>{header}</header>}
    {navigation && <nav>{navigation}</nav>}
    {main && <main>{main}</main>}
    {aside && <aside>{aside}</aside>}
    {footer && <footer>{footer}</footer>}
  </>
);