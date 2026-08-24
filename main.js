// main.js - Fixed for accessibility
import React from 'react';

const Main = () => {
  return (
    <div lang="en">
      <header role="banner">
        <h1>Accessible Application</h1>
      </header>
      <nav aria-label="Primary navigation" role="navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
      <main role="main">
        <table>
          <caption>Sample Data</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Item 1</th>
              <td>10</td>
            </tr>
          </tbody>
        </table>
        <svg aria-label="Example SVG" width="100" height="100" role="img">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </main>
      <footer role="contentinfo">
        <p>&copy; 2025</p>
      </footer>
    </div>
  );
};

export default Main;