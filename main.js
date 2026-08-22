// ESLint-like rule for REACT_015: React Language Attribute

module.exports = {
  meta: {
    name: 'react-lang-attribute',
    version: '1.0.0',
    docs: {
      description: "Enforce lang attribute on <html> element for screen reader accessibility",
      category: 'Accessibility',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingLang: '<html> has no lang attribute. Add lang="en" (or the document language) so screen readers pick the right voice.',
    },
  },

  create(context) {
    return {
      JSXElement(node) {
        const openingElement = node.openingElement;
        
        // Only check <html> elements
        if (
          openingElement &&
          openingElement.name &&
          openingElement.name.name === 'html'
        ) {
          // Check if lang attribute exists
          const hasLangAttribute = openingElement.attributes.some(
            (attr) =>
              attr.type === 'JSXAttribute' &&
              attr.name &&
              attr.name.name === 'lang'
          );

          if (!hasLangAttribute) {
            context.report({
              node: openingElement,
              messageId: 'missingLang',
              data: {
                element: 'html',
              },
            });
          }
        }
      },
    };
  },
};

// Example usage in an ESLint config:
// module.exports = {
//   rules: {
//     'react-lang-attribute': require('./main'),
//   },
// };