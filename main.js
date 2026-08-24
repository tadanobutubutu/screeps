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

    // ... existing JSXAttribute function ...

    // New function to check for the absence of a <main> landmark
    function checkForMainLandmark(node) {
      // Assuming this function will be called during JSXElement analysis
      return node.type === 'JSXElement' &&
             node.name.name === 'main' &&
             !node.openingElement.children.some(child => {
               // Assuming we check for JSXText nodes here for simplicity
               // This check would need to be adjusted depending on actual content
               return child.type === 'JSXText' && child.value === '';
             });
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
      JSXElement(path) {
        // Check for the absence of a <main> landmark
        if (!checkForMainLandmark(path.node)) {
          context.report({
            node: path.node,
            message: 'Page has no <main> landmark',
            severity: SEVERITY_WARNING_BOOLEAN_PROP,
            ruleId: 'REACT_017',
          });
        }
      },
    };
  },
};