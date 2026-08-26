/**
 * React Accessibility Rules
 * REACT_015: Ensure html element has lang attribute
 */

const ERROR_MESSAGE = '<html> has no lang attribute';

module.exports = {
  meta: {
    docs: {
      description: 'Enforce lang attribute on html element',
      recommended: true,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name === 'html') {
          const langAttr = node.attributes.find(
            (attr) => attr.type === 'JSXAttribute' && attr.name.name === 'lang'
          );
          
          if (!langAttr) {
            context.report({
              node,
              message: ERROR_MESSAGE,
            });
          }
        }
      },
    };
  },
};