import React from 'react';
import ReactDOM from 'react-dom/client';

// Address accessibility issues from insight report:
// Implemented accessibility-related code changes below

const DependencyGraphComponent = () => {
  // Other components and content
  return (
    <div>
      <button type="button" id="unrotate" aria-pressed="false" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      {/* Other components and content */}
      <DependencyGraph />
=======
import React from 'react';
import ReactDOM from 'react-dom/client';

// Address accessibility issues from insight report:
// Implemented accessibility-related code changes below

const DependencyGraphComponent = () => {
  // Other components and content
  return (
    <div>
      <button type="button" id="unrotate" aria-pressed="false" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      {/* Other components and content */}
      <DependencyGraph />
>>>>>>> origin/main
    </div>
  );
};

const addLangAttribute = () => {
  // Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = 'en';
  }
};

const ensureUniqueLandmarks = () => {
  // Ensure each landmark region has a unique aria-label or role
  // Common landmark roles: banner, navigation, main, complementary, contentinfo, search
  // This function should be called during component mount to validate uniqueness
  // Example of ensuring unique landmarks for existing landmarks:
  const landmarkSelectors = ['[role="main"]', '[role="contentinfo"]', '[role="search"]', '[role="banner"]', '[role="navigation"]', '[role="complementary"]'];
  const existingLandmarks = document.querySelectorAll(landmarkSelectors.join(', '));

  const usedLabels = new Map();

  for (const landmark of existingLandmarks) {
    const ariaLabel = landmark.getAttribute('aria-label');
    const landmarkId = landmark.id || '';

    if (!ariaLabel) {
      // Generate a unique identifier if no aria-label is present
      let uniqueIdentifier = landmarkId || 'landmark-' + usedLabels.size;

      if (usedLabels.has(uniqueIdentifier)) {
        const count = usedLabels.get(uniqueIdentifier) + 1;
        uniqueIdentifier = uniqueIdentifier + '-' + count;
        usedLabels.set(uniqueIdentifier, 1);
      } else {
        usedLabels.set(uniqueIdentifier, 1);
      }
      landmark.setAttribute('aria-label', uniqueIdentifier);
    } else {
      // Check if the aria-label is already used
      if (usedLabels.has(ariaLabel)) {
        usedLabels.set(ariaLabel, usedLabels.get(ariaLabel) + 1);
        const newLabel = ariaLabel + ' ' + usedLabels.get(ariaLabel);
        landmark.setAttribute('aria-label', newLabel);
      } else {
        usedLabels.set(ariaLabel, 1);
      }
    }
  }
};

const fixTableStructureIssues = () => {
  // Address table structure accessibility issues:
  // 1. Ensure all tables have proper <th> elements with scope attributes
  // 2. Add caption elements where appropriate
  // 3. Ensure proper thead/tbody/tfoot structure
  // 4. Add aria-describedby for complex tables
  // 5. Ensure proper column/row headers
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    // 1. Add scope attributes to <th> elements
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (th.closest('thead')) {
        th.setAttribute('scope', 'col');
      } else if (th.closest('tbody') || th.closest('tr')) {
        th.setAttribute('scope', 'row');
      }

      // Check for row spans and adjust scope accordingly
      const rowspan = th.getAttribute('rowspan');
      if (rowspan && parseInt(rowspan) > 1) {
        th.setAttribute('scope', 'rowgroup');
      }
    });

    // 2. Add caption if not present
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }

    // 3. Ensure proper thead/tbody structure
    if (!table.querySelector('thead') && table.querySelector('tr th')) {
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.contains(table.querySelector('th'))) {
        const thead = document.createElement('thead');
        const clonedRow = firstRow.cloneNode(true);
        thead.appendChild(clonedRow);
        table.insertBefore(thead, table.firstChild);
        if (firstRow.parentNode === table) {
          table.removeChild(firstRow);
        }
      }
    }

    if (!table.querySelector('tbody') && table.children.length > 1) {
      const bodyRows = Array.from(table.querySelectorAll('tr')).filter(tr => !tr.closest('thead'));

      if (bodyRows.length > 0) {
        const tbody = document.createElement('tbody');
        bodyRows.forEach(tr => tbody.appendChild(tr));
        table.appendChild(tbody);
        // Remove original rows that are now in tbody
        bodyRows.forEach(tr => {
          if (tr.parentNode === table) {
            table.removeChild(tr);
          }
        });
      }
    }
  });
};

const addSvgAccessibleNames = () => {
  // Add accessible names to SVG elements
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    const hasAriaLabel = svg.getAttribute('aria-label') !== null;
    const hasTitle = svg.querySelector('title') !== null;
    const hasLabelledBy = svg.getAttribute('aria-labelledby') !== null;

    if (!hasAriaLabel && !hasTitle && !hasLabelledBy) {
      const title = document.createElement('title');
      title.id = `svg-title-${index + 1}`;
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
};

const fixFakeLinks = () => {
  // Fix 1 fake link issue - replace href="#" with button elements
  const fakeLinks = document.querySelectorAll('a[href="#"], [role="link"]');

  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      // Handle elements with role="link" that aren't actual anchor tags
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    } else {
      // Convert fake links (href="#") to proper buttons
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = link.textContent;
      button.className = link.className;
      button.onclick = link.onclick;

      // Copy all attributes except href
      Array.from(link.attributes).forEach(attr => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });

      link.parentNode.replaceChild(button, link);
    }
  });
};

const initAccessibilityFixes = () => {
  addLangAttribute();
  ensureUniqueLandmarks();
  fixTableStructureIssues();
  addSvgAccessibleNames();
  fixFakeLinks();
};

// A new function: initMain is added to ensure that initAccessibilityFixes gets executed when the page loads
const initMain = () => {
  initAccessibilityFixes();
};

// We update the export section to include initMain as well
export {
  DependencyGraphComponent,
  addLangAttribute,
  ensureUniqueLandmarks,
  fixTableStructureIssues,
  addSvgAccessibleNames,
  fixFakeLinks,
  initMain
};

// Keeping both export statements to maintain the original export and the line added in the conflicting code
export default App;

// Integrating both rendering approaches
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);