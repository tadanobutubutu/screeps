// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Preserve existing functionality

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// main.js - Accessibility improvements implementation
// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 6);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.documentElement;
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (element && !element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the language attribute from the HTML element.
 * @returns {string} - the language attribute value
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

// ... existing functions from both branches

// Accessibility helper functions
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  return function(event) {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  };
}

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', function(event) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: b8ad7986d07c9a084d54347d2b890045530741c8_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

/**
 * Extracts TODO comments with their associated commit hashes and todo-hashes from the source code.
 * This function scans the main.js content for TODO comments that have commit and todo-hash markers.
 * @param {string} sourceCode - The source code content to scan.
 * @returns {Array<Object>} Array of objects containing todo comment details with commits and hashes.
 */
function extractTodoWithHashes(sourceCode) {
    const results = [];
    
    // Match TODO comments followed by commit hashes and todo-hashes
    const todoPattern = /\/\/\s*TODO[^\n]*|<!--\s*todo-hash:\s*([a-f0-9]+)\s*-->|_Commit:\s*([a-f0-9]+)_/gi;
    
    let match;
    let currentTodo = null;
    let pendingCommits = [];
    let pendingHashes = [];
    
    // Split by lines to maintain order
    const lines = sourceCode.split('\n');
    
    for (const line of lines) {
        const todoMatch = line.match(/\/\/\s*TODO[^\n]*/i);
        const commitMatch = line.match(/_Commit:\s*([a-f0-9]+)_/i);
        const hashMatch = line.match(/<!--\s*todo-hash:\s*([a-f0-9]+)\s*-->/i);
        
        if (todoMatch) {
            // Save previous todo if exists
            if (currentTodo) {
                results.push({
                    comment: currentTodo,
                    commits: [...pendingCommits],
                    hashes: [...pendingHashes]
                });
            }
            currentTodo = todoMatch[0];
            pendingCommits = [];
            pendingHashes = [];
        }
        
        if (commitMatch) {
            pendingCommits.push(commitMatch[1]);
        }
        
        if (hashMatch) {
            pendingHashes.push(hashMatch[1]);
        }
    }
    
    // Don't forget the last one
    if (currentTodo) {
        results.push({
            comment: currentTodo,
            commits: [...pendingCommits],
            hashes: [...pendingHashes]
        });
    }
    
    return results;
}

/**
 * Gets the most recent commit hash associated with a TODO comment.
 * @param {string} sourceCode - The source code content.
 * @param {string} todoComment - The TODO comment to search for.
 * @returns {string|null} The most recent commit hash or null if not found.
 */
function getMostRecentCommitForTodo(sourceCode, todoComment) {
    const todos = extractTodoWithHashes(sourceCode);
    const found = todos.find(t => t.comment.includes(todoComment));
    return found && found.commits.length > 0 ? found.commits[found.commits.length - 1] : null;
}

/**
 * Gets all todo-hash values from the source code.
 * @param {string} sourceCode - The source code content.
 * @returns {Array<string>} Array of todo-hash values found.
 */
function getAllTodoHashes(sourceCode) {
    const hashPattern = /<!--\s*todo-hash:\s*([a-f0-9]+)\s*-->/gi;
    const hashes = [];
    let match;
    
    while ((match = hashPattern.exec(sourceCode)) !== null) {
        hashes.push(match[1]);
    }
    
    return hashes;
}

/**
 * Validates that all TODO entries have corresponding commit and hash markers.
 * @param {string} sourceCode - The source code content.
 * @returns {Object} Validation result with isValid flag and any issues found.
 */
function validateTodoStructure(sourceCode) {
    const todos = extractTodoWithHashes(sourceCode);
    const issues = [];
    
    for (const todo of todos) {
        if (todo.commits.length === 0) {
            issues.push(`TODO comment "${todo.comment}" has no associated commit hash`);
        }
        if (todo.hashes.length === 0) {
            issues.push(`TODO comment "${todo.comment}" has no associated todo-hash`);
        }
    }
    
    return {
        isValid: issues.length === 0,
        issues: issues
    };
}

// ... other existing functions remained unchanged