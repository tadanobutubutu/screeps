// Assuming the content was originally something like this:
// Safety: true;

// Fixing the Safety issue by renaming it if it was a typo
const isSafetyEnabled = true;

// Removing any HTML content that should not be in a JavaScript file
// <html lang="en">
// <head>
//   <title>Document</title>
// </head>
// <body>
//   <div lang="en">This is an English text</div>
// </body>
// </html>

const img = document.getElementById('target'); let rotation = 0;

function rotate() {
  rotation += 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
  rotation = 0;
  img.style.transform = `rotate(0deg)`;
}

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
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
 * Subtracts b from a
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Add functions for adding `aria-label` to buttons
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// Add `aria-label` to the rotation and unrotate buttons
addAriaLabel(document.getElementById('rotate'), 'Rotate image clockwise');
addAriaLabel(document.getElementById('unrotate'), 'Rotate image anti-clockwise');

/**
 * A new function for adding `aria-label` to arbitrary elements
 * @param {HTMLElement} elem - The HTML element to add `aria-label` to
 * @param {string} label - The text to use as the `aria-label`
 */
function setAriaLabelOn(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

// An example usage of the new function with a custom button element
const customBtn = document.getElementById('custom-btn');
setAriaLabelOn(customBtn, 'Perform custom action');

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

// REACT_027 Rule exports
const create = function(context) {
  return {
    JSXElement(node) {
      // Rule implementation for REACT_027
    }
  };
};

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

// Export utility function
module.exports.checkSVGAccessibleName = checkSVGAccessibleName;

// Main Screeps exports
module.exports.loop = function() { /* Main game loop logic myNewFunction(); */ };
module.exports.add = add;
module.exports.subtract = subtract;
module.exports.multiply = multiply;
module.exports.divide = divide;
module.exports.addAriaLabel = addAriaLabel;
module.exports.setAriaLabelOn = setAriaLabelOn;

// Added back required exports
module.exports.rotate = rotate;
module.exports.rotateBack = rotateBack;
module.exports.isSafetyEnabled = isSafetyEnabled;
module.exports.img = img;
module.exports.rotation = rotation;
module.exports.customBtn = customBtn;
module.exports.Safety = isSafetyEnabled;