// ... existing code for REACT_027 ...

// REACT_036 - React Fake Link
// Check for <a> tags with href="#" or similar that don't navigate
//
// Accessibility: ensures screen readers and keyboard users can properly interact with links
// @see https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html

const RULE_NAME_FAKE_LINK = 'REACT_036';
const SEVERITY_WARNING_FAKE_LINK = 1; // warning severity

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
    function isBooleanPropWithoutDefault(node) {
      return node.type === 'JSXAttribute' &&
             node.name.name === 'is' &&
             !node.value.type;
    }

    // Function to check if an anchor href is a "fake link" (doesn't navigate)
    function isFakeLinkHref(node) {
      if (node.type !== 'JSXAttribute' || node.name.name !== 'href') {
        return false;
      }
      
      if (!node.value || node.value.type !== 'Literal') {
        return false;
      }
      
      const hrefValue = node.value.value;
      // Check for hash-only (#), empty string, or javascript:void(0)
      return hrefValue === '#' || hrefValue === '' || hrefValue === 'javascript:void(0)';
    }

    return {
      JSXAttribute(node) {
        // Check for REACT_036 - Fake Link
        if (isFakeLinkHref(node)) {
          context.report({
            node,
            message: `Use a <button> for in-page actions so keyboard and screen reader behaviour is right. Avoid <a href="#">, <a href="">, or <a href="javascript:void(0)">`,
            severity: SEVERITY_WARNING_FAKE_LINK,
            ruleId: RULE_NAME_FAKE_LINK,
          });
        }

        // Check for REACT_037 - Boolean Prop without default
        if (isBooleanPropWithoutDefault(node)) {
          context.report({
            node,
            message: `Add a default value for the boolean prop 'is' to improve maintainability and avoid errors`,
            severity: SEVERITY_WARNING_BOOLEAN_PROP,
            ruleId: RULE_NAME_BOOLEAN_PROP,
          });
        }
      },
    };
  },
};