// main.js - ESLint rule implementation for REACT_027

/**
 * Rule: REACT_027 - React Table Structure
 * Ensures <th> elements have proper scope attributes for accessibility
 */

const MISSING_SCOPE = 'scope="col" or scope="row"';
const MISSING_SCOPE_MSG = `<th> elements must have a scope attribute (scope="col" or scope="row") for accessibility. Current: <th ...>`;

module.exports = {
  meta: {
    name: 'react-table-structure',
    version: '1.0.0',
    recommended: true
  },
  create: function(context) {
    return {
      JSXOpeningElement: function(node) {
        if (node.name && node.name.name === 'th') {
          const attributes = node.attributes || [];
          let hasScope = false;
          
          attributes.forEach(attr => {
            if (attr.name && attr.name.name === 'scope') {
              hasScope = true;
            }
          });
          
          if (!hasScope) {
            context.report({
              node,
              message: MISSING_SCOPE_MSG,
              fix: function(fixer) {
                return fixer.insertTextAfterRange(
                  [node.range[0], node.range[0] + 4], // After '<th'
                  ' scope="col"'
                );
              }
            });
          }
        }
      }
    };
  }
};