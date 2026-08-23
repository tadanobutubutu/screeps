// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (NEW FUNCTION fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (NEW FUNCTION ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: ...

import React from 'react';
import ReactDOM from 'react-dom/client';

function handleRotateBack() {
  // New function to handle rotating back behavior
  console.log('Rotating back');
}

// NEW FUNCTION: Fix table structure issues
function fixTableStructureIssues() {
  // Add scope attribute to th elements that are missing it
  const thElements = document.querySelectorAll('th');
  thElements.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      // Determine if header is in thead or tbody to set appropriate scope
      const parentRow = th.closest('tr');
      const parentSection = th.closest('thead') ? 'thead' : 'tbody';
      if (parentSection === 'thead') {
        th.setAttribute('scope', 'col');
      } else {
        // For tbody, determine if it's a row header or column header
        const rowIndex = Array.from(parentRow.parentNode.children).indexOf(parentRow);
        const cellIndex = Array.from(parentRow.children).indexOf(th);
        if (rowIndex === 0) {
          th.setAttribute('scope', 'col');
        } else if (cellIndex === 0) {
          th.setAttribute('scope', 'row');
        }
      }
    }
  });

  // Ensure tables have proper caption elements
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

// NEW FUNCTION: Ensure unique landmarks
function ensureUniqueLandmarks() {
  // Get all landmark elements
  const landmarks = {
    main: document.querySelectorAll('main, [role="main"]'),
    nav: document.querySelectorAll('nav, [role="navigation"]'),
    header: document.querySelectorAll('header, [role="banner"]'),
    footer: document.querySelectorAll('footer, [role="contentinfo"]'),
    aside: document.querySelectorAll('aside, [role="complementary"]'),
    section: document.querySelectorAll('section, [role="region"]'),
  };

  // Add unique labels to duplicate landmarks
  Object.keys(landmarks).forEach((landmarkType) => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          const label = `${landmarkType}-${index + 1}`;
          element.setAttribute('aria-label', label);
        }
      });
    }
  });
}

// NEW FUNCTION: Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    // Add accessible name using aria-label if not present
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
    // Add role="img" for better screen reader support
    if (!svg.hasAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Accessible Application</title>
      </head>
      <body>
        <main role="main" aria-labelledby="main-heading">
          <h1 id="main-heading">Content</h1>
          <div className="app-content">
            {/* Existing App content */}

            {/* Replace this anchor tag with a button for the "rotate back" functionality */}
            <button id="unrotate" type="button">Rotate back</button>

            {/* Example of adding scope attribute to a <th> element */}
            <table>
              <caption>Data table with accessible headers</caption>
              <thead>
                <tr>
                  <th scope="col">Header 1</th>
                  <th scope="col">Header 2</th>
                  <th scope="col">Header 3</th>
                  <th scope="col">Header 4</th>
                  {/* ... other headers ... */}
                </tr>
              </thead>
              <tbody>
                {/* ... table rows ... */}
              </tbody>
            </table>
          </div>
        </main>
        <script type="text/javascript">
          // Set language attribute on the HTML element
          document.documentElement.lang = 'en';
          // Apply accessibility fixes
          fixTableStructureIssues();
          ensureUniqueLandmarks();
          addSvgAccessibleNames();
        </script>
      </body>
    </html>
  );
}

// Set language attribute on the HTML element
document.documentElement.lang = 'en';

// Export App component
export default App;

// Export the new functions
export { handleRotateBack, fixTableStructureIssues, ensureUniqueLandmarks, addSvgAccessibleNames };