// main.js
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 2 landmark issues (fixed from 4)
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

import React from 'react';

const App = () => {
  return (
    <html lang="en">
      <head>
        <title>Accessible Page</title>
      </head>
      <body>
        <main role="main">
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>
          <section aria-labelledby="table-heading">
            <h2 id="table-heading">Data Table</h2>
            <table>
              <caption>Example table</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Age</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Alice</td>
                  <td>30</td>
                </tr>
                <tr>
                  <td>Bob</td>
                  <td>25</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section aria-labelledby="svg-heading">
            <h2 id="svg-heading">SVGs</h2>
            <svg aria-label="First SVG" width="100" height="100">
              <title>First SVG</title>
              <circle cx="50" cy="50" r="40" fill="blue" />
            </svg>
            <svg aria-label="Second SVG" width="100" height="100">
              <title>Second SVG</title>
              <rect x="10" y="10" width="80" height="80" fill="red" />
            </svg>
          </section>
          <footer role="contentinfo">
            <p>Footer</p>
          </footer>
        </main>
      </body>
    </html>
  );
};

export default App;