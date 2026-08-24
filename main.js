// ... existing code for REACT_027 ...

// REACT_027 - React Table Structure
// Ensure <th> elements have a scope attribute to improve accessibility
// Accessibility: improves the accessibility of tables for assistive technologies
// @see https://html.spec.whatwg.org/multipage/tables.html#th-element

const RULE_NAME_TABLE_STRUCTURE = 'REACT_027';
const SEVERITY_WARNING_TABLE_STRUCTURE = 1; // warning severity

module.exports = {
  // ... existing code for REACT_027 and REACT_036 ...

  JSXOpeningElement(node) {
    if (node.name.name === 'th') {
      const hasScopeAttribute = node.attributes.some(attr =>
        attr.name.name === 'scope'
      );
      if (!hasScopeAttribute) {
        context.report({
          node,
          message: '<th> elements must have a scope attribute to improve accessibility',
          severity: SEVERITY_WARNING_TABLE_STRUCTURE,
          ruleId: RULE_NAME_TABLE_STRUCTURE,
        });
      }
    }
  },
};