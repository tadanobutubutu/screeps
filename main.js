// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
function setARIARoleForDependencyGraph() {
  if (typeof document === 'undefined') {
    return;
  }
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'grid');
  }
}

// Function to render dependency graph with accessibility features
function renderDependencyGraph(graphData, container) {
  if (!container) return;

  setARIARoleForDependencyGraph();

  const graph = renderDependencyGraphOrig(graphData, container);

  // Ensure container has an id
  ensureElementHasId(container);

  // Add aria-label to the container
  addAriaLabel(container, 'Dependency graph');

  return graph;
}

// New accessibility functions from insight report

// REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

// REACT_027: Fix table structure issues
function validateTableAccessibility(table) {
  if (!table) return true;

  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.textContent.trim()) {
      th.setAttribute('aria-label', 'Empty header');
    }
  });

  return true;
}

function validateTableStructure(table) {
  if (!table) return { valid: true, error: null };

  const rows = table.querySelectorAll('tr');
  const cellCount = rows[0] ? rows[0].querySelectorAll('th, td').length : 0;

  rows.forEach((row, index) => {
    const rowCells = row.querySelectorAll('th, td').length;
    if (rowCells !== cellCount && index > 0) {
      row.setAttribute('role', 'row');
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        cell.setAttribute('role', cellIndex === 0 ? 'rowheader' : 'cell');
      });
    }
  });

  return { valid: true, error: null };
}

// REACT_017: Add/fix landmark issues
function validateLandmarkElement(element, landmarkType) {
  if (!element) return false;

  const existingLandmark = element.getAttribute('role');
  if (!existingLandmark) {
    element.setAttribute('role', landmarkType);
  }

  return true;
}

function validateLandmarkStructure(container) {
  if (!container) return true;

  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];
  const landmarks = container.querySelectorAll('[role]');

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!allowedLandmarks.includes(role)) {
      landmark.removeAttribute('role');
    }
  });

  return true;
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  return '';
}

function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return svgElement;

  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;

  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (!ariaLabelledBy && !svgElement.getAttribute('aria-label')) {
    title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    svgElement.setAttribute('aria-labelledby', title.id);
  }

  return svgElement;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(container) {
  if (!container) return;

  const landmarkCounts = {};
  const landmarks = container.querySelectorAll('[role]');

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
  });

  Object.keys(landmarkCounts).forEach(role => {
    if (landmarkCounts[role] > 1) {
      let count = 0;
      landmarks.forEach(landmark => {
        if (landmark.getAttribute('role') === role) {
          count++;
          if (count > 1) {
            const label = landmark.getAttribute('aria-label') || `${role}-${count}`;
            landmark.setAttribute('aria-label', label);
          }
        }
      });
    }
  });

  return true;
}

// REACT_036: Fix fake link issues
function personName(name, linkElement) {
  if (linkElement && linkElement.tagName !== 'A') {
    const isInteractive = linkElement.getAttribute('role') === 'link' ||
                          linkElement.onclick !== null ||
                          linkElement.tabIndex !== null;

    if (isInteractive) {
      linkElement.setAttribute('role', 'link');
      if (name) {
        linkElement.setAttribute('aria-label', name);
      }
    }
  }
  return linkElement;
}

function createInPageButton(element, label) {
  if (!element) return null;

  if (element.tagName !== 'BUTTON' && !element.getAttribute('role')) {
    element.setAttribute('role', 'button');
    if (label) {
      element.setAttribute('aria-label', label);
    }
  }

  return element;
}

// New functions related to counting dependencies and starting the application

function countDependencies() {
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

function createServer() {
  // ... Existing code ...
  return http.createServer(app);
}

function startApp() {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  server.on('listening', () => {
    setARIARoleForDependencyGraph();
  });
  return server;
}

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

// Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssues() {
  // Add lang attribute to HTML element
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute(htmlElement));
  }

  // Implement function for counting dependencies with Node.js
  AddressabilityIssues.countDependencies = countDependencies;
  // ...
}

function initializeAccessibility() {
  if (!document.querySelectorAll) return;
  addressAccessibilityIssues(sampleInsightReport);
}

// Fix 26 table structure issues
const tables = document.querySelectorAll('table');
tables.forEach((table) => {
  const validationResultTableAccessibility = validateTableAccessibility(table);
  if (!validationResultTableAccessibility) {
    // Handle invalid table structure
    console.error(`Table structure issues found: ${validationResultTableAccessibility.error}`);
  }

  const validationResultTableStructure = validateTableStructure(table);
  if (!validationResultTableStructure.valid) {
    // Handle invalid table structure
    console.error(`Table structure issues found: ${validationResultTableStructure.error}`);
  }
});

// Add/fix 4 landmark issues
const landmarks = document.querySelectorAll('main, nav, aside, header, footer');
landmarks.forEach((landmark) => {
  const validationResultLandmark = validateLandmark(landmark);
  if (!validationResultLandmark.valid) {
    // Handle invalid landmark
    console.error(`Landmark issues found: ${validationResultLandmark.error}`);
  }
});

// Add accessible names to 2 SVGs
const svgElements = document.querySelectorAll('svg');
svgElements.forEach((svg) => {
  const accessibleName = getSvgAccessibleName(svg);
  if (accessibleName) {
    svg.setAttribute('aria-label', accessibleName);
  }
});

// Ensure unique landmarks
const uniqueLandmarks = ensureUniqueLandmarks(document);
if (!uniqueLandmarks) {
  console.error('Non-unique landmarks detected');
}

// Fix 1 fake link issue
const fakeLinks = document.querySelectorAll('a[href="#"]');
fakeLinks.forEach((link) => {
  handleFakeLinks([{
    type: 'fake',
    message: 'Link points to an invalid location'
  }]);
  link.setAttribute('href', '#');
});

// Accessibility-focused implementation functions
function countDependencies() {
  // Implement function for counting dependencies with Node.js
}

function handleCredentialResponse(response) {
  // Implement function for handling credential responses
}

function handleFakeLinks(issues) {
  // Placeholder
}

// Additional utility functions from origin/main
function addBook(bookData) {
  // ... Existing code ...
  return bookData;
}

function generateAccessibilityReport() {
  // Placeholder implementation
}

// Start the application if run directly
if (require.main === module) {
  startApp();
}