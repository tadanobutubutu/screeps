// Example of original main.js content
import React from 'react';

const MyComponent = () => {
  return (
    <div>
      {/* Example of a critical issue: Missing 'role' attribute on a clickable element */}
      <a href="/home">Home</a>
      <table>
        {/* Example of a warning: Missing table headers */}
        <tr>
          <td>Column 1</td>
          <td>Column 2</td>
        </tr>
      </table>
      {/* Example of a warning: Missing accessible name for an SVG */}
      <svg>
        <circle cx="50" cy="50" r="40" />
      </svg>
      {/* Example of a warning: Non-unique landmark role */}
      <main>
        <nav>
          <a href="/home">Navigation</a>
        </nav>
      </main>
      {/* Example of a warning: React Router link without 'role="button"' */}
      <Link to="/about">About</Link>
    </div>
  );
};

export default MyComponent;

// Example of how to update main.js to fix issues

import React from 'react';

const MyComponent = () => {
  return (
    <div>
      {/* Fixed: Added 'role="button"' to the anchor element */}
      <a href="/home" role="button">Home</a>
      <table>
        {/* Fixed: Added table headers */}
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Column 1</td>
            <td>Column 2</td>
          </tr>
        </tbody>
      </table>
      {/* Fixed: Added an accessible name to the SVG */}
      <svg>
        <title>Accessible circle</title>
        <circle cx="50" cy="50" r="40" />
      </svg>
      {/* Fixed: Ensured landmark roles are unique */}
      <main id="main-content">
        <nav id="site-navigation">
          <a href="/home" role="button">Navigation</a>
        </nav>
      </main>
      {/* Fixed: Added 'role="button"' to the React Router link */}
      <Link to="/about" role="button">About</Link>
    </div>
  );
};

export default MyComponent;