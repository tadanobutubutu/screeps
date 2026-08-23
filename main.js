// TODO: Address accessibility issues from insight report:

/**
 * Accessibility utilities for game UI
 */

/**
 * Makes text screen reader friendly
 * @param {string} text - The text to make accessible
 * @returns {string} Accessible text
 */
function makeAccessible(text) {
  if (!text) return '';
  // Replace special characters with spoken equivalents
  return text
    .replace(/[<>]/g, function(match) {
      return match === '<' ? ' less than ' : ' greater than ';
    })
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates ARIA-compatible descriptions for game entities
 * @param {object} entity - Game entity with name and type
 * @returns {string} Accessible description
 */
function getAccessibleDescription(entity) {
  if (!entity || !entity.name) return 'Unnamed entity';
  
  const type = entity.type || 'object';
  const health = entity.hits !== undefined ? `, health ${entity.hits}` : '';
  return `${type} named ${entity.name}${health}`;
}

/**
 * Creates keyboard-navigable menu structure
 * @param {Array} items - Menu items
 * @returns {Array} Items with accessibility metadata
 */
function createAccessibleMenu(items) {
  return items.map((item, index) => ({
    ...item,
    ariaPosition: index + 1,
    ariaLabel: item.label || item.name || `Menu item ${index + 1}`
  }));
}

// Export functions for accessibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    makeAccessible,
    getAccessibleDescription,
    createAccessibleMenu
  };
}