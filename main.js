// ... existing code for REACT_027 ...

// REACT_037 - React Boolean Prop Check
// Check if boolean props have a declared default value
// Improve maintainability and avoid errors
//
// Accessibility: has no direct impact, but improves component maintainability
// @see https://reactjs.org/docs/DOM-elements.html#bool-attribute-syntax

const RULE_NAME_BOOLEAN_PROP = 'REACT_037';
const SEVERITY_WARNING_BOOLEAN_PROP = 1; // warning severity

module.exports = {
  // ... existing code for REACT_027 and REACT_036 ...

  create(context) {
    // Function to check if a JSX attribute is a boolean prop with no default value
    function isBooleanPropMissingDefaultValue(node) {
      return node.type === 'JSXAttribute' &&
             node.name.name === 'is' &&
             !node.value.type;
    }

    // New function to check for the lang attribute in the HTML tag
    function checkLangAttribute(node) {
      return node.type === 'JSXOpeningElement' &&
             node.name.name === 'html' &&
             !node.attributes.some(attr => attr.name.name === 'lang');
    }

    return {
      JSXAttribute(node) {
        if (isBooleanPropMissingDefaultValue(node)) {
          context.report({
            node,
            message: `Add a default value for the boolean prop 'is' to improve maintainability and avoid errors`,
            severity: SEVERITY_WARNING_BOOLEAN_PROP,
            ruleId: RULE_NAME_BOOLEAN_PROP,
          });
        }
      },
      JSXOpeningElement(node) {
        if (checkLangAttribute(node)) {
          context.report({
            node,
            message: '<html> has no lang attribute',
            severity: 'critical',
            ruleId: 'REACT_015',
          });
        }
      },
    };
  },
};