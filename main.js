module.exports = {
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkLinkAndButtonAccessibility,
  checkAccessibility,
  renderIndexView,
  enforceUniqueLandmarks,
  handleLandmarkIssues,
  addMainLandmark,
  fixTableStructureIssues,
  fixTableAccessibility,
  addAriaLabelToSVGs,
  addAriaLabelledbyToSVGs,
  addProperLandmarkRegions

  // Added functions
  calculateSum,
  checkLandmarkElements,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  ensureUniqueLandmarks
};

function enforceUniqueLandmarks(container) {
  const results = {
    isUnique: true,
    uniqueLandmarks: [],
    duplicateLandmarks: [],
    totalLandmarks: 0
  };

  const landmarkTypes = ['main', 'navigation', 'header', 'footer', 'aside', 'contentinfo', 'search'];
  const landmarkSelectors = landmarkTypes.map(type => `#__${type}__`).join(',');
  const landmarks = container.querySelectorAll(landmarkSelectors);

  results.totalLandmarks = landmarks.length;

  const landmarkCounts = {};
  const landmarkElements = {};

  landmarks.forEach(landmark => {
    const landmarkType = landmark.id.replace(/__/g, '');

    if (!landmarkCounts[landmarkType]) {
      landmarkCounts[landmarkType] = 0;
      landmarkElements[landmarkType] = [];
    }

    landmarkCounts[landmarkType]++;
    landmarkElements[landmarkType].push(landmark);
  });

  landmarkTypes.forEach(type => {
    const count = landmarkCounts[type];
    if (count > 1) {
      results.isUnique = false;
      results.duplicateLandmarks.push({
        type: type,
        count: count,
        elements: landmarkElements[type]
      });
    } else {
      results.uniqueLandmarks.push({
        type: type,
        count: count,
        elements: landmarkElements[type]
      });
    }
  });

  return results;
}

function handleLandmarkIssues() {
  // TODO: Add/fix 2 landmark issues (DONE: addMainLandmark)
}

function addMainLandmark() {
  const primaryContentContainer = document.querySelector('.primary-content');
  if (primaryContentContainer) {
    primaryContentContainer.setAttribute('id', '__main__');
  }
}

function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure each table has all required headings
    const headers = table.querySelectorAll('thead th');
    if (headers.length < table.rows.length - 1) {
      table.insertBefore(createColumnHeaders(table.rows[0].cloneNode(true)), table.rows[1]);
    }

    // Check if each heading has a proper scope
    const rowIndex = 1;
    const headerCells = table.rows[rowIndex].querySelectorAll('th');
    headerCells.forEach((headerCell, index) => {
      const headerScope = headerCell.scope ? headerCell.scope.toUpperCase() : null;
      const cellIndex = index + 1;
      const cellsInColumn = table.querySelectorAll(`td:nth-child(${cellIndex})`);
      if (headerScope === 'COL' || (!headerScope && cellsInColumn.length === 1)) {
        // Proper scope or single column
        return;
      }

      const thScope = table.insertCell();
      thScope.appendChild(document.createTextNode(''));
      thScope.colSpan = cellsInColumn.length > 1 ? cellsInColumn.length : null;
      thScope.rowSpan = 1;
      thScope.setAttribute('scope', 'col');
      table.insertBefore(thScope, headerCell);
      Array.from(cellsInColumn).forEach(cell => {
        cell.setAttribute('scope', 'row');
      });
    });
  });
}

function fixTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('thead th');
    const headerText = headers[0].textContent || headers[0].innerText;
    table.setAttribute('aria-labelledby', `table-${table.id}-label`);
    const tableLabel = document.createElement('h2');
    tableLabel.id = `table-${table.id}-label`;
    tableLabel.textContent = headerText;
    table.parentNode.insertBefore(tableLabel, table);
  });
}

function addAriaLabelToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const titleText = svg.querySelector('title') ? svg.querySelector('title').textContent : 'Image';
    svg.setAttribute('aria-label', titleText);
  });
}

function addAriaLabelledbyToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const titleId = svg.querySelector('title') ? svg.querySelector('title').id : null;
    if (titleId) {
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      const ariaLabel = svg.getAttribute('aria-label') || 'Image';
      const newLabel = document.createElement('label');
      newLabel.setAttribute('id', 'svg-label-' + Math.random().toString(36).slice(2));
      newLabel.setAttribute('aria-label', ariaLabel);
      newLabel.textContent = ariaLabel;
      svg.parentNode.insertBefore(newLabel, svg);
      svg.setAttribute('aria-describedby', newLabel.id);
    }
  });
}

function addProperLandmarkRegions() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Function to ensure all SVG elements have accessible names
  const ensureSvgAccessibleNames = () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      // Check if SVG is hidden
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                        svg.getAttribute('hidden') !== null ||
                        svg.style.display === 'none' ||
                        svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      // Check for existing accessible name
      const hasAriaLabel = svg.getAttribute('aria-label');
      const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      const hasDesc = svg.querySelector('desc');

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('data-favicon') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'Icon';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
      }
    });
  };

  // Function to handle updating accessible SVG names when DOM mutates
  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      ensureSvgAccessibleNames();
    }, 0);
  };

  ensureSvgAccessibleNames();

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateAccessibleSvgNames();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby']
    })}
  }
}

function createColumnHeaders(row) {
  const headers = row.querySelectorAll('th');
  const newRow = document.createElement('tr');

  headers.forEach(header => {
    const headerCell = document.createElement('th');
    headerCell.appendChild(header.cloneNode(true));
    newRow.appendChild(headerCell);
  });

  return newRow;
}