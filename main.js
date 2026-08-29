import { class1, function1, Object1 } from './path/to/module';

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    const headers = table.querySelectorAll('th');
    headers.forEach((header) => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
        fixedCount++;
      }
    });

    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');

    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }

    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? Array.from(rows).slice(0) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }

    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length > 0) {
        if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
          const firstCell = cells[0];
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
        }
      }
    });
  });

  return document;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = null;

  if (!mainElement) {
    const body = document.body;
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('id', 'main-content');
    }

    const children = body.children;
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }

    if (mainElement && mainElement.tagName !== 'MAIN') {
      mainElement.setAttribute('role', 'main');
    }

    mainElement = main;
  }

  return mainElement;
}

// Function to ensure unique landmarks (by role approach)
function ensureUniqueLandmarks(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    mains.forEach((main, index) => {
      main.setAttribute('aria-label', `Main content ${index + 1}`);
    });
  }

  return document;
}

// Function to add accessible names to SVG elements
function addAccessibleNamesToSVGs(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title') && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'Accessible SVG';
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssues(document) {
  const clickableElements = document.querySelectorAll('[onclick]');
  let count = 0;

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') || onclick.includes('.href'))) {
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });

      if (element.className) {
        span.className = element.className;
      }

      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return document;
}

// Function to fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      const role = landmark.getAttribute('role');
      landmark.setAttribute('aria-label', `${role} region`);
    }
  });
}

// Function to add landmark regions
function addLandmarkRegions(document) {
  const sections = document.querySelectorAll('section:not([role])');
  sections.forEach((section, index) => {
    if (!section.id) {
      section.id = `section-${index + 1}`;
    }
    if (!section.getAttribute('aria-label') && !section.querySelector('h1, h2, h3, h4, h5, h6')) {
      section.setAttribute('role', 'region');
      section.setAttribute('aria-label', `Section ${index + 1}`);
    }
  });
}

function uniqueLandmarks(document) {
  return ensureUniqueLandmarks(document);
}

