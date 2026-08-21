import DependencyGraph from './DependencyGraph';

const DependencyGraphComponent = () => {
  // Other components and content
  return (
    <div>
      <button type="button" id="unrotate" aria-pressed="false" onClick={() => {/* Rotate back logic here */}}>rotate back</button>
      {/* Other components and content */}
      <DependencyGraph />
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
  const landmarkSelectors = ['[role="main"]', '[role="navigation"]', '[role="banner"]', '[role="complementary"]', '[role="contentinfo"]', '[role="search"]'];

  const usedLabels = new Map();

  for (const landmarkSelector of landmarkSelectors) {
    const landmark = document.querySelector(landmarkSelector);
    if (landmark) {
      const ariaLabel = landmark.getAttribute('aria-label');
      const landmarkId = landmark.id || '';
      const idBase = landmarkId || landmarkSelector.slice(1);

      if (!ariaLabel) {
        // Generate a unique identifier if no aria-label is present
        let uniqueIdentifier = idBase;
        const count = usedLabels.has(uniqueIdentifier) ? usedLabels.get(uniqueIdentifier) + 1 : 1;
        uniqueIdentifier = `${idBase}${count}`;
        usedLabels.set(uniqueIdentifier, 1);
        landmark.setAttribute('id', uniqueIdentifier);
      } else {
        // Check if the aria-label is already used
        if (usedLabels.has(ariaLabel)) {
          usedLabels.set(ariaLabel, usedLabels.get(ariaLabel) + 1);
          const newLabel = `${ariaLabel} ${usedLabels.get(ariaLabel)}`;
          landmark.setAttribute('aria-label', newLabel);
        }
      }
    }
  }
};

const fixTableStructureIssues = () => {
  // Address table structure accessibility issues
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    // 1. Ensure all tables have proper <th> elements with scope attributes
    const thElements = table.querySelectorAll('th');
    thElements.forEach(th => {
      if (th.closest('thead')) {
        th.setAttribute('scope', 'col');
      } else if (th.closest('tbody') || th.closest('tr')) {
        th.setAttribute('scope', 'row');
      }

      // Check for row spans and adjust scope accordingly
      const rowspan = parseInt(th.getAttribute('rowspan'));
      if (rowspan && rowspan > 1) {
        th.setAttribute('scope', 'rowgroup');
      }
    });

    // 2. Add caption elements where appropriate
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.appendChild(caption);
    }

    // 3. Ensure proper thead/tbody structure
    if (!table.querySelector('thead') && table.querySelector('tr') && table.querySelector('tr th')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      const newTheadRows = [...firstRow.children].map((child) => child.cloneNode(true));

      thead.appendChild(...newTheadRows);
      table.insertBefore(thead, table.firstChild);
    }

    // 4. Add aria-describedby for complex tables
    if (table.querySelectorAll('th, td').length > 30) {
      const descriptionId = 'data-table-description';
      const description = document.createElement('p');
      description.id = descriptionId;
      description.textContent = 'This table contains multiple columns and rows of data relevant to the application';
      table.appendChild(description);
      table.setAttribute('aria-describedby', descriptionId);
    }
  });
};

const addSvgAccessibleNames = () => {
  // Add accessible names to SVG elements
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    const hasAriaLabel = svg.querySelector('[aria-labelledby]');
    const hasTitle = svg.querySelector('title');
    const hasLabelledBy = svg.hasAttribute('aria-labelledby');

    if ((!hasAriaLabel && !hasTitle && !hasLabelledBy) || !svg.hasAttribute('aria-labelledby')) {
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
  const fakeLinks = document.querySelectorAll('[href="#"][role="link"]');

  fakeLinks.forEach(link => {
    if (link.tagName !== 'A') {
      // Handle elements with role="link" that aren't actual anchor tags
      link.setAttribute('role', 'button');
      link.onclick = () => link.dispatchEvent(new Event('click', { bubbles: true }));
    } else {
      // Convert fake links (href="#") to proper buttons
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = link.textContent;
      button.className = link.className;
      button.onclick = link.onclick;

      // Copy all attributes except href
      [...link.attributes].forEach(attr => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });

      // Replace actual anchor tag with the created button
      link.parentNode.replaceChild(button, link);
    }
  });
};

const fixDuplicateMainLandmarks = () => {
  // Replaces additional <main> elements with <section> elements with appropriate aria-labels
  const mainElements = document.querySelectorAll('main');

  if (mainElements.length > 1) {
    // Keep the first main element as is
    // Convert subsequent main elements to section elements with aria-label
    mainElements.forEach((main, index) => {
      if (index > 0) {
        const section = document.createElement('section');
        section.setAttribute('aria-label', `Content section ${index + 1}`);

        // Copy all child nodes from main to section
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }

        // Copy all attributes from main to section
        Array.from(main.attributes).forEach(attr => {
          if (attr.name !== 'role') {
            section.setAttribute(attr.name, attr.value);
          }
        });

        // Replace main with section in the DOM
        main.parentNode.replaceChild(section, main);
      }
    });
  }
};

const initAccessibilityFixes = () => {
  addLangAttribute();
  ensureUniqueLandmarks();
  fixDuplicateMainLandmarks();
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
  fixDuplicateMainLandmarks,
  initMain
};