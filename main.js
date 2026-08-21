/**
 * React Accessibility Rules
 * Enforces accessibility best practices in React components
 */

const { astHasJSX } = require('../helpers/ast');
const { getAttr, hasAttr, attrValue } = require('../helpers/attributes');
const { isFromReactPackage } = require('../helpers/packages');
const { isJSXElement } = require('../helpers/jsx');
const { isTag } = require('../helpers/tags');

/**
 * Rule: REACT_027 - React Table Structure
 * Ensures all <th> elements have proper scope attributes for accessibility
 */
function REACT_027(node, config) {
  // Check if this is a <th> element
  if (!isJSXElement(node) || !isTag(node, 'th')) {
    return [];
  }

  const errors = [];

  // Check if scope attribute exists
  if (!hasAttr(node, 'scope')) {
    errors.push({
      ruleId: 'REACT_027',
      message: 'React Table Structure: <th> has no scope',
      line: node.loc.start.line,
      column: node.loc.start.column,
      severity: config.severity,
    });
  }

  return errors;
}

/**
 * Get severity from config or default to warning
 */
function getSeverity(config) {
  if (config && config.severity) {
    return config.severity;
  }
  return 2; // warning
}

module.exports = {
  REACT_027,
  getSeverity,
};