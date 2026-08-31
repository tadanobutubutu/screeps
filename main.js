import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import { loadLandmarks, processLandmarks, sortLandmarks, getLandmarkById, ensureUniqueLandmarks } from './utils/landmarkUtils';

const fs = require('fs');
const path = require('path');

function visualizeDependencyTree(dependencies) {
  const report = generateDependencyReport(dependencies);
  console.log(report.graph);
}

function fixAccessibilityIssues() {
  // Code to fix accessibility issues as per the insight report
  replaceFakeLinks();
  ensureThScope();
  addSvgAccessibleNames();
  renderGraph();
  renderIndex();
}

function getDependencies() {
  const dependencies = loadLandmarks();
  return dependencies;
}

function renderIndexView() {
  const container = document.createElement('div');
  container.id = 'index-view';
  container.className = 'index-view';
  container.setAttribute('role', 'main');
  container.setAttribute('aria-label', 'Dependency Visualization Tool Index');

  const header = document.createElement('header');
  const title = document.createElement('h1');
  title.textContent = 'Dependency Visualization Tool';
  header.appendChild(title);
  container.appendChild(header);

  const description = document.createElement('p');
  description.className = 'description';
  description.textContent = 'Analyze and visualize your project dependencies with accessibility support.';
  container.appendChild(description);

  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'actions';

  const visualizeButton = document.createElement('button');
  visualizeButton.id = 'visualize-dependencies-btn';
  visualizeButton.setAttribute('role', 'button');
  visualizeButton.setAttribute('aria-label', 'Visualize project dependencies');
  visualizeButton.textContent = 'Visualize Dependencies';
  visualizeButton.onclick = () => {
    const dependencies = getDependencies();
    visualizeDependencyTree(dependencies);
  };
  actionsContainer.appendChild(visualizeButton);

  const accessibilityButton = document.createElement('button');
  accessibilityButton.id = 'check-accessibility-btn';
  accessibilityButton.setAttribute('role', 'button');
  accessibilityButton.setAttribute('aria-label', 'Check and address accessibility issues');
  accessibilityButton.textContent = 'Check Accessibility';
  accessibilityButton.onclick = () => {
    fixAccessibilityIssues();
  };
  actionsContainer.appendChild(accessibilityButton);

  container.appendChild(actionsContainer);

  return container;
}

export const main = {
  init: function() {
    console.log('Application initialized');
  },

  greet: function(name) {
    return `Hello, ${name}!`;
  },

  renderIndexView: function() {
    return renderIndexView();
  },

  rotateBack: function() {
    console.log('Reverting back the rotation.');
  },

  addressAccessibilityIssues: function() {
    fixAccessibilityIssues();
  },
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks
};

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
}

function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Other existing code below