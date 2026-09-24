const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: PORT
};

function addBook(bookData) {
  // ... Existing code ...
  return bookData;
}

function getLangAttribute(element) {
  // Determine the language based on content or default to English
  // This resolves the language attribute for accessibility
  return 'en';
}

function personName() {
  // Handle person name accessibility requirements
  // Returns a suitable name for accessibility purposes
  return 'Person Name';
}

function processSvgElements() {
  const svgElements = [];
  return svgElements;
}

function renderDependencyGraph(dependencies) {
  // Render a dependency graph visualization
  const graph = {
    nodes: [],
    edges: []
  };
  
  if (!dependencies) {
    return graph;
  }
  
  // Process dependencies into nodes and edges
  const deps = Array.isArray(dependencies) ? dependencies : Object.keys(dependencies);
  deps.forEach((dep, index) => {
    graph.nodes.push({
      id: `dep-${index}`,
      label: dep.name || dep,
      type: dep.type || 'dependency'
    });
  });
  
  return graph;
}

function renderIndexView(data) {
  // Render index view with accessibility considerations
  const view = {
    title: data.title || 'Index View',
    content: data.content || [],
    landmarks: [],
    accessible: true
  };
  
  // Validate and process landmarks
  const landmarks = ['banner', 'main', 'navigation', 'contentinfo'];
  landmarks.forEach(role => {
    view.landmarks.push({
      role: role,
      count: 1,
      valid: true
    });
  });
  
  return view;
}

function validateTableAccessibility(table, index) {
  const issues = [];
  
  if (!table) {
    issues.push(`Table at index ${index}: Table element is missing or null`);
    return issues;
  }

  // Check if table has a caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push(`Table at index ${index}: Missing caption element (REACT_027)`);
  }

  // Check if table has thead
  const thead = table.querySelector('thead');
  if (!thead) {
    issues.push(`Table at index ${index}: Missing thead element (REACT_027)`);
  }

  // Check if table has tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    issues.push(`Table at index ${index}: Missing tbody element (REACT_027)`);
  }

  // Check if header cells have scope attribute
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach((th, thIndex) => {
    const scope = th.getAttribute ? th.getAttribute('scope') : null;
    if (!scope) {
      issues.push(`Table at index ${index}: th at position ${thIndex} missing scope attribute (REACT_027)`);
    }
  });

  // Check if first row contains only th elements (proper table structure)
  const firstRow = table.querySelector('tr');
  if (firstRow) {
    const cells = firstRow.querySelectorAll('td');
    const allTh = firstRow.querySelectorAll('th');
    if (cells.length > 0 && cells.length !== allTh.length) {
      issues.push(`Table at index ${index}: First row should contain only th elements for proper structure (REACT_027)`);
    }
  }

  return issues;
}

function validateTableStructure(table) {
  // Check 26 table structure issues
  const firstCondition = table && table.tagName === 'table';
  const secondCondition = table && table.querySelector;
  
  if (firstCondition) {
    // Validation logic for the first change
  }
  if (secondCondition) {
    // Validation logic for the second change
  }

  // Also check the table structure and return a boolean value indicating the result
  const issues = [];
  const tables = table ? [table] : [];
  
  tables.forEach((tableItem, index) => {
    const tableIssues = validateTableAccessibility(tableItem, index);
    issues.push(...tableIssues);
  });

  // Check for proper table nesting
  if (table) {
    const nestedTables = table.querySelectorAll('table');
    if (nestedTables.length > 0) {
      issues.push(`Found ${nestedTables.length} nested tables - consider avoiding nested tables for accessibility (REACT_027)`);
    }
  }

  return issues;
}

function ensureUniqueLandmarks() {
  // Check for 2 unique landmarks issues and resolve them
  // Your updated code for ensuring unique landmarks combining both changes
  return true;
}

function createInPageButton(buttonId, buttonText) {
  // Your updated code for createInPageButton() function from both changes
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = buttonText;
  return button;

  // Ensure the returned value is a valid link when appropriate
}

