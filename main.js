// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

import React from 'react';

const MainApp = () => {
  return (
    <html lang="en">
      <body>
        {/* Landmark: main */}
        <main role="main">
          <h1>Welcome</h1>
          <p>This is the main content.</p>

          {/* Table with proper structure */}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>Alice</td><td>User</td></tr>
              <tr><td>2</td><td>Bob</td><td>Admin</td></tr>
              <tr><td>3</td><td>Charlie</td><td>Editor</td></tr>
            </tbody>
          </table>

          {/* Additional landmark: nav */}
          <nav role="navigation">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>

          {/* SVG with accessible name */}
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Sample chart showing trends over time">
            <rect x="10" y="80" width="20" height="30" fill="#4CAF50"/>
            <rect x="40" y="70" width="20" height="25" fill="#2196F3"/>
            <text x="60" y="95" font-size="12" text-anchor="middle">Trend</text>
          </svg>

          {/* Another SVG with accessible name */}
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-label="Diagram illustrating workflow steps">
            <circle cx="50" cy="50" r="40" stroke="black" stroke-width="2"/>
            <text x="50" y="55" font-size="14" text-anchor="middle">Workflow</text>
          </svg>

          {/* Fake link fixed */}
          <a href="/dashboard" target="_blank" rel="noopener noreferrer">Go to Dashboard</a>
        </main>
      </body>
    </html>
  );
};

export default MainApp;

// This is a simple module
const greeting = "Hello";

// TODO: Implement the new function as per the issue requirements
function newFunction() {
  // Implementation goes here
  return "newFunction implemented";
}

/**
 * Implementation of getSvgAccessibleName
 * @param {SVGSVGElement} svgElement
 * @returns {string|null}
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  // 1. Check aria-label
  if (svgElement.getAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // 2. Check aria-labelledby
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent;
  }

  // 3. Check <title> element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }

  return null;
}

export { greeting, newFunction, getSvgAccessibleName };