// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <html lang="en">
      <body>
        {/* Navigation landmark */}
        <nav id="main-navigation">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </nav>

        <main id="main-content">
          <h1>Welcome to My App</h1>
          <p>This is a sample application.</p>

          {/* Properly structured table */}
          <table id="data-table">
            <thead>
              <tr>
                <th scope="col" aria-label="Column 1">Name</th>
                <th scope="col" aria-label="Column 2">Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span id="row1-name">Alice</span></td>
                <td><span id="row1-age">30</span></td>
              </tr>
              <tr>
                <td><span id="row2-name">Bob</span></td>
                <td><span id="row2-age">25</span></td>
              </tr>
            </tbody>
          </table>

          {/* Accessible SVG with title */}
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <title>User avatar</title>
            <circle cx="10" cy="10" r="8" stroke="black" stroke-width="2"/>
          </svg>

          {/* Non‑link button replaces fake link */}
          <button onClick={() => alert('Clicked!')}>Click me</button>
        </main>
      </body>
    </html>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);