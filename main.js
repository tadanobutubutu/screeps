// main.js
import React from 'react';

// Preserve all existing imports and functions

// Example of adding language attribute to root element
function App() {
  return (
    <div lang="en"> {/* Added lang attribute */}
      {/* Your existing content */}
    </div>
  );
}

// REACT_017: Add proper landmarks
function addLandmarks() {
  // Ensure there's only one main landmark
  const mainContent = document.querySelector('main');
  if (mainContent) {
    if (!mainContent.getAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
    // Remove any duplicate main elements that might exist
    const duplicateMains = document.querySelectorAll('main:not(:first-of-type)');
    duplicateMains.forEach(main => {
      main.removeAttribute('role');
      main.removeAttribute('aria-label');
      // Convert to section if it's not the main content
      if (!main.classList.contains('main-content')) {
        const section = document.createElement('section');
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }
        main.replaceWith(section);
      }
    });
  }

  const navElements = document.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', 'Main navigation');
    }
  });
}

// Example of proper table structure
function DataTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.col1}</td>
            <td>{item.col2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Example of adding landmarks
function Layout() {
  return (
    <div>
      <header role="banner">
        {/* Header content */}
      </header>
      <main role="main">
        {/* Main content */}
      </main>
      <nav role="navigation">
        {/* Navigation content */}
      </nav>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headers.forEach((header, index) => {
    if (!header.getAttribute('id')) {
      header.setAttribute('id', `section-heading-${index}`);
    }
  });

  // Ensure only one main landmark exists
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    console.warn('Multiple main landmarks detected. Converting duplicates to sections.');
    mains.forEach((main, index) => {
      if (index > 0) {
        const section = document.createElement('section');
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }
        main.replaceWith(section);
      }
    });
  }
}

// Example of accessible SVG
function Icon() {
  return (
    <svg aria-label="Example icon" width="24" height="24">
      {/* SVG content */}
    </svg>
  );
}

// Example of proper link
function ButtonLink() {
  return (
    <a href="/destination" role="button">
      Click me
    </a>
  );
}

// Preserve all existing exports
export default App;
export { DataTable, Layout, Icon, ButtonLink, addLandmarks, ensureUniqueLandmarks };
// ... any other existing exports