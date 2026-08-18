// main.js
import React from 'react';

// Add lang attribute to root element
function App() {
  return (
    <div lang="en"> {/* REACT_015: Added language attribute */}
      {/* REACT_017: Added proper landmarks */}
      <header role="banner">
        <h1>Application Title</h1>
      </header>

      <nav role="navigation" aria-label="Main navigation">
        {/* Navigation content */}
      </nav>

      <main role="main">
        {/* REACT_027: Proper table structure */}
        <table>
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>

        {/* REACT_041: Accessible SVG */}
        <svg aria-label="Chart" width="100" height="100">
          {/* SVG content */}
        </svg>

        {/* REACT_036: Proper link instead of fake link */}
        <a href="/about" role="button">About Us</a>
      </main>

      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default App;