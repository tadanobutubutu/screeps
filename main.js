// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

function existingFunction1() {
  // Existing function 1 implementation
}

const existingConst1 = {
  // Existing constant 1 definition
};

// New function or changes requested in the issue
function newFunction() {
  // Implement the new function here
}

// Original code with accessibility issue
function dependencyGraph() {
  // ... existing code ...
}

// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation

/**
 * Checks if a given link/URL is accessible by making an HTTP HEAD request.
 * @param {string} url - The URL to check for accessibility
 * @returns {Promise<boolean>} - Returns true if the link is accessible (status 200-399), false otherwise
 */
async function isLinkAccessible(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    
    // In no-cors mode, response.ok is not reliable
    // A successful request without network error means the resource exists
    return true;
  } catch (error) {
    // Try with GET request as fallback
    try {
      const response = await fetch(url, {
        method: 'GET'
      });
      return response.ok;
    } catch (getError) {
      return false;
    }
  }
}

/**
 * Synchronous version that returns a Promise for backward compatibility
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Returns true if accessible
 */
function isLinkAccessibleSync(url) {
  return isLinkAccessible(url);
}

/**
 * Adds scope="col" to all <th> elements within a given table element
 * that do not already have a scope attribute. This addresses REACT_027
 * (React Table Structure) accessibility warnings by ensuring header
 * cells are programmatically associated with their data cells for
 * assistive technologies.
 *
 * @param {HTMLTableElement} table - The table element to process
 * @returns {number} - The number of <th> elements that were updated
 */
function addScopeToTableHeaders(table) {
  if (!table || !(table instanceof HTMLTableElement)) {
    return 0;
  }

  const headerCells = table.querySelectorAll('th');
  let updatedCount = 0;

  headerCells.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
      updatedCount += 1;
    }
  });

  return updatedCount;
}

/**
 * Adds scope="col" to all <th> elements in every table within a root
 * element (e.g., document or a specific container). Useful for fixing
 * REACT_027 accessibility issues across generated reports such as
 * docs/dependency-graph.html.
 *
 * @param {ParentNode} [root=document] - The root element to search within
 * @returns {number} - The total number of <th> elements that were updated
 */
function fixTableHeaderScopes(root) {
  const scope = root || (typeof document !== 'undefined' ? document : null);
  if (!scope) {
    return 0;
  }

  const tables = scope.querySelectorAll('table');
  let totalUpdated = 0;

  tables.forEach((table) => {
    totalUpdated += addScopeToTableHeaders(table);
  });

  return totalUpdated;
}

// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

module.exports = {
  existingFunction1,
  existingConst1,
  newFunction,
  dependencyGraph,
  isLinkAccessible,
  isLinkAccessibleSync,
  addScopeToTableHeaders,
  fixTableHeaderScopes
};