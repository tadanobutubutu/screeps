import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Added imports from origin/main
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Helper function to get full lang attribute with region
function getFullLangAttribute() {
    return document.documentElement.lang;
}

// Helper function to get lang attribute
function getLangAttribute() {
    return document.documentElement.lang;
}

// NEW FUNCTION: Add lang attribute to HTML element (from HEAD)
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// NEW FUNCTION: Add main landmark with accessible name (from HEAD)
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (main && main.tagName === 'MAIN') {
      if (index === 0) {
        main.setAttribute('aria-label', 'Main content');
      } else {
        main.setAttribute('aria-label', `Main content section ${index + 1}`);
      }
    }
  });
}

// NEW FUNCTION: Fix table structure issues (integrated from HEAD and origin/main)
function fixTableStructureIssues() {
  // Add scope attribute to th elements that are missing it
  const thElements = document.querySelectorAll('th');
  thElements.forEach((th) => {
    if (!th.getAttribute('scope')) {
      // Determine if header is in thead or tbody to set appropriate scope
      const parentRow = th.closest('tr');
      const parentSection = th.closest('thead') ? 'thead' : 'tbody';
      if (parentSection === 'thead') {
        th.setAttribute('scope', 'col');
      } else {
        // For tbody, determine if it's a row header or column header
        const rowIndex = parentRow ? Array.from(parentRow.parentNode.children).indexOf(parentRow) : -1;
        const cellIndex = parentRow ? Array.from(parentRow.children).indexOf(th) : -1;
        if (rowIndex === 0) {
          th.setAttribute('scope', 'col');
        } else if (cellIndex === 0) {
          th.setAttribute('scope', 'row');
        }
      }
    }
  });

  // Ensure tables have proper caption elements (from HEAD)
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

// Implement function for addressing accessibility issues from insight report
function handleAccessibilityIssues(issues) {
    issues.forEach(issue => {
        switch (issue.type) {
            case 'lang':
                document.documentElement.lang = issue.value;
                break;
            case 'aria':
                // Add ARIA attributes as required
                if (issue.element) {
                    Object.entries(issue.attributes || {}).forEach(([attr, value]) => {
                        issue.element.setAttribute(attr, value);
                    });
                }
                break;
            case 'svg':
                // Add accessible names to 2 SVGs
                if (issue.element) {
                    const title = document.createElement('title');
                    title.textContent = issue.name || 'Accessible SVG';
                    issue.element.insertBefore(title, issue.element.firstChild);
                    issue.element.setAttribute('role', 'img');
                }
                break;
            case 'landmark':
                // Add/fix 4 landmark issues
                if (issue.element) {
                    if (issue.role) {
                        issue.element.setAttribute('role', issue.role);
                    }
                    if (issue.label) {
                        issue.element.setAttribute('aria-label', issue.label);
                    }
                }
                break;
            case 'unique-landmark':
                // Ensure unique landmarks (2 issues)
                if (issue.element && issue.uniqueRole) {
                    issue.element.setAttribute('role', issue.uniqueRole);
                    if (issue.label) {
                        issue.element.setAttribute('aria-label', issue.label);
                    }
                }
                break;
            case 'fake-link':
                // Fix 1 fake link issue
                if (issue.element) {
                    const href = issue.element.getAttribute('href');
                    if (href && !href.startsWith('#') && href !== '') {
                        // Valid link, ensure proper semantics
                        issue.element.setAttribute('role', 'link');
                    }
                }
                break;
            case 'scope':
                // Add scope attribute to th elements
                if (issue.element && issue.element.tagName === 'TH') {
                    issue.element.setAttribute('scope', issue.scope || 'col');
                }
                break;
            default:
                // Handle other accessibility changes based on the issue type
                if (issue.element && issue.attributes) {
                    Object.entries(issue.attributes || {}).forEach(([attr, value]) => {
                        issue.element.setAttribute(attr, value);
                    });
                }
        }
    });
}

// Implement table structure fix function
function fixTableAccessibility(tables) {
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const headers = row.querySelectorAll('th');
            const cells = row.querySelectorAll('td');

            headers.forEach((th) => {
                const isRowHeader = th.getAttribute('data-row-header') !== null;
                th.setAttribute('scope', isRowHeader ? 'row' : 'col');
                if (!th.id) {
                    const tableId = table.id || table.getAttribute('aria-label') || 'table-' + Math.floor(Math.random() * 1000000);
                    const headerIndex = headers.indexOf(th);
                    th.id = tableId + '-th-' + headerIndex;
                }
            });

            cells.forEach((td, index) => {
                const rowHeaders = headers.filter(th => th.getAttribute('data-row-header') !== null);
                if (rowHeaders.length > index) {
                    td.setAttribute('headers', rowHeaders[index].id);
                }
            });
        });

        const caption = table.querySelector('caption');
        if (!caption && table.getAttribute('aria-label')) {
            const generatedCaption = document.createElement('caption');
            generatedCaption.textContent = table.getAttribute('aria-label');
            table.insertBefore(generatedCaption, table.firstChild);
        }
    });
}

