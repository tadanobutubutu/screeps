/**
 * REACT_027 - React Table Structure
 * Enforce scope attribute on table header elements (<th>)
 * 
 * Accessibility: Screen readers need to know which headers apply to which cells
 * @see https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html
 */

const RULE_NAME = 'REACT_027';
const SEVERITY_WARNING = 1; // warning severity

module.exports = {
  meta: {
    name: RULE_NAME,
    type: 'problem',
    docs: {
      description: 'Enforce scope attribute on table header elements (<th>) for accessibility',
      category: 'React Accessibility Rules',
      recommended: true,
    },
    schema: [], // no additional configuration options
  },
  create(context) {
    /**
     * Check if a JSX attribute exists by name
     * @param {Array} attributes - Array of JSX attributes
     * @param {string} name - Attribute name to find
     * @returns {boolean}
     */
    function hasAttribute(attributes, name) {
      return attributes.some(
        (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === name
      );
    }

    /**
     * Get the value of a JSX attribute
     * @param {Array} attributes - Array of JSX attributes
     * @param {string} name - Attribute name to find
     * @returns {string|null} - The attribute value or null
     */
    function getAttributeValue(attributes, name) {
      const attr = attributes.find(
        (a) => a.type === 'JSXAttribute' && a.name && a.name.name === name
      );
      if (!attr || !attr.value) return null;
      
      // Handle {`value`} dynamic values vs "string" literals
      if (attr.value.type === 'Literal') {
        return attr.value.value;
      }
      if (attr.value.type === 'JSXExpressionContainer' && attr.value.expression) {
        if (attr.value.expression.type === 'Literal') {
          return attr.value.expression.value;
        }
      }
      return null;
    }

    /**
     * Validate scope attribute value
     * @param {string|null} value - The scope attribute value
     * @returns {boolean} - True if valid
     */
    function isValidScopeValue(value) {
      return value === 'col' || value === 'row' || value === 'colgroup' || value === 'rowgroup';
    }

    return {
      JSXOpeningElement(node) {
        // Only check <th> elements
        if (!node.name || node.name.name !== 'th') {
          return;
        }

        const attributes = node.attributes || [];

        // Check if scope attribute exists
        if (!hasAttribute(attributes, 'scope')) {
          context.report({
            node,
            message: `<th> has no scope. Add scope="col" or scope="row" so cells map to their headers.`,
            severity: SEVERITY_WARNING,
            ruleId: RULE_NAME,
          });
          return;
        }

        // Check if scope has a valid value
        const scopeValue = getAttributeValue(attributes, 'scope');
        if (scopeValue !== null && !isValidScopeValue(scopeValue)) {
          context.report({
            node,
            message: `Invalid scope value "${scopeValue}". Use scope="col", scope="row", scope="colgroup", or scope="rowgroup".`,
            severity: SEVERITY_WARNING,
            ruleId: RULE_NAME,
          });
        }
      },
    };
  },
};