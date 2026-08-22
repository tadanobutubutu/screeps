import React from 'react';

/**
 * Main component with accessibility improvements.
 * Addresses the following checks:
 * - REACT_015 React Language Attribute: lang="en" on the root element.
 * - REACT_027 React Table Structure: proper <thead>/<tbody> and th scope.
 * - REACT_041 React SVG Accessible Name: role="img" + aria-label/<title>.
 * - REACT_025 React Unique Landmarks: single <main> and single <nav>.
 * - REACT_017 React Landmarks: proper main and nav landmarks.
 * - REACT_036 React Fake Link: replaced any fake links with real <a> elements.
 */
const Main = () => {
  return (
    <div lang="en">
      <nav aria-label="Primary navigation">
        <ul>
          <li>
            <a href="#main-content">Skip to main content</a>
          </li>
          <li>
            <a href="/home">Home</a>
          </li>
        </ul>
      </nav>

      <main id="main-content" role="main" aria-label="Main content">
        <h1>Welcome</h1>

        <section aria-label="Data table section">
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
                <td>Item 1</td>
                <td>100</td>
              </tr>
              <tr>
                <td>Item 2</td>
                <td>200</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section aria-label="Icons">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            role="img"
            aria-label="Information icon"
          >
            <title>Information</title>
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" />
            <text x="16" y="21" textAnchor="middle" fontSize="18">i</text>
          </svg>

          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            role="img"
            aria-label="Warning icon"
          >
            <title>Warning</title>
            <path d="M16 2 L30 30 L2 30 Z" fill="none" stroke="currentColor" />
          </svg>
        </section>

        <a href="/learn" className="cta-link">Learn more</a>
      </main>
    </div>
  );
};

export default Main;