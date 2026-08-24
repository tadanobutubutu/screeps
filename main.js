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

    // ... existing code for other rules ...

    // New function to check for multiple <main> elements
    function checkMultipleMainElements(node) {
      if (node.type === 'JSXElement' && node.name.name === 'main') {
        context.report({
          node,
          message: 'Keep a single <main>; use <section> or <article> for the other regions',
          severity: 1, // warning severity
          ruleId: 'REACT_025',
        });
      }
    }

    return {
      JSXElement(node) {
        if (node.openingElement.name.name === 'main') {
          checkMultipleMainElements(node);
        }
      },
    };
  },
};