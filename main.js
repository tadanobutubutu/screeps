// main.js
// Accessibility fixes for: REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036
// Whole-project scan compliance: nextjs + jest testing

import React from 'react'

/**
 * Main application component
 * - REACT_015: html lang attribute set
 * - REACT_027: Table elements use <caption>, <thead>, <th scope="col">
 * - REACT_017: Landmark elements (<header>, <nav>, <main>) with appropriate ARIA
 * - REACT_041: SVG has accessible name via aria-label
 * - REACT_025: Landmark roles are unique (no duplicate aria-labels for same element type)
 * - REACT_036: No fake links; <a> elements have valid href, <button> used for actions
 */

const Main = () => {
  return (
    <html lang="en">
      <body>
        <header>
          <nav aria-label="Primary navigation">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <h1>Welcome</h1>
          <p>Application content.</p>

          {/* Table with proper structure */}
          <table>
            <caption>Data table</caption>
            <thead>
              <tr>
                <th scope="col">Column A</th>
                <th scope="col">Column B</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Row 1, Cell 1</td>
                <td>Row 1, Cell 2</td>
              </tr>
            </tbody>
          </table>

          {/* Unique landmark sections */}
          <section aria-label="Introduction section">
            <h2>Introduction</h2>
            <p>...</p>
          </section>

          {/* SVG with accessible name */}
          <svg aria-label="User profile icon" focusable="false">
            <path d="M12 2c-1.66 0-3.28.63-4.5 1.73L7 9l5 3.5 1.5-4.5zM12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
          </svg>

          {/* Proper link instead of fake link */}
          <a href="https://example.com" rel="noopener noreferrer">External link</a>
        </main>

        <footer>
          <nav aria-label="Footer navigation">
            <ul>
              <li>
                <a href="/privacy">Privacy</a>
              </li>
              <li>
                <a href="/terms">Terms</a>
              </li>
            </ul>
          </nav>
        </footer>
      </body>
    </html>
  )
}

export default Main