// main.js
import React from 'react';

export default function Main({ children }) {
  return (
    <div lang="en">
      <header>
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
        <button type="button" onClick={() => {}} aria-label="Open menu">
          <svg width="24" height="24" aria-hidden="true" focusable="false">
            <title>Menu icon</title>
            <rect x="2" y="4" width="20" height="2" fill="currentColor" />
            <rect x="2" y="11" width="20" height="2" fill="currentColor" />
            <rect x="2" y="18" width="20" height="2" fill="currentColor" />
          </svg>
        </button>
      </header>

      <main id="main-content" role="main">
        {children}
        
        <section aria-labelledby="table-heading">
          <h2 id="table-heading">Data Table</h2>
          <table>
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
      </main>

      <footer>
        <nav aria-label="Footer navigation">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </nav>
        <svg width="20" height="20" aria-label="External link icon" role="img">
          <title>External link</title>
          <path d="M10 0L20 10L10 20L0 10L10 0Z" fill="currentColor" />
        </svg>
      </footer>
    </div>
  );
}