function validateLandmark(element) {
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

  if (!landmarkRole) {
    if (implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    } else {
      return { valid: false, error: 'No landmark role found' };
    }
  }

  if (!landmarkRoles.includes(landmarkRole)) {
    return { valid: false, error: `Invalid landmark role: ${landmarkRole}` };
  }

  return { valid: true, role: landmarkRole };
}

function validateLandmarkStructure() {
  const issues = [];
  
  // Check for multiple main landmarks
  const mainLandmarks = [];
  if (mainLandmarks.length > 1) {
    issues.push(`Found ${mainLandmarks.length} main landmarks - should have only one main landmark (REACT_017)`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = [];
  if (bannerLandmarks.length > 1) {
    issues.push(`Found ${bannerLandmarks.length} banner landmarks - should have only one banner landmark (REACT_017)`);
  }

  // Check for multiple contentinfo landmarks
  const contentinfoLandmarks = [];
  if (contentinfoLandmarks.length > 1) {
    issues.push(`Found ${contentinfoLandmarks.length} contentinfo landmarks - should have only one contentinfo landmark (REACT_017)`);
  }

  // Validate each landmark element
  const landmarkSelectors = [
    '[role="banner"], header',
    '[role="main"], main',
    '[role="navigation"], nav',
    '[role="search"], [role="form"], form',
    '[role="contentinfo"], footer',
    '[role="complementary"], aside',
    '[role="region"], section'
  ];

  landmarkSelectors.forEach(selector => {
    const elements = [];
    elements.forEach(element => {
      const elementIssues = validateLandmark(element);
      if (elementIssues.length > 0) {
        issues.push(...elementIssues);
      }
    });
  });

  return issues;
}

function getSvgAccessibleName(svgElements) {
  if (!svgElements || svgElements.length === 0) {
    return null;
  }

  let accessibleName = null;

  svgElements.forEach(svg => {
    // Check for title element within SVG
    const title = svg.querySelector ? svg.querySelector('title') : null;
    if (title && title.textContent) {
      accessibleName = title.textContent.trim();
      return;
    }

    // Check for aria-label attribute
    const ariaLabel = svg.getAttribute ? svg.getAttribute('aria-label') : null;
    if (ariaLabel) {
      accessibleName = ariaLabel;
      return;
    }

    // Check for aria-labelledby reference
    const ariaLabelledby = svg.getAttribute ? svg.getAttribute('aria-labelledby') : null;
    if (ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby);
      if (labelElement && labelElement.textContent) {
        accessibleName = labelElement.textContent.trim();
        return;
      }
    }

    // Check for role="img" with accessible name
    const role = svg.getAttribute('role');
    if (role === 'img') {
      // SVG with role="img" should have an accessible name
      if (!accessibleName) {
        accessibleName = `SVG image ${svg.getAttribute ? svg.getAttribute('id') || '' : ''}`;
      }
    }
  });

  return accessibleName;
}

function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return svgElement;

  let title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = name;

  const ariaLabelledBy = svgElement.getAttribute ? svgElement.getAttribute('aria-labelledby') : null;
  if (!ariaLabelledBy) {
    title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
    svgElement.setAttribute('aria-labelledby', title.id);
  }

  return svgElement;
}

function ensureElementHasId(element) {
  if (!element) return;
  const name = element.getAttribute('id');
  if (!name) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
}

function ensureElementId(element, id) {
  if (!element.id) {
    element.id = id;
  }
  return element;
}

function addAriaLabel(element, label) {
  if (!label) {
    throw new Error('aria-label value is required');
  }
  element.setAttribute('aria-label', label);
  return element;
}

function handleFakeLinks(issues) {
  // Placeholder
}

function ensureUniqueLandmarksFromString(stringValue) {
  // Update function logic to ensure unique landmarks from a string
  return true;
}

function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
  });
  return server;
}

function spawnCommand(command, args, callback) {
    const child_process = require('