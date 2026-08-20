// main.js
import React from 'react';

const DependencyGraph = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th ...
            <th ...
            <th ...
            <th ...
            <th ...
            {/* Add more headers with scope="col" as needed */}
          </tr>
        </thead>
        <tbody>
          {/* Table body content */}
        </tbody>
      </table>
    </div>
  );
};

export default DependencyGraph;

// Accessible SVG wrapper component to fix REACT_041
export const AccessibleSVG = ({ children, ariaLabel, ariaHidden = false }) => {
  return (
    <svg aria-hidden={ariaHidden} aria-label={ariaLabel}>
      {children}
    </svg>
  );
};

// Convenience component for decorative SVGs (aria-hidden="true")
export const DecorativeSVG = ({ children }) => {
  return (
    <svg aria-hidden="true">
      {children}
    </svg>
  );
};