// NEW FUNCTION: Ensure unique landmarks (merged from HEAD and origin/main)
function ensureUniqueLandmarks() {
    // Convert extra <main> elements to <section> so only one main landmark remains (from HEAD)
    const mainElements = document.querySelectorAll('main');
    const mainList = Array.from(mainElements);
    if (mainList.length > 1) {
        for (let i = 1; i < mainList.length; i++) {
            const element = mainList[i];
            const section = document.createElement('section');
            for (let j = 0; j < element.attributes.length; j++) {
                const attr = element.attributes[j];
                section.setAttribute(attr.name, attr.value);
            }
            while (element.firstChild) {
                section.appendChild(element.firstChild);
            }
            if (element.parentNode) {
                element.parentNode.replaceChild(section, element);
            }
        }
    }

    // Landmark handling logic from origin/main
    const usedRoles = new Map();

    document.querySelectorAll('[role]').forEach(element => {
        const role = element.getAttribute('role') || element.tagName.toLowerCase();
        const existingCount = usedRoles.get(role) || 0;
        usedRoles.set(role, existingCount + 1);

        if (existingCount > 0) {
            if (!element.getAttribute('aria-label')) {
                const label = element.getAttribute('aria-labelledby') || `${role} ${existingCount + 1}`;
                element.setAttribute('aria-label', label);
            }

            if (!usedRoles.has(role + '-unique')) {
                element.setAttribute('role', role);
                usedRoles.set(role + '-unique', true);
            }
        } else {
            if (['nav', 'main', 'header', 'footer', 'aside'].includes(role)) {
                element.setAttribute('role', role === 'nav' ? 'navigation' : role);
            }
        }
    });

    // Add unique labels to duplicate landmarks (from HEAD)
    const landmarks = {
        main: document.querySelectorAll('main'),
        nav: document.querySelectorAll('nav, [role="navigation"]'),
        header: document.querySelectorAll('header, [role="banner"]'),
        footer: document.querySelectorAll('footer, [role="contentinfo"]'),
        aside: document.querySelectorAll('aside, [role="complementary"]'),
        section: document.querySelectorAll('section')
    };

    Object.keys(landmarks).forEach((landmarkType) => {
        const elements = Array.from(landmarks[landmarkType]);
        if (elements.length > 1) {
            elements.forEach((element, index) => {
                if (landmarkType === 'main' && index > 0) {
                    if (!element.getAttribute('aria-label')) {
                        element.setAttribute('aria-label', `Main content section ${index + 1}`);
                    }
                } else {
                    if (!element.getAttribute('aria-label')) {
                        const label = `${landmarkType} ${index + 1}`;
                        element.setAttribute('aria-label', label);
                    }
                }
            });
        }
    });
}

// Implement wrapPrimaryContentInMain function (fixed)
function wrapPrimaryContentInMain() {
    const existingMain = document.querySelector('main');
    if (existingMain) {
        return existingMain;
    }

    const body = document.body;
    const main = document.createElement('main');
    while (body.firstChild) {
        main.appendChild(body.firstChild);
    }
    body.appendChild(main);
    return main;
}

// Call the function to ensure the page has a <main> landmark
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            wrapPrimaryContentInMain();
        });
    } else {
        wrapPrimaryContentInMain();
    }
}

// Missing functions that were referenced but not defined in the original snippets
// Adding them here to prevent runtime errors

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    // Add accessible name using aria-label if not present
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
    // Add role="img" for better screen reader support
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

function addAriaLabelToMyDiv() {
  const myDiv = document.querySelector('#myDiv') || document.querySelector('.my-div');
  if (myDiv) {
    myDiv.setAttribute('aria-label', 'My div');
  }
}

// Placeholder functions for referenced exports
function validateTableAccessibility() {
    return true;
}

function validateTableStructure() {
    return true;
}

function renderDependencyGraph() {
    return dependencyGraphContent;
}

function renderIndexView() {
    return indexContent;
}

// App component
function App() {
  // Apply accessibility fixes when component mounts
  useEffect(() => {
    addLangAttribute();
    addMainLandmark();
    fixTableStructureIssues();
    ensureUniqueLandmarks();
    fixTableAccessibility(document.querySelectorAll('table'));
    addSvgAccessibleNames();
    addAriaLabelToMyDiv();
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Accessible Application</title>
      </head>
      <body>
        <main role="main" aria-labelledby="main-heading">
          <h1 id="main-heading">Accessible Application</h1>
          <div className="app-content">
            {/* Existing App content */}

            {/* Replace this anchor tag with a button for the "rotate back" functionality */}
            <button id="unrotate" type="button">Back</button>

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
      </body>
    </html>
  );
}

// Exporting functions as required (do not remove or rename any existing exports)
export function someExistingFunction() {
    // ... (existing function code)
}

export function anotherExistingFunction() {
    // ... (existing function code)
}

// Export new accessibility functions
export {
    handleAccessibilityIssues,
    fixTableAccessibility,
    ensureUniqueLandmarks,
    wrapPrimaryContentInMain,
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    renderDependencyGraph,
    renderIndexView
};