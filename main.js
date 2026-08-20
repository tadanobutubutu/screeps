import React from 'react';
import ReactDOM from 'react-dom/client';

// Example accessible table with proper structure
const sampleTable = (
  <table role="table">
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

// Example accessible SVG with an accessible name
const accessibleSVG = (
  <svg aria-label="Simple diagram illustrating three steps" role="img">
    <circle cx="15" cy="15" r="5" />
    <line x1="15" y1="25" x2="45" y2="25" />
  </svg>
);

function App() {
  return (
    <html lang="en">
      <body>
        <header role="banner">Main Application</header>
        <main role="main">
          <p>This is the primary content area.</p>
          <sampleTable />
          <accessibleSVG />
        </main>
      </body>
    </html>
  );
}

export default App;