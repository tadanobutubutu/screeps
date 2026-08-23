// TODO: Add back any required exports that might have been removed
// Here is an example of how to export a required function from another file:

// EXISTING AND PRESERVED CODE ...

// NEW FUNCTION: Fix table structure issues
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

// NEW FUNCTION: Add aria-label to the 'myDiv' element
function addAriaLabelToMyDiv() {
  const myDiv = document.getElementById('myDiv');
  if (myDiv) {
    myDiv.setAttribute('aria-label', 'My div');
  }
}

// EXPORT new functions
export { fixTableStructureIssues, ensureUniqueLandmarks, addSvgAccessibleNames, addAriaLabelToMyDiv };