// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues)
// REACT_036: Fix 1 fake link issue

/**
 * Main application entry point with accessibility features
 */

function addSvgAccessibilityProps() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
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

const AddressabilityIssues = {
  addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible language
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues) || accessibilityReport.issues.length === 0) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main([^>]*)>/, '<section$1>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole) {
      return {  valid: false, error: 'Element does not have a valid landmark role', element: tagName };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}`, element: tagName, role: landmarkRole };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  spawnSomeCommand(callback) {
    const child_process = require('child_process');

    const spawnOptions = {  shell: true };

    child_process.spawn('someCommand', [], spawnOptions, (error, stdout, stderr) => {
      if (error) {
        callback(new Error(`someCommand failed: ${error.message}`));
        return;
      }

      callback(null, `someCommand exited with status code: ${stdout}`);
    });
  },

  addLangAttribute(element, lang) {
    element.setAttribute('lang', lang);
  },

  countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      // TODO: This is the existing code that needs to be preserved
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  }
};

// REACT_041 & REACT_015: Updated function that renders dependency graphs with accessibility features
function renderDependencyGraph(containerElement, dependencyData) {
  if (!containerElement) {
    console.error('Container element is required for rendering dependency graph');
    return null;
  }

  // Set the container's lang attribute for proper language identification
  containerElement.setAttribute('lang', 'en');

  // Create accessible description for the graph
  const descriptionId = 'dep-graph-desc-' + Date.now();
  
  // Create the graph structure with proper accessibility
  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'figure');
  graphContainer.setAttribute('aria-labelledby', 'dep-graph-title-' + Date.now());
  graphContainer.setAttribute('aria-describedby', descriptionId);
  graphContainer.id = 'dependency-graph-' + Date.now();

  // Add accessible title
  const title = document.createElement('h2');
  title.id = 'dep-graph-title-' + Date.now();
  title.textContent = 'Project Dependencies Overview';
  title.className = 'sr-only';
  graphContainer.appendChild(title);

  // Add accessible description
  const description = document.createElement('p');
  description.id = descriptionId;
  description.className = 'sr-only';
  const totalDeps = dependencyData.dependencies + dependencyData.devDependencies;
  description.textContent = `This graph shows ${dependencyData.dependencies} production dependencies and ${dependencyData.devDependencies} development dependencies, totaling ${totalDeps} dependencies.`;
  graphContainer.appendChild(description);

  // Create accessible table representation of dependency graph
  const table = document.createElement('table');
  table.setAttribute('role', 'table');
  table.setAttribute('aria-label', 'Dependency statistics');
  
  // Add table caption for accessibility
  const caption = document.createElement('caption');
  caption.textContent = 'Project Dependency Statistics';
  table.appendChild(caption);

  // Create table header with scope attributes
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const headers = ['Dependency Type', 'Count', 'Percentage'];
  
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body with accessible data
  const tbody = document.createElement('tbody');
  const rows = [
    { type: 'Production Dependencies', count: dependencyData.dependencies },
    { type: 'Development Dependencies', count: dependencyData.devDependencies },
    { type: 'Total Dependencies', count: dependencyData.total }
  ];

  rows.forEach((row, index) => {
    const tr = document.createElement('tr');
    const percentage = totalDeps > 0 ? Math.round((row.count / totalDeps) * 100) : 0;
    
    // First cell
    const tdType = document.createElement('td');
    tdType.textContent = row.type;
    tr.appendChild(tdType);
    
    // Count cell
    const tdCount = document.createElement('td');
    tdCount.setAttribute('aria-label', `${row.count} ${row.type.toLowerCase()}`);
    tdCount.textContent = row.count;
    tr.appendChild(tdCount);
    
    // Percentage cell
    const tdPercent = document.createElement('td');
    tdPercent.setAttribute('aria-label', `${percentage} percent`);
    tdPercent.textContent = `${percentage}%`;
    tr.appendChild(tdPercent);
    
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  
  graphContainer.appendChild(table);

  // Create visual SVG graph representation with accessibility
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Bar chart showing ${dependencyData.dependencies} production dependencies and ${dependencyData.devDependencies} development dependencies`);
  svg.setAttribute('width', '300');
  svg.setAttribute('height', '150');
  svg.setAttribute('viewBox', '0 0 300 150');

  // Add title element within SVG for accessibility
  const svgTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  svgTitle.textContent = 'Dependency Graph - Visual Representation';
  svg.appendChild(svgTitle);

  // Add desc element for detailed description
  const svgDesc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
  svgDesc.textContent = `A bar chart comparing production dependencies (${dependencyData.dependencies}) and development dependencies (${dependencyData.devDependencies}). Total: ${totalDeps} dependencies.`;
  svg.appendChild(svgDesc);

  // Draw accessible bar chart
  const barWidth = 80;
  const barHeight = Math.max(20, (dependencyData.dependencies / Math.max(totalDeps, 1)) * 100);
  const bar2Height = Math.max(20, (dependencyData.devDependencies / Math.max(totalDeps, 1)) * 100);

  // Production dependencies bar
  const bar1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bar1.setAttribute('x', '40');
  bar1.setAttribute('y', 130 - barHeight);
  bar1.setAttribute('width', barWidth.toString());
  bar1.setAttribute('height', barHeight.toString());
  bar1.setAttribute('aria-label', `Production dependencies: ${dependencyData.dependencies}`);
  svg.appendChild(bar1);

  // Development dependencies bar
  const bar2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bar2.setAttribute('x', '180');
  bar2.setAttribute('y', 130 - bar2Height);
  bar2.setAttribute('width', barWidth.toString());
  bar2.setAttribute('height', bar2Height.toString());
  bar2.setAttribute('aria-label', `Development dependencies: ${dependencyData.devDependencies}`);
  svg.appendChild(bar2);

  // Add accessible labels below bars
  const label1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label1.setAttribute('x', '80');
  label1.setAttribute('y', '145');
  label1.setAttribute('text-anchor', 'middle');
  label1.setAttribute('aria-hidden', 'true');
  label1.textContent = `Prod: ${dependencyData.dependencies}`;
  svg.appendChild(label1);

  const label2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  label2.setAttribute('x', '220');
  label2.setAttribute('y', '145');
  label2.setAttribute('text-anchor', 'middle');
  label2.setAttribute('aria-hidden', 'true');
  label2.textContent = `Dev: ${dependencyData.devDependencies}`;
  svg.appendChild(label2);

  graphContainer.appendChild(svg);

  // Append graph to container
  containerElement.appendChild(graphContainer);

  return graphContainer;
}

// Helper function to get accessible SVG name
function getSvgAccessibleName(svg) {
  const titleElement = svg.querySelector('title');
  if (titleElement) {
    return titleElement.textContent;
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  return '';
}

// Helper function to set SVG accessibility attributes
function setSvgAttributes(svg) {
  if (!svg) return;
  
  // Ensure title exists for accessibility
  if (!svg.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Dependency visualization';
    svg.insertBefore(title, svg.firstChild);
  }
  
  // Ensure description exists
  if (!svg.querySelector('desc')) {
    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Visual representation of project dependencies';
    const title = svg.querySelector('title');
    if (title && title.nextSibling) {
      svg.insertBefore(desc, title.nextSibling);
    } else {
      svg.appendChild(desc);
    }
  }
}

// ... (other functions and comments preserved)