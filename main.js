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
 * Checks if an SVG element has an accessible name
 * @param {Object} node - The JSXElement node for svg
 * @returns {Object} - { hasAccessibleName: boolean, ariaHidden: boolean, suggestion: string }
 */
function checkSVGAccessibleName(node) {
  const attributes = node.openingElement.attributes;
  
  // Check for aria-hidden="true"
  const ariaHiddenAttr = attributes.find(
    (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'aria-hidden'
  );
  if (ariaHiddenAttr && hasAttributeWithValue(ariaHiddenAttr, 'true')) {
    return { hasAccessibleName: true, ariaHidden: true, suggestion: 'aria-hidden="true"' };
  }

  // Check for aria-label attribute
  const ariaLabelAttr = attributes.find(
    (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'aria-label'
  );
  if (ariaLabelAttr && ariaLabelAttr.value) {
    return { hasAccessibleName: true, ariaHidden: false, suggestion: 'aria-label' };
  }

  // Check for <title> child element
  const hasTitleChild = node.children && node.children.some(
    (child) => child.type === 'JSXElement' && 
              child.openingElement && 
              child.openingElement.name && 
              child.openingElement.name.name === 'title'
  );
  if (hasTitleChild) {
    return { hasAccessibleName: true, ariaHidden: false, suggestion: '<title> child element' };
  }

  // Check for role attribute that provides semantic meaning
  const roleAttr = attributes.find(
    (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'role'
  );
  if (roleAttr && roleAttr.value) {
    return { hasAccessibleName: true, ariaHidden: false, suggestion: 'role attribute with aria-label' };
  }

  return { hasAccessibleName: false, ariaHidden: false, suggestion: null };
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

/**
 * Rule: REACT_041 - React SVG Accessible Name
 * Checks that <svg> elements have accessible names for screen readers
 * @param {Object} context - ESLint context
 * @returns {Object} - Rule visitor object
 */
function createReact041(context) {
  return {
    JSXElement(node) {
      if (!node.openingElement || !node.openingElement.name) return;
      
      const elementName = node.openingElement.name.name;
      
      // Only check <svg> elements
      if (elementName !== 'svg') return;

      // Check if SVG is hidden from accessibility tree
      const attributes = node.openingElement.attributes;
      const hiddenAttr = attributes.find(
        (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'hidden'
      );
      const ariaHiddenAttr = attributes.find(
        (attr) => attr.type === 'JSXAttribute' && attr.name && attr.name.name === 'aria-hidden'
      );
      
      // Skip if the SVG itself is hidden from screen readers
      if (hiddenAttr && hasAttributeWithValue(hiddenAttr, true)) return;
      if (ariaHiddenAttr && hasAttributeWithValue(ariaHiddenAttr, 'true')) return;

      // Check for accessible name
      const result = checkSVGAccessibleName(node);

      if (!result.hasAccessibleName) {
        context.report({
          node,
          message: `<svg> has no accessible name and is not hidden. Add aria-label, a <title> child, or aria-hidden="true" if decorative.`,
          fix(fixer) {
            // Find the closing > of the opening tag to insert aria-hidden
            const openingElement = node.openingElement;
            const sourceCode = context.getSourceCode();
            const openingElementText = sourceCode.getText(openingElement);
            
            // Check if the SVG already has children and try to add title
            const hasTitleChild = node.children && node.children.some(
              (child) => child.type === 'JSXElement' && 
                        child.openingElement && 
                        child.openingElement.name && 
                        child.openingElement.name.name === 'title'
            );

            if (!hasTitleChild) {
              // Insert aria-hidden="true" before the closing >
              const closingBracket = openingElementText.lastIndexOf('>');
              if (closingBracket !== -1) {
                const beforeClosing = openingElementText.substring(0, closingBracket);
                const afterClosing = openingElementText.substring(closingBracket);
                return fixer.replaceText(
                  openingElement,
                  beforeClosing + ' aria-hidden="true"' + afterClosing
                );
              }
            }
            return null;
          }
        });
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

// New rule exports
module.exports.REACT_041 = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce accessible names on SVG elements',
      category: 'Accessibility',
      recommended: true,
    },
    fixable: 'html',
    schema: [],
  },
  create: createReact041,
  ruleName: 'REACT_041',
  ruleDescription: 'React SVG Accessible Name - <svg> must have accessible name'
};

// Export create function for REACT_041
module.exports.createReact041 = createReact041;