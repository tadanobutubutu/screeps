import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function handleRotateBack() {
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
      const parentRow = th.closest('tr');
      const parentSection = th.closest('thead') ? 'thead' : 'tbody';
      if (parentSection === 'thead') {
        th.setAttribute('scope', 'col');
      } else {
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
  const landmarks = {
    main: Array.from(document.querySelectorAll('main, section')),
    nav: document.querySelectorAll('nav'),
    header: document.querySelectorAll('header'),
    footer: document.querySelectorAll('footer'),
    aside: document.querySelectorAll('aside')
  };

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

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
    svg.setAttribute('role', 'img');
  });
}

function addAriaLabelToMyDiv() {
  const myDiv = document.getElementById('myDiv');
  if (myDiv) {
    myDiv.setAttribute('aria-label', 'My div');
  }
}

function App() {
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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Accessible Application</title>
      </head>
      <body>
        {/* Existing App content */}

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
      </body>
    </html>
  );
}

// Export App component and functions
export default App;
export { handleRotateBack, addLangAttribute, addMainLandmark, fixTableStructureIssues, ensureUniqueLandmarks, addSvgAccessibleNames, addAriaLabelToMyDiv };