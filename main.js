// Import helper functions for accessibility and focus-trap, react-transition-group modules
const accessibilityHelpers = require('./helpers/accessibility');
const domHelpers = require('./helpers/dom');
const { FocusTrap } = require('focus-trap');
const React = require('react');
const ReactDOM = require('react-dom');

// Address accessibility issues from insight report
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  const dependencyGraph = document.querySelector('[data-dependency-graph]');
  if (dependencyGraph) {
    accessibilityHelpers.setRole(dependencyGraph, 'tree');
    accessibilityHelpers.setAriaLabel(dependencyGraph, 'Dependency Graph');
  }
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  const container = document.getElementById('dependency-graph');
  if (container) {
    container.innerHTML = data;
    // Apply accessibility fixes after rendering content
    addressAccessibilityIssues();
  }
}

// Ensure unique landmarks
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

  // Expose addCustomLandmark so it can be called from implementAccessibilityWithCustomLandmark
  ensureUniqueLandmarks.addCustomLandmark = addCustomLandmark;
}

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

// Add main landmark
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

// Add accessible names to SVGs
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

// New function to implement accessibility fixes with custom landmark addition and focus-trap
function implementAccessibilityWithCustomLandmark(customLandmarkRole = 'banner') {
  addressAccessibilityIssues();
  fixFakeLinks();
  ensureUniqueLandmarks();
  ensureUniqueLandmarks.addCustomLandmark('#intro', customLandmarkRole); // New line
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();

  // Add focus-trap related code
  function focusTrapotonHTMLComponent(element) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.top = 0;
    wrapper.style.left = 0;
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.zIndex = Number.MAX_SAFE_INTEGER;

    const trappedElement = React.createElement(
      'div',
      {
        ref: el => {
          if (el) {
            ReactDOM.render(React.createElement(FocusTrap, { element }), wrapper);
          }
        }
      },
      element
    );

    document.body.appendChild(wrapper);
    ReactDOM.render(trappedElement, wrapper);
  }

  function removeFocusTrap() {
    if (wrapper) {
      wrapper.remove();
      document.body.removeChild(wrapper);
    }
  }

  // Add react-transition-group related code
  const CSSTransition = require('react-transition-group').CSSTransition;

  function renderCSSTransition(element, cb) {
    const wrapper = document.createElement('div');
    ReactDOM.render(
      React.createElement(
        CSSTransition,
        {
          in: true,
          timeout: 300,
          classNames: 'fade',
          onEnter: () => cb && cb(),
          onExit: () => {
            // Remove the node and replace it with a new one to trigger re-rendering
            wrapper.remove();
          }
        },
        element
      ),
      wrapper
    );
    document.body.appendChild(wrapper);
    ReactDOM.flushSync(() => {});
  }

  // Use focus-trap and react-transition-group in existing functions
  function implementAccessibility(component) {
    const wrapper = document.createElement('div');
    wrapper.id = 'accessibility-wrapper';
    document.body.appendChild(wrapper);
    const focusedId = document.activeElement.id || null;

    wrapper.appendChild(component);
    renderCSSTransition(component, () => {
      if (focusedId) {
        const focusedElement = document.getElementById(focusedId);
        if (focusedElement) {
          focusedElement.focus();
        }
      }
      removeFocusTrap();
    });
  }

  // Add new function to implement accessibility with custom landmark and focus-trap
  function implementAccessibilityWithCustomLandmarkFocusTrap(component) {
    focusTrapotonHTMLComponent(component);
    implementAccessibility(component);
  }

  // Expose new functions
  implementAccessibilityWithCustomLandmark.focusTrapotonHTMLComponent =
    focusTrapotonHTMLComponent;
  implementAccessibilityWithCustomLandmark.removeFocusTrap = removeFocusTrap;
  implementAccessibilityWithCustomLandmark.implementAccessibility =
    implementAccessibility;
  implementAccessibilityWithCustomLandmark.implementAccessibilityWithFocusTrap =
    implementAccessibilityWithCustomLandmarkFocusTrap;
}

// New function to call the new function with custom landmark and focus-trap
function applyAccessibilityFixes(component) {
  implementAccessibilityWithCustomLandmark('banner');
  implementAccessibilityWithCustomLandmark.implementAccessibilityWithFocusTrap(component);
}

// Export the module functions
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  implementAccessibilityWithCustomLandmark,
  addressAccessibilityIssues,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  applyAccessibilityFixes,
  implementAccessibility: implementAccessibilityWithCustomLandmark.implementAccessibility,
  implementAccessibilityWithFocusTrap: implementAccessibilityWithCustomLandmark.implementAccessibilityWithFocusTrap,
  focusTrapotonHTMLComponent: implementAccessibilityWithCustomLandmark.focusTrapotonHTMLComponent,
  removeFocusTrap: implementAccessibilityWithCustomLandmark.removeFocusTrap
};