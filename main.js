// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (NEW FUNCTION fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (NEW FUNCTION ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: ...

import React from 'react';
import ReactDOM from 'react-dom/client';

function customHead() {
  return (
    <React.Helmet>
      <meta charSet="utf-8" />
      <title>My App</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <meta name="description"
        content="Welcome to My App"
      />
      <meta name="author" content="Your Name" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" ... />
      <meta name="google-site-verification" content="..." />
      <meta name="google-plus" content="..." />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        ...
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        ...
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        ...
      />
      <link rel="manifest" ... />
      <link rel="mask-icon" ... color="#5bbad5" />
      <meta ... content="#00eded" />
      <meta name="msapplication-config" ... />
      <meta name="theme-color" content="#00eded" />

      {/* ADD scope attribute to th elements */}
      <style>
        thead th[scope="col"] {
          position: sticky;
          z-index: 10;
          background-color: white;
          box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
            0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
        }
        .table-bordered tbody th,
        .table-striped tbody tr:nth-child(odd) {
          border-color: #e9ecef;
        }
      </style>

      {/* OTHER HEAD TAGS */}
    </React.Helmet>
  );
}

function handleRotateBack() {
  // New function to handle rotating back behavior
  console.log('Rotating back');
}

// NEW FUNCTION: Add lang attribute to HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// NEW FUNCTION: Add main landmark with accessible name
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (!main.getAttribute('aria-labelledby') && !main.getAttribute('aria-label')) {
      if (index === 0) {
        main.setAttribute('aria-labelledby', 'main-heading');
      } else {
        main.setAttribute('aria-label', `Main content section ${index + 1}`);
      }
    }
  });
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
        const rowIndex = parentRow ? Array.from(parentRow.parentElement.children).indexOf(parentRow) : -1;
        const cellIndex = parentRow ? Array.from(parentRow.children).indexOf(th) : -1;
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
    main: document.querySelectorAll('main'),
    nav: document.querySelectorAll('nav'),
    header: document.querySelectorAll('header'),
    footer: document.querySelectorAll('footer'),
    aside: document.querySelectorAll('aside'),
    section: document.querySelectorAll('section')
  };

  // Add unique labels to duplicate landmarks
  Object.keys(landmarks).forEach((landmarkType) => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
          const label = `${landmarkType} ${index + 1}`;
          element.setAttribute('aria-label', label);
        }
      });
    }
  });
}

// NEW FUNCTION: Add accessible name to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    // Add accessible name using aria-label if not present
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
    // Add role="img" for better screen reader support
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Accessible Application</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Welcome to My App" />
        <meta name="author" content="Your Name" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#00eded" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <style>
          thead th[scope="col"] {
            position: sticky;
            z-index: 10;
            background-color: white;
            box-shadow: 0px 2px 1px -1px rgb(0 0 0 / 20%),
              0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
          }
          .table-bordered tbody th,
          .table-striped tbody tr:nth-child(odd) {
            border-color: #e9ecef;
          }
        </style>
      </head>
      <body>
        <main role="main" aria-labelledby="main-heading">
          <h1 id="main-heading">Accessible Application</h1>
          <div className="app-content">
            {/* Existing App content */}

            {/* Replace this anchor tag with a button for the "rotate back" functionality */}
            <button id="unrotate" type="button" onClick={handleRotateBack}>Rotate back</button>

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
        <script type="text/javascript"
          dangerouslySetInnerHTML={{ __html: `
            addLangAttribute();
            addMainLandmark();
            fixTableStructureIssues();
            ensureUniqueLandmarks();
            addSvgAccessibleNames();
          ` }} />
        {/* Leave the existing script tags below */}
        <script src="..." />
        <script src="..." />
        {/* OTHER SCRIPTS */}
      </body>
    </html>
  );
}

// ADD accessible names to SVGs
const AccessibleSVG = (props) => {
  return (
    <svg
      {...props}
      focusable="false"
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
    >
      {props.children}
    </svg>
  );
};

if (typeof document !== 'undefined') {
  const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
  if (nav && !nav.getAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }

  // Fix multiple main landmarks
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    const primaryMain = mains[0];
    primaryMain.id = primaryMain.id || 'main-content';
    Array.from(mains).forEach((mainElement, index) => {
      if (index > 0) {
        const section = document.createElement('section');
        section.setAttribute('aria-label', section.getAttribute('aria-label') || `Content section ${index + 1}`);
        section.id = `content-section-${index + 1}`;
        while (mainElement.firstChild) {
          section.appendChild(mainElement.firstChild);
        }
        mainElement.parentNode.replaceChild(section, mainElement);
      }
    });
  } else if (mains.length === 1) {
    mains[0].id = mains[0].id || 'main-content';
  }

  const headers = document.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (!header.id && index > 0) {
      header.id = `header-${index}`;
    }
  });

  const footers = document.querySelectorAll('footer');
  footers.forEach((footer, index) => {
    if (!footer.id && index > 0) {
      footer.id = `footer-${index}`;
    }
  });

  // REACT_041: Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (!title && !svg.getAttribute('aria-labelledby')) {
      const titleElement = document.createElement('title');
      const titleId = `svg-title-${index + 1}`;
      titleElement.id = titleId;
      titleElement.textContent = titleElement.textContent || svg.getAttribute('alt') || `Decorative icon ${index + 1}`;
      svg.insertBefore(titleElement, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
      svg.setAttribute('role', 'img');
    }
  });

  // REACT_036: Fix fake link issues
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

// Set language attribute on the HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en';
}

export function setMainLandmark(mainElement) {
  if (mainElement) {
    mainElement.setAttribute('role', 'main');
    mainElement.setAttribute('aria-label', 'Main content area');
  }
}

// Export App component
export default App;

// Export the new functions
export {
  handleRotateBack,
  addLangAttribute,
  addMainLandmark,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  AccessibleSVG,
  customHead
};