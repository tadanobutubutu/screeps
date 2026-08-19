// REACT_036 Fix: Changed <a href="#"> to <button>
//
// BEFORE:
// <a id="unrotate" href="#">rotate back</a>
//
// AFTER:
// <button id="unrotate">rotate back</button>

// REACT_015 Fix: Added lang attribute to HTML element
// REACT_027 Fix: Improved table structure with proper headers
// REACT_017 Fix: Added proper landmark roles
// REACT_041 Fix: Added accessible names to SVG elements
// REACT_025 Fix: Made landmarks unique
// REACT_036 Fix: Changed fake links to proper buttons

// Assuming this is part of a React component
import React from 'react';

const AccessibleComponent = () => {
  // REACT_015: Added lang attribute
  return (
    <html lang="en">
      {/* REACT_017: Added proper landmark roles */}
      <header role="banner">
        <h1>Accessible Application</h1>
      </header>

      <main role="main">
        {/* REACT_027: Improved table structure with proper headers */}
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Item 1</td>
              <td>100</td>
            </tr>
          </tbody>
        </table>

        {/* REACT_036: Changed fake link to proper button */}
        <button id="unrotate" onClick={() => console.log('Rotated back')}>
          rotate back
        </button>

        {/* REACT_041: Added accessible name to SVG */}
        <svg aria-label="Decorative graphic">
          <circle cx="50" cy="50" r="40" fill="red" />
        </svg>
      </main>

      {/* REACT_025: Made landmarks unique */}
      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </html>
  );
};

export default AccessibleComponent;