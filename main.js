const fs = require('fs');
const path = require('path');
const http = require('http');

function addSvgAccessibilityProps() {
  const addSvgProps = require('./accessibility').addSvgAccessibilityProps;
  const addAriaRole = require('./accessibility').setARIARoleForDependencyGraph;
  const wrapPrimaryContentInMain = require('./accessibility').wrapPrimaryContentInMain;

  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    addAriaRole(svg);
  });

  wrapPrimaryContentInMain();
}

function getSvgAccessibleName(svg) {
  return require('./accessibility').getSvgAccessibleName(svg);
}

function createInPageButton(options) {
  return require('./accessibility').createInPageButton(options);
}

function countDependencies() {
  return require('./accessibility').countDependencies();
}

function getLangAttribute() {
  return require('./accessibility').getLangAttribute();
}

function validateLinkAccessibility() {
  return require('./accessibility').validateLinkAccessibility();
}

function handleFakeLinks(link) {
  return require('./accessibility').handleFakeLinks(link);
}

function wrapPrimaryContentInMain() {
  return require('./accessibility').wrapPrimaryContentInMain();
}

// Add back any required exports that might have been removed
module.exports = {
  addSvgAccessibilityProps,
  getSvgAccessibleName,
  createInPageButton,
  countDependencies,
  getLangAttribute,
  validateLinkAccessibility,
  handleFakeLinks,
  wrapPrimaryContentInMain
};