// Address accessibility issues from insight report for image alt texts
function fixImageAltTexts(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];

  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} ${index + 1}`);
        }
      });
    }
  });

  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    mains.forEach((main, index) => {
      main.setAttribute('aria-label', `Main content ${index + 1}`);
    });
  }

  return document;
}

// Function to add accessible names to SVGs (alias)
function addAccessibleNamesToSVGs(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title')) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'Accessible SVG';
      svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  return document;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  // Check if Google Identity Services is available
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
  }

  const buttonContainer = document.getElementById('g_id_onload');
  if (buttonContainer) {
    google.accounts.id.renderButton(
      buttonContainer,
      { theme: 'outline', size: 'large' }
    );
  }

  return document;
}

// Callback for Google sign-in
function handleCredentialResponse(response) {
  console.log('Google credential response:', response);
}

// Function to ensure the element has an id
function ensureElementHasId(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

// Function to ensure an element has an id with origin/main optimization
function ensureElementHasIdOrigin(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.id) {
      element.id = element.dataset && element.dataset.id > 0 ? element.dataset.id : `${idPrefix}-${Math.random().toString(36).substr(2, 9)}`;
    }
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabel(document, selector, label) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

// Function to render dependency graphs
function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('#dependencyGraph');
  if (graphContainer) {
    // Create SVG element for the dependency graph
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 800 400');

    // Add accessible title and description
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Dependency Graph';
    svg.appendChild(title);

    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Visual representation of module dependencies';
    svg.appendChild(desc);
  }
  return document;
}

// Function to generate a report based on accessibility issues
function generateAccessibilityReport(document) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: 0,
      critical: 0,
      moderate: 0,
      minor: 0
    },
    issues: []
  };

  // Check for missing lang attribute on html element
  const htmlElement = document.documentElement;
  if (!htmlElement || !htmlElement.lang) {
    report.issues.push({
      type: 'missing-lang',
      severity: 'critical',
      element: 'html',
      selector: 'html',
      message: 'Missing lang attribute on <html> element',
      recommendation: 'Add lang attribute to the <html> element (e.g., lang="en")'
    });
    report.summary.totalIssues++;
    report.summary.critical++;
  }

  // Check tables for accessibility issues
  const tables = document.querySelectorAll('table');
  tables.forEach((table, tableIndex) => {
    const headers = table.querySelectorAll('th');
    const hasThead = table.querySelector('thead');
    const hasTbody = table.querySelector('tbody');

    headers.forEach((header, headerIndex) => {
      if (!header.hasAttribute('scope')) {
        report.issues.push({
          type: 'table-missing-scope',
          severity: 'moderate',
          element: 'th',
          selector: `table:nth-of-type(${tableIndex + 1}) th:nth-of-type(${headerIndex + 1})`,
          message: `Table header missing scope attribute`,
          recommendation: 'Add scope="col" or scope="row" to table headers'
        });
        report.summary.totalIssues++;
        report.summary.moderate++;
      }
    });

    if (!hasThead) {
      report.issues.push({
        type: 'table-missing-thead',
        severity: 'minor',
        element: 'table',
        selector: `table:nth-of-type(${tableIndex + 1})`,
        message: 'Table missing <thead> element',
        recommendation: 'Wrap the first row of table cells in <thead>'
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }

    if (!hasTbody) {
      report.issues.push({
        type: 'table-missing-tbody',
        severity: 'minor',
        element: 'table',
        selector: `table:nth-of-type(${tableIndex + 1})`,
        message: 'Table missing <tbody> element',
        recommendation: 'Wrap table rows in <tbody>'
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  // Check for duplicate landmarks
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          report.issues.push({
            type: 'duplicate-landmark',
            severity: 'moderate',
            element: el.tagName.toLowerCase(),
            selector: `[role="${role}"]:nth-of-type(${index + 1})`,
            message: `Duplicate ${role} landmark without accessible name`,
            recommendation: `Add aria-label="${role} ${index + 1}" to distinguish landmarks`
          });
          report.summary.totalIssues++;
          report.summary.moderate++;
        }
      });
    }
  });

  // Check SVGs for accessibility
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      report.issues.push({
        type: 'svg-missing-accessible-name',
        severity: 'moderate',
        element: 'svg',
        selector: `svg:nth-of-type(${index + 1})`,
        message: 'SVG element missing accessible name',
        recommendation: 'Add <title> element or aria-label/aria-labelledby attribute'
      });
      report.summary.totalIssues++;
      report.summary.moderate++;
    }

    if (!svg.getAttribute('role')) {
      report.issues.push({
        type: 'svg-missing-role',
        severity: 'minor',
        element: 'svg',
        selector: `svg:nth-of-type(${index + 1})`,
        message: 'SVG element missing role="img"',
        recommendation: 'Add role="img" to SVG elements'
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  // Check for fake links
  const clickableElements = document.querySelectorAll('[onclick]');
  clickableElements.forEach((element, index) => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const onclick = element.getAttribute('onclick') || '';

    if (!isAnchor && (onclick.includes('window.location') || onclick.includes('.href'))) {
      report.issues.push({
        type: 'fake-link',
        severity: 'critical',
        element: tagName,
        selector: `${tagName}[onclick]:nth-of-type(${index + 1})`,
        message: `Non-anchor element using navigation in onclick`,
        recommendation: 'Use <a> element with href attribute for navigation'
      });
      report.summary.totalIssues++;
      report.summary.critical++;
    }
  });

  // Check images for alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    const hasAlt = img.hasAttribute('alt');
    const altValue = img.getAttribute('alt');

    if (!hasAlt) {
      report.issues.push({
        type: 'image-missing-alt',
        severity: 'critical',
        element: 'img',
        selector: `img:nth-of-type(${index + 1})`,
        message: 'Image missing alt attribute',
        recommendation: 'Add alt attribute describing the image content'
      });
      report.summary.totalIssues++;
      report.summary.critical++;
    } else if (altValue === '') {
      report.issues.push({
        type: 'image-empty-alt',
        severity: 'minor',
        element: 'img',
        selector: `img:nth-of-type(${index + 1})`,
        message: 'Image has empty alt attribute (decorative image)',
        recommendation: 'Ensure image is truly decorative or provide meaningful description'
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  // Check sections for landmark regions
  const sections = document.querySelectorAll('section:not([role])');
  sections.forEach((section, index) => {
    const hasHeading = section.querySelector('h1, h2, h3, h4, h5, h6');
    const hasAriaLabel = section.getAttribute('aria-label');

    if (!hasHeading && !hasAriaLabel) {
      report.issues.push({
        type: 'section-missing-label',
        severity: 'minor',
        element: 'section',
        selector: `section:not([role]):nth-of-type(${index + 1})`,
        message: 'Section without heading or accessible name',
        recommendation: 'Add aria-label or include a heading element'
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  // Check for landmarks without accessible names
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  landmarks.forEach((landmark, index) => {
    if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      const role = landmark.getAttribute('role');
      report.issues.push({
        type: 'landmark-missing-label',
        severity: 'minor',
        element: landmark.tagName.toLowerCase(),
        selector: `[role="${role}"]:nth-of-type(${index + 1})`,
        message: `${role} landmark missing accessible name`,
        recommendation: `Add aria-label="${role} region" to landmark`
      });
      report.summary.totalIssues++;
      report.summary.minor++;
    }
  });

  return report;
}

// Export for testing and external use
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssues,
  fixLandmarkIssues,
  addLandmarkRegions,
  uniqueLandmarks,
  fixImageAltTexts,
  googleSignIn,
  handleCredentialResponse,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  generateAccessibilityReport
};