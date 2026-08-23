import React from 'react';
import ReactDOM from 'react-dom/client';

// Ensure the root element has a language attribute for screen readers
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

export default function App() {
  return (
    <div id="root">
      {/* Header - Landmark */}
      <header role="banner">
        <h1>Accessible Application</h1>
      </header>

      {/* Navigation - Landmark */}
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li><a href="/" id="home-link">Home</a></li>
          <li><a href="/about" id="about-link">About</a></li>
          <li><a href="/contact" id="contact-link">Contact</a></li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main role="main">
        {/* Table with proper structure - REACT_027 */}
        <table>
          <caption>Team Members</caption>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>101</td>
              <td>Alex Rivera</td>
              <td>Developer</td>
            </tr>
            <tr>
              <td>102</td>
              <td>Sam Chen</td>
              <td>Designer</td>
            </tr>
            <tr>
              <td>103</td>
              <td>Taylor Kim</td>
              <td>Manager</td>
            </tr>
          </tbody>
        </table>

        {/* Accessible SVG - REACT_041 */}
        <svg 
          aria-label="Project timeline visualization"
          role="img"
          width="200" height="120"
        >
          <rect x="10" y="20" width="60" height="60" fill="#4A90D9" rx="5"/>
          <line x1="70" y1="20" x2="130" y2="20" stroke="#333" stroke-width="2"/>
          <text x="85" y="45" font-family="sans-serif" font-size="14" fill="#333">Q1</text>
          <text x="85" y="65" font-family="sans-serif" font-size="14" fill="#333">Q2</text>
          <text x="85" y="85" font-family="sans-serif" font-size="14" fill="#333">Q3</text>
          <text x="85" y="105" font-family="sans-serif" font-size="14" fill="#333">Q4</text>
        </svg>
      </main>

      {/* Footer - Landmark */}
      <footer role="contentinfo">
        <p>&copy; 2024 Accessible App. All rights reserved.</p>
      </footer>
    </div>
  );
}