// main.js
import React from 'react';

// Add lang attribute to html element
document.documentElement.lang = 'en';

// Main component with proper semantic structure
const Main = () => {
  return (
    <div className="app-container">
      {/* Header landmark with proper role */}
      <header role="banner" className="app-header">
        <h1>Application Title</h1>
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation content */}
        </nav>
      </header>

      {/* Main content landmark */}
      <main role="main" className="app-main">
        {/* Accessible table example */}
        <table role="table" aria-label="Data table">
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

        {/* Accessible SVG example */}
        <svg
          role="img"
          aria-label="Example icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <title>Example icon</title>
          <path d="M12 2L4 12l8 10 8-10z" />
        </svg>

        {/* Button instead of fake link */}
        <button
          onClick={() => console.log('Button clicked')}
          aria-label="Perform action"
        >
          Click Me
        </button>
      </main>

      {/* Footer landmark */}
      <footer role="contentinfo" className="app-footer">
        <p>© 2023 Company Name</p>
      </footer>
    </div>
  );
};

export default Main;