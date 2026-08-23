import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function customHead() {
  return (
    <React.Helmet>
      <meta charSet="utf-8" />
      <title>Accessible Application</title>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <meta name="description" content="Welcome to Accessible Application" />
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

      {/* ADD lang attribute to HTML element */}
      <html lang="en">

      {/* OTHER HEAD TAGS */}
    </React.Helmet>
  );
}

function handleRotateBack() {
  // New function to handle rotating back behavior
  console.log('Rotating back');
}

function addLangAttribute() {
  document.documentElement.lang = 'en';
}

function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (!main.getAttribute('aria-label') && !main.getAttribute('aria-labelledby')) {
      if (index === 0) {
        main.setAttribute('aria-label', 'Main content');
      } else {
        main.setAttribute('aria-label', `Main content section ${index + 1}`);
      }
    }
  });
}

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

  // Add unique labels to duplicate landmarks and keep a single <main>
  Object.keys(landmarks).forEach((landmarkType) => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (landmarkType === 'main' && index > 0) {
          // Convert extra <main> elements to <section> so only one main landmark remains
          const section = document.createElement('section');
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            section.setAttribute(attr.name, attr.value);
          }
          while (element.firstChild) {
            section.appendChild(element.firstChild);
          }
          if (element.parentNode) {
            element.parentNode.replaceChild(section, element);
          }
        } else {
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const label = `${landmarkType} ${index + 1}`;
            element.setAttribute('aria-label', label);
          }
        }
      });
    }
  });
}

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

// NEW FUNCTION: Add aria-label to the 'myDiv' element
function addAriaLabelToMyDiv() {
  const myDiv = document.getElementById('myDiv');
  if (myDiv) {
    myDiv.setAttribute('aria-label', 'My div');
  }
}

function App() {
  // Apply accessibility fixes when component mounts
  useEffect(() => {
    addLangAttribute();
    addMainLandmark();
    fixTableStructureIssues();
    ensureUniqueLandmarks();
    addSvgAccessibleNames();
    addAriaLabelToMyDiv();
  }, []);

  return (
    <html lang="en">
      <head>
        {customHead()}
      </head>
      <body>
        <main role="main" aria-labelledby="main-heading">
          <h1>Accessible Application</h1>
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
      </body>
    </html>
  );
}

export default App;

// Export the new functions
export { handleRotateBack, addLangAttribute, addMainLandmark, fixTableStructureIssues, ensureUniqueLandmarks, addSvgAccessibleNames, addAriaLabelToMyDiv };