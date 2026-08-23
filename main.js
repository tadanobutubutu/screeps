/**
 * REACT_027 - React Table Structure
 * Enforce scope attribute on table header elements (<th>)
 *
 * Accessibility: Screen readers need to know which headers apply to which cells
 * @see https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html
 */

const RULE_NAME_TABLE = 'REACT_027';
const SEVERITY_WARNING_TABLE = 1; // warning severity

/**
 * REACT_036 - React Fake Link
 * Avoid using <a href="#"> links and use <button> instead if the link does not navigate anywhere
 *
 * Accessibility: Screen readers announce the link as dead, and keyboard users cannot activate it
 * @see https://www.w3.org/WAI/WCAG21/Understanding/2.4.1.html
 */

const RULE_NAME_LINK = 'REACT_036';
const SEVERITY_WARNING_LINK = 1; // warning severity

module.exports = {
  meta: {
    name: RULE_NAME_TABLE,
    type: 'problem',
    docs: {
      description: 'Enforce scope attribute on table header elements (<th>) for accessibility',
      category: 'React Accessibility Rules',
      recommended: true,
    },
    schema: [], // no additional configuration options
  },
  create(context) {
    // ... existing code for REACT_027 ...
  },

  create(context) {
    /**
     * Check if a JSX element is an <a> with a hash-only href
     * @param {Array} nodes - Array of JSX nodes
     * @returns {boolean} - True if the JSX element is an <a> with a hash-only href
     */
    function isHashOnlyLink(nodes) {
      return nodes.some(
        (node) =>
          node.type === 'JSXElement' &&
          node.openingElement.name.name === 'a' &&
          node.openingElement.attributes.some(
            (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'href' && attr.value.value.startsWith('#')
          )
      );
    }

    return {
      JSXElement(node) {
        if (isHashOnlyLink(node.children)) {
          context.report({
            node,
            message: `Replace <a href="#"> with <button> for proper screen reader and keyboard navigation`,
            severity: SEVERITY_WARNING_LINK,
            ruleId: RULE_NAME_LINK,
          });
        }
      },
    };
  },
};