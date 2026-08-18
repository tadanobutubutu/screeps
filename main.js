// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// Main App Component with accessibility improvements
function App() {
  return (
    <html lang="en"> {/* REACT_015: Added lang attribute */}
      <body>
        <header aria-label="Main header"> {/* REACT_017: Added landmark elements */}
          <h1>Application Title</h1>
          <nav aria-label="Main navigation"> {/* REACT_025: Unique landmark identification */}
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
        </header>

        <main id="main-content"> {/* REACT_017: Main landmark */}
          <section aria-labelledby="section-title">
            <h2 id="section-title">Main Content Section</h2>

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

            {/* REACT_036: Links that don't navigate should be buttons */}
            <div>
              <button onClick={() => console.log('Action performed')}>
                Perform Action
              </button>
            </div>

            {/* REACT_041: SVG icon with accessible name */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-label="Information icon"
              role="img"
            >
              <title>Information</title>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </section>
        </main>

        <footer aria-label="Main footer"> {/* REACT_017: Footer landmark */}
          <p>© 2023 Company Name. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}

// Existing exports (preserved)
export const existingFunction = () => {
  // Your existing function implementation
};

export const anotherExistingFunction = () => {
  // Your existing function implementation
};

// New accessibility-related functions
export const getAccessibleName = (element) => {
  // Function to get accessible name of an element
  return element.getAttribute('aria-label') ||
         element.getAttribute('title') ||
         element.textContent;
};

export const announceMessage = (message) => {
  // Function to announce messages to screen readers
  const liveRegion = document.getElementById('live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
  }
};

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);