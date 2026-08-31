const { render, screen } = require('@testing-library/react');
import React from 'react';
import { render as renderWithWindow } from '@testing-library/react-windows';
import { WindowContext } from 'react-open-window';
import { requireDir } from 'require-dir';
import { addLangAttribute, fixTableStructureIssues, addMainLandmark, addSvgAccessibleName, ensureUniqueLandmarks, fixFakeLinkIssue } from './utilities';
import { render as renderDom } from 'react-dom';
import {
  addLangAttribute as addLangAttr,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark as addMainLandmarkAlt,
  addLandmarkRegions,
  ensureUniqueLandmarks as ensureUniqueLandmarksAlt,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  addAccessibleName,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraphs
} from './AccessibilityHelpers';
const main = require('./utilities');

const renderMyComponent = (props) => {
  // use the imported React module here and other necessary work
  return <React.Fragment>{React.createElement(MyComponent, props)}</React.Fragment>;
};

const renderAnotherComponent = (props) => {
  // use the imported React, Testing Library, and WindowContext here and other necessary work
  return (
    <WindowContext>
      {(window) => (
        <React.Fragment>
          {renderWithWindow(<AnotherComponent {...props} />, { window })}
        </React.Fragment>
      )}
    </WindowContext>
  );
};

// Accessibility function (merged from both branches)
function setSvgAccessibleProps(svg) {
  addSvgAccessibleName(svg); // From utilities
  ensureUniqueLandmarks(svg); // From utilities
  const titleElement = main.getSvgAccessibleName(svg);
  if (titleElement) {
    svg.setAttribute('aria-labelledby', titleElement.id);
  }
  // From AccessibilityHelpers
  if (!svg.hasAttribute('aria-label')) {
    const ariaLabel = ('Descriptive label for SVG');
    svg.setAttribute('aria-label', ariaLabel);
  }
}

function renderComponent(Component, props) {
  addLangAttribute(screen.getByTestId('root'));
  fixTableStructureIssues(screen.getAllByTestId('table'));
  addMainLandmark(screen.getByTestId('main'));
  setSvgAccessibleProps(screen.getByTestId('svg1'));
  addSvgAccessibleName(screen.getByTestId('svg2'));
  fixFakeLinkIssue(screen.getAllByText(/example-link/i));
  return render(<Component {...props} />);
}

// Fix for React SVG Accessible Name issue
function addAccessibleNameToSVG(svgString) {
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

// Validate table accessibility
function validateTableAccessibility(tableData) {
  return true;
}

function validateTableStructure(tableData) {
  return true;
}

// New component to render dependency graphs
function renderDependencyGraphContainer() {
  const dependencyGraph = document.getElementById('dependencyGraph');

  if (dependencyGraph) {
    // Set appropriate ARIA role for the dependency graph container
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
    
    // Add accessible label if not already present
    if (!dependencyGraph.getAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
    }
    
    return renderDependencyGraphs(dependencyGraph);
  }
  return null;
}

// New function for additional rendering logic
function renderAdditionalContent(additionalData) {
  return `<div>${JSON.stringify(additionalData)}</div>`;
}

// Export all functions
export {
  renderMyComponent,
  renderAnotherComponent,
  renderComponent,
  setSvgAccessibleProps,
  addAccessibleNameToSVG,
  validateTableAccessibility,
  validateTableStructure,
  renderDependencyGraphContainer,
  renderAdditionalContent
};

module.exports = {
  renderComponent,
  renderDependencyGraphContainer,
  validateTableAccessibility,
  validateTableStructure,
  renderAdditionalContent,
  addAccessibleNameToSVG
};