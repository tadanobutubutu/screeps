const accessibilityHelpers = require('./helpers/accessibility');
const domHelpers = require('./helpers/dom');
const { FocusTrap } = require('focus-trap');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactTransitionGroup = require('react-transition-group');

const existingFunction = function() {
  return 'existing function result';
};

const anotherFunction = function(input) {
  return input ? input.toUpperCase() : '';
};

function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  const dependencyGraph = document.querySelector('[data-dependency-graph]');
  if (dependencyGraph) {
    accessibilityHelpers.setRole(dependencyGraph, 'tree');
    accessibilityHelpers.setAriaLabel(dependencyGraph, 'Dependency Graph');
  }

  function renderDependencyGraphContent(data) {
    // Replace the existing content within the dependencyGraph div using the provided data.
    const container = document.getElementById('dependency-graph');
    if (container) {
      container.innerHTML = data;
      // Apply accessibility fixes after rendering content
      addressAccessibilityIssues();
    }
  }

  function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role]');
    const seen = new Set();
    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (seen.has(role)) {
        accessibilityHelpers.makeUnique(landmark, role);
      } else {
        seen.add(role);
      }
    });

    // New method to add custom landmarks
    function addCustomLandmark(elementId, landmarkRole) {
      const element = document.getElementById(elementId);
      if (element) {
        accessibilityHelpers.setRole(element, landmarkRole);
      }
    }

    // Extend to handle specific layout elements from origin/main
    function extendEnsureUniqueLandmarks() {
      const layoutLandmarks = document.querySelectorAll('header, footer, main, nav, aside');
      layoutLandmarks.forEach(landmark => {
        const tag = landmark.tagName.toLowerCase();
        if (!tag) return;
        
        const counts = {};
        let count = 0;
        layoutLandmarks.forEach(l => {
          if (l.tagName.toLowerCase() === tag) count++;
        });
        
        if (count > 1) {
          const role = landmark.getAttribute('role') || tag;
          if (!landmark.id) {
            landmark.id = `${role}-${count}`;
          }
          landmark.setAttribute('aria-label', `${role} ${count}`);
        }
      });
    }

    extendEnsureUniqueLandmarks();
  }

  function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach(link => {
      accessibilityHelpers.setRole(link, 'button');
      accessibilityHelpers.setTabIndex(link, '0');
      if (!link.textContent.trim()) {
        accessibilityHelpers.setAriaLabel(link, 'Button');
      }
    });
  }

  function addLangAttribute() {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.lang) {
      accessibilityHelpers.setLang(htmlElement, 'en');
    }
  }

  function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // Ensure tables have proper structure
      if (!table.querySelector('thead')) {
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          const thead = document.createElement('thead');
          const tbody = table.querySelector('tbody');
          thead.appendChild(firstRow);
          table.insertBefore(thead, tbody || firstRow);
        }
      }
      
      // Ensure tables have at least one tbody
      if (!table.querySelector('tbody')) {
        const rows = Array.from(table.querySelectorAll('tr'));
        if (rows.length > 0) {
          const tbody = document.createElement('tbody');
          rows.forEach(row => tbody.appendChild(row));
          table.appendChild(tbody);
        }
      }
    });
  }

  function addMainLandmark() {
    const mainElements = document.querySelectorAll('main');
    mainElements.forEach(main => {
      if (!main.getAttribute('role')) {
        accessibilityHelpers.setRole(main, 'main');
      }
    });
    // If no main element exists, create one for the main content
    if (mainElements.length === 0) {
      const content = document.querySelector('#content');
      if (content) {
        const main = document.createElement('main');
        accessibilityHelpers.setRole(main, 'main');
        while (content.firstChild) {
          main.appendChild(content.firstChild);
        }
        content.appendChild(main);
      }
    }
  }

  function addSvgAccessibleNames() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = `svg-title-${index + 1}`;
        title.setAttribute('id', titleId);
        accessibilityHelpers.setAriaLabelledBy(svg, titleId);
      } else {
        console.log(`SVG graphic ${index + 1} lacks a title element`);
      }
    });
  }

  return {
    addFocusTrap,
    removeFocusTrap,
    renderCSSTransition,
    implementAccessibility,
    applyAccessibilityFixes
  };
}

// Expose addCustomLandmark so it can be called from implementAccessibilityWithCustomLandmark
ensureUniqueLandmarks.addCustomLandmark = addCustomLandmark;

// Fix fake link issue
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    accessibilityHelpers.setRole(link, 'button');
    accessibilityHelpers.setTabIndex(link, '0');
    if (!link.textContent.trim()) {
      accessibilityHelpers.setAriaLabel(link, 'Button');
    }
  });
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    accessibilityHelpers.setLang(htmlElement, 'en');
  }
}

// Fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || firstRow);
      }
    }
    
    // Ensure tables