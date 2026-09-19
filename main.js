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
 * Checks if a link is accessible.
 * @param {HTMLAnchorElement} link - The link element to check.
 * @returns {Object} - An object containing accessibility status and any issues found.
 */
function isLinkAccessible(link) {
    const result = { isAccessible: true, issues: [] };
    
    // Check if link has a valid href
    if (!link || !link.href) {
        result.isAccessible = false;
        result.issues.push('Link is missing or has no href attribute');
    }
    
    // Check if link has accessible text
    const linkText = link.textContent.trim();
    if (!linkText && !link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
        result.isAccessible = false;
        result.issues.push('Link has no accessible name (no text, aria-label, or aria-labelledby)');
    }
    
    return result;
}

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function createUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.floor(Math.random() * 9000) + 1000;
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmark objects.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
export function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    if (!landmarks) return result;
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Validates a landmark's structure and adds or fixes landmark roles if necessary.
 * @param {HTMLElement} landmark - Landmark to be validated.
 */
function validateLandmarkStructure(landmark) {
  const id = landmark.id;
  if (!id) {
    landmark.id = ensureUniqueLandmarkId(`landmark-${idPrefix}`);
  }

/**
 * Adds lang attribute as per the issue requirement
 */
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.querySelector('html');
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

// ... other fixes ...

// DOM-based accessibility code

// Add lang attribute to HTML element
addLangAttribute();

// Create in-page button with accessibility considerations
createInPageButton();

// Validate table structure and accessibility
// Assuming you have a table element with an id of 'myTable'
const table = document.getElementById('myTable');
validateTableAccessibility(table);
validateTableStructure(table);

// Add/fix landmark issues
validateLandmark();
// ...

// Add accessible names to SVGs
// Assuming you have an SVG element with an id of 'mySvg'
const svg = document.getElementById('mySvg');
const accessibleName = getSvgAccessibleName(svg);
setSvgAttributes(svg, accessibleName);

// Ensure unique landmarks
// This would be handled by the appropriate function call
uniqueLandmarks([]);
handleFakeLinks();

// ... rest of your code ...

// React / UI related functions

// TODO: Add these imported modules to the relevant rendering functions

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = document.createElement('div');
  container.innerHTML = products.map(p => `<div>${formatProductName(p)}</div>`).join('');
  return container;
}

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
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

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: $${total.toFixed(2)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderContent(input);
  }
  return null;
}

/**
 * Counts the dependencies in a package.json object or list of dependencies.
 * @param {Object|Array|string} packageData - The parsed package.json object, array of dependencies, or JSON string.
 * @returns {Object} An object with count of dependencies and devDependencies.
 */
function countDependencies(packageData) {
    let dependencies = {};
    let devDependencies = {};
    
    if (typeof packageData === 'string') {
        try {
            const parsed = JSON.parse(packageData);
            dependencies = parsed.dependencies || {};
            devDependencies = parsed.devDependencies || {};
        } catch (e) {
            return { dependencies: 0, devDependencies: 0, total: 0 };
        }
    } else if (Array.isArray(packageData)) {
        return { dependencies: packageData.length, devDependencies: 0, total: packageData.length };
    } else if (typeof packageData === 'object' && packageData !== null) {
        dependencies = packageData.dependencies || {};
        devDependencies = packageData.devDependencies || {};
    }
    
    const depCount = Object.keys(dependencies).length;
    const devDepCount = Object.keys(devDependencies).length;
    
    return {
        dependencies: depCount,
        devDependencies: devDepCount,
        total: depCount + devDepCount
    };
}

// Export for testing and external use
export { 
    createUniqueLandmarkId,
    uniqueLandmarks, 
    addAriaLabel, 
    addLangAttribute,
    formatProductName,
    renderProductList,
    calculateTotalPrice,
    renderCart,
    validateAndRender,
    countDependencies
};