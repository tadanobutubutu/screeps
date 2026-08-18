// main.js
import React from 'react';

// Preserve all existing exports and functions
// ... (your existing code here) ...

// Add accessibility improvements
const AccessibleTable = ({ data, caption }) => {
  return (
    <div className="table-container">
      <table aria-label={caption}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} scope="col">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AccessibleSVG = ({ title, description, ...props }) => {
  return (
    <svg {...props} role="img" aria-label={`${title}: ${description}`}>
      <title>{title}</title>
      <desc>{description}</desc>
      {props.children}
    </svg>
  );
};

const AccessibleLink = ({ href, children, ...props }) => {
  if (!href || href === '#') {
    return (
      <button {...props} className="fake-link">
        {children}
      </button>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};

// Add lang attribute to main component if missing
const MainComponent = ({ children, ...props }) => {
  return (
    <main lang="en" {...props}>
      {children}
    </main>
  );
};

// Preserve all existing exports
export {
  // ... your existing exports ...
  AccessibleTable,
  AccessibleSVG,
  AccessibleLink,
  MainComponent
};