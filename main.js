// REACT_027: React Table Structure - <th> elements must have scope attributes

/**
 * Checks if a JSXAttribute node has a specific string value
 * @param {Object} attr - JSXAttribute node
 * @param {string} value - Expected value
 * @returns {boolean}
 */
function hasAttributeWithValue(attr, value) {
  if (!attr || !attr.value) return false;
  const attrValue = attr.value;
  if (attrValue.type === 'Literal') {
    return attrValue.value === value;
  }
  if (attrValue.type === 'JSXExpressionContainer' && attrValue.expression) {
    if (attrValue.expression.type === 'Literal') {
      return attrValue.expression.value === value;
    }
  }
  return false;
}

/**
 * Determines the appropriate scope value for a th element based on context
 * @param {Object} node - The th element node
 * @param {string} tagName - The parent tag name (thead, tbody, tr, or root)
 * @returns {string|null} - 'col', 'row', or null if undetermined
 */
function determineScope(node, tagName) {
  const scopeAttr = node.attributes.find(
    (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'scope'
  );

  if (scopeAttr) {
    if (hasAttributeWithValue(scopeAttr, 'col')) return 'col';
    if (hasAttributeWithValue(scopeAttr, 'row')) return 'row';
  }

  if (tagName === 'thead') return 'col';
  if (tagName === 'tr') return 'row';

  return null;
}

/**
 * Rule: REACT_027 - React Table Structure
 * Checks that <th> elements have proper scope attributes for accessibility
 * @param {Object} context - ESLint context
 * @returns {Object} - Rule visitor object
 */
function create(context) {
  return {
    JSXElement(node) {
      if (!node.openingElement || !node.openingElement.name) return;
      
      const elementName = node.openingElement.name.name;
      
      if (elementName !== 'th') return;

      const parent = node.parent;
      if (!parent || !parent.openingElement || !parent.openingElement.name) return;

      const parentName = parent.openingElement.name.name;
      let parentTag = null;

      if (parentName === 'thead') {
        parentTag = 'thead';
      } else if (parentName === 'tbody' || parentName === 'tfoot') {
        parentTag = 'tbody';
      } else if (parentName === 'tr') {
        const grandParent = parent.parent;
        if (grandParent && grandParent.openingElement && grandParent.openingElement.name) {
          const grandParentName = grandParent.openingElement.name.name;
          parentTag = (grandParentName === 'thead') ? 'thead' : 'tbody';
        }
      }

      const scopeAttr = node.openingElement.attributes.find(
        (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'scope'
      );

      if (!scopeAttr) {
        const scopeValue = determineScope(node.openingElement, parentTag);
        if (scopeValue) {
          context.report({
            node,
            message: `<th> elements should have a scope attribute (scope="${scopeValue}") for accessibility.`,
            fix(fixer) {
              return fixer.replaceText(
                node.openingElement,
                `<th scope="${scopeValue}">`
              );
            }
          });
        } else {
          context.report({
            node,
            message: `<th> elements should have a scope attribute (scope="col" or scope="row") for accessibility.`
          });
        }
      }
    }
  };
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce proper scope attributes on th elements',
      category: 'Accessibility',
      recommended: true,
    },
    fixable: 'html',
    schema: [],
  },
  create,
  ruleName: 'REACT_027',
  ruleDescription: 'React Table Structure - <th> elements must have scope attributes'
};

// Existing exports that should be preserved
module.exports.default = create;
module.exports.ruleName = 'REACT_027';
module.exports.create = create;