// TODO: Address accessibility issues from insight report
// Existing code and exports are preserved from the current main.js.

import React from "react";

/**
 * Addresses accessibility issues identified in the insight report.
 * Provides a utility to apply accessibility improvements based on report findings.
 * @param {object} target - The target object or element to enhance.
 * @returns {object} The enhanced target with accessibility properties applied.
 */
function addressAccessibilityIssues(target) {
  if (target && typeof target === 'object') {
    // Example: apply ARIA roles and labels as per insight report recommendations
    if (target.role && !target['aria-role']) {
      target['aria-role'] = target.role;
    }
    if (target.label && !target['aria-label']) {
      target['aria-label'] = target.label;
    }
  }
  return target;
}

// Export the utility function
export { addressAccessibilityIssues };

/**
 * MainPage component with accessibility improvements.
 */
export default function MainPage() {
  return (
    <html lang="en">
      <body>
        <main aria-label="Main Content">
          <h1>Accessible Overview</h1>
          <nav aria-label="Primary Navigation">
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
            </ul>
          </nav>
          <table>
            <caption>Data</caption>
            <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Item</td>
                <td>42</td>
              </tr>
            </tbody>
          </table>
          <svg
            aria-label="Logo"
            aria-labelledby="logo-title"
            role="img"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            focusable="false"
          >
            <title id="logo-title">Logo</title>
            <circle cx="16" cy="16" r="14" />
          </svg>
          <button type="button" onClick={() => console.log("action")}>
            Action
          </button>
          {/* Fix for REACT_036: Use button instead of anchor with href="#" */}
          <button type="button" id="unrotate" onClick={() => console.log("rotate back")}>
            rotate back
          </button>
        </main>
      </body>
    </html>
  );
}

// Named export for testing compatibility
export { MainPage };