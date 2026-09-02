// main.js - Accessibility-focused implementation

// Address accessibility issues from insight report
// Ensure the dependencyGraph container has a proper ARIA role

const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  port: PORT,
  env: process.env.NODE_ENV || 'development'
};

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function addLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang);
  } else {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
}

function validateLandmark(element) {
  return AddressabilityIssues.validateLandmark(element);
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

function ensureElementHasId(element) {
  if (!element) return;
  
  const name = element.getAttribute('id');
  if (!name) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
}

const AddressabilityIssues = {
  addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }
    
    const issues = [];
    
    insightReport.sections.forEach((section, index) => {
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

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

  addressAccessibilityIssues(sections) {
    if (!sections) return [];
    
    const issues = [];
    
    sections.sections.forEach((section, index) => {
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

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

  countDependencies(packageJson) {
    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
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
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];

    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (!role || !landmarkRoles.includes(role)) {
        landmark.removeAttribute('role');
      }
    });

    return true;
  },

  // ... (other functions and classes from both branches)
};

function renderDependencyGraph(graphData, container) {
  // Ensure ARIA role for the dependencyGraph container
  if (container.hasAttribute('role')) {
    if (container.getAttribute('role') !== 'grid') {
      container.setAttribute('role', 'grid');
    }
  } else {
    container.setAttribute('role', 'grid');
  }

  // Render the dependency graph into the container
  addAriaLabel(container, 'Dependency graph');
  const graph = document.createElement('div');
  graph.className = 'dependency-graph';
  graph.textContent = JSON.stringify(graphData, null, 2);
  container.appendChild(graph);

  return graph;
}

function processSvgElements() {
  const svgElements = document.querySelectorAll('svg');
}

function validateLandmarkAttributes(landmark) {
  const issues = [];

  if (!landmark.ariaLabel && !landmark.ariaLabelledby && !landmark.textContent) {
    issues.push('Landmark missing accessible name');
  }

  if (landmark.role && !['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(landmark.role)) {
    issues.push(`Invalid landmark role: ${landmark.role}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

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
    const rowCells = row.querySelectorAll('th, td');
    if (rowCells.length !== cellCount && index > 0) {
      row.setAttribute('role', 'row');
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell, cellIndex) => {
        cell.setAttribute('role', cellIndex === 0 ? 'rowheader' : 'cell');
      });
    }
  });
  
  return { valid: true, error: null };
}

function validateLinkAccessibility(link) {
  const issues = [];

  if (!link.href) {
    issues.push('Link missing href attribute');
  }

  if (!link.textContent && !link.ariaLabel) {
    issues.push('Link missing accessible name');
  }

  return {
    success: issues.length === 0,
    issues
  };
}

function handleFakeLinks(issues) {
  if (!issues || !Array.isArray(issues)) {
    return;
  }
  
  issues.forEach(issue => {
    if (issue.type === 'fake') {
      const fakeLinks = document.querySelectorAll('a[href="#"]');
      fakeLinks.forEach(link => {
        console.warn(`Fake link detected: ${issue.message}`);
      });
    }
  });
}

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

function newFunction() {
  console.log('New function called');
}

function checkLandmarkElements(response) {
  return response.includes('landmark');
}

function handleCredentialResponse(response) {
  return response;
}

function addBook(bookData) {
  return bookData;
}

function generateAccessibilityReport() {
  return {
    timestamp: new Date().toISOString(),
    issues: []
  };
}

function addressAccessibilityIssues(insightReport) {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', getLangAttribute());
  }
}

function initializeAccessibility() {
  if (!document.querySelectorAll) return;
  addressAccessibilityIssues(sampleInsightReport);
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

function generateUniqueId(landmark) {
  let uniqueId = landmark;
  let counter = 0;
  while (document.getElementById(uniqueId)) {
    uniqueId = `${landmark}-${counter++}`;
  }
  return uniqueId;
}

function ensureUniqueIds() {
  const landmarks = document.querySelectorAll('[role="landmark"]');
  landmarks.forEach(landmark => {
    if (!landmark.id) {
      landmark.id = generateUniqueId(landmark.textContent);
    }
  });
}

function setDependencyGraphRole() {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'application');
  }
}

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

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

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  return svgElement.getAttribute('aria-label') || svgElement.getAttribute('aria-labelledby') || '';
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

function createServer() {
  return http.createServer(app);
}

function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    setDependencyGraphRole();
    ensureUniqueIds();
    setARIARoleForDependencyGraph();
    newFunction();
  });
  return server;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createServer,
    startApp,
    config,
    validateLandmark,
    generateUniqueId,
    ensureUniqueIds,
    setDependencyGraphRole,
    countDependencies: AddressabilityIssues.countDependencies,
    checkLandmarkElements,
    sampleInsightReport,
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraph,
    getLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkElement,
    validateLandmarkStructure,
    getSvgAccessibleName,
    addSvgAccessibleName,
    ensureUniqueLandmarks,
    personName,
    createInPageButton,
    newFunction,
    setARIARoleForDependencyGraph,
    AddressabilityIssues,
    fixMainLandmarkIssues: AddressabilityIssues.fixMainLandmarkIssues,
    fixSemanticMarkup: AddressabilityIssues.fixSemanticMarkup,
    validateLandmarkStructure: AddressabilityIssues.validateLandmarkStructure,
    addLangAttribute: AddressabilityIssues.addLangAttribute,
    generateAccessibilityReport,
    handleFakeLinks,
    handleCredentialResponse,
    addBook,
    addressAccessibilityIssues,
    initializeAccessibility
  };
} else {