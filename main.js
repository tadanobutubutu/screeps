// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// Root element with language attribute to satisfy REACT_015
<div lang="en">
  <nav role="navigation" id="nav">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>

  <main role="main" id="main">
    <h1>Welcome to My App</h1>
    <p>This is the main content area.</p>

    {/* Table with proper structure to address REACT_027 */}
    <table>
      <caption>Sample Data</caption>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Alice</td>
          <td>Developer</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Bob</td>
          <td>Designer</td>
        </tr>
      </tbody>
    </table>

    {/* SVG with accessible name to address REACT_041 */}
    <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="logo-label">
      <circle cx="10" cy="10" r="5" stroke="black" stroke-width="2"/>
      <text id="logo-label" x="15" y="16" font-size="12">Logo</text>
    </svg>

    {/* Footer with landmark role to address REACT_017 */}
    <footer role="contentinfo" id="footer">
      <p>&copy; 2023 My Company</p>
    </footer>
  </main>
</div>

// Render the application
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<App />);
} else {
  console.error('Root container not found');
}

// Simple App component (kept inline for simplicity)
function App() {
  return (
    <div>
      <nav role="navigation" id="nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
        </ul>
      </nav>
      <main role="main" id="main">
        <h1>Welcome to My App</h1>
        <p>This is the main content area.</p>
        <table>
          <caption>Sample Data</caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Alice</td>
              <td>Developer</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Bob</td>
              <td>Designer</td>
            </tr>
          </tbody>
        </table>
        <svg id="logo" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="logo-label">
          <circle cx="10" cy="10" r="5" stroke="black" stroke-width="2"/>
          <text id="logo-label" x="15" y="16" font-size="12">Logo</text>
        </svg>
      </main>
      <footer role="contentinfo" id="footer">
        <p>&copy; 2023 My Company</p>
      </footer>
    </div>
  );
}