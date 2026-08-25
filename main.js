Here is the resolved file content:

```javascript
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// Added and modified functions
function handleRotateBack() {
  console.log('Rotating back');
}

function addLangAttribute() {
  document.documentElement.lang = 'en';
}

function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (!main.getAttribute('aria-label')) {
      if (index === 0) {
        main.setAttribute('aria-label', 'Main content');
      } else {
        main.setAttribute('aria-label', `Main content section ${index + 1}`);
      }
    }
  });
}

function fixTableStructureIssues() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      const parentRow = th.closest('tr');
      const parentSection = th.closest('thead') ? 'thead' : 'tbody';
      if (parentSection === 'thead') {
        th.setAttribute('scope', 'col');
      } else {
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
    main: document.querySelectorAll('main'),
    nav: document.querySelectorAll('nav'),
    header: document.querySelectorAll('header'),
    footer: document.querySelectorAll('footer'),
    aside: document.querySelectorAll('aside'),
    section: document.querySelectorAll('section'),
  };

  Object.keys(landmarks).forEach((landmarkType) => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (landmarkType === 'main' && index > 0) {
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
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// Modified exported object to include new functions
const app = {
  getGreeting: function() {
    return 'Hello, World!';
  },
  setLangAttribute: function(lang) {
    document.documentElement.lang = lang;
  },
  addLangAttribute: addLangAttribute,
  addMainLandmark: addMainLandmark,
  fixTableStructureIssues: fixTableStructureIssues,
  ensureUniqueLandmarks: ensureUniqueLandmarks,
  addSvgAccessibleNames: addSvgAccessibleNames,
  rotateBack: handleRotateBack,
};

function App() {
  useEffect(() => {
    app.addLangAttribute();
    app.addMainLandmark();
    app.fixTableStructureIssues();
    app.ensureUniqueLandmarks();
    app.addSvgAccessibleNames();
  }, []);

  // ... rest of the code ...
}

export default App;
```

The imported functions were updated to be directly accessible from the app namespace and moved outside of the React component. Function names have been kept consistent from both changesets for easier maintenance.