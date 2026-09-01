// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc4 >
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac4 >
// _Commit: f8051b788bad4952d8493f08d3c722a06ff80d3_
// <!-- todo-hash: b498b47abee4 >
// _Commit: 60d5f1a2c3e4b5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
// _Commit: abcdef1234567890abcdef1234567890abcdef12
// _Commit: feb9680b5af4505068fcf221c52a94afa10f173e_
//
// <!-- todo-hash: e242a52a58b42aca6ca1fe442222a93da9f0c2f4 -->
// 4. REACT_025: Ensure unique landmarks

// main.js - Accessibility Validator and Utilities

/**
 * Validates landmark structure for accessibility issues
 * Checks for proper use of HTML5 landmark elements and ARIA landmarks
 */

// Common landmark selectors
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
const LANDMARK_SELECTORS = LANDMARK_ELEMENTS.map(el => el).join(',');

/**
 * Finds all landmark elements in a document or container
 * @param {Document|Element} context - The context to search within
 * @returns {Element[]} Array of landmark elements
 */
function findLandmarks(context = document) {
    const landmarks = [];
    LANDMARK_ELEMENTS.forEach(tag => {
        const elements = context.querySelectorAll(tag);
        elements.forEach(el => landmarks.push(el));
    });
    return landmarks;
}

/**
 * Validates the landmark structure for accessibility issues
 * @param {Document|Element} context - The document or container to validate
 * @returns {Object} Validation result with issues array
 */
function validateLandmarkStructure(context = document) {
    const issues = [];
    
    // Check for multiple <main> elements (should be exactly one)
    const mainElements = context.querySelectorAll('main');
    if (mainElements.length === 0) {
        issues.push({
            type: 'error',
            code: 'MISSING_MAIN',
            message: 'Document should contain exactly one <main> landmark for main content'
        });
    } else if (mainElements.length > 1) {
        issues.push({
            type: 'error',
            code: 'MULTIPLE_MAIN',
            message: `Document contains ${mainElements.length} <main> elements. Only one is allowed per page.`
        });
    }
    
    // Validate sections have accessible names
    const sections = context.querySelectorAll('section');
    sections.forEach((section, index) => {
        const hasLabel = section.getAttribute('aria-label') || 
                         section.getAttribute('aria-labelledby') ||
                         section.querySelector('h1, h2, h3, h4, h5, h6');
        if (!hasLabel) {
            issues.push({
                type: 'warning',
                code: 'SECTION_WITHOUT_NAME',
                message: `Section element at index ${index} should have an accessible name (aria-label, aria-labelledby, or heading)`
            });
        }
    });
    
    // Validate forms have accessible names
    const forms = context.querySelectorAll('form');
    forms.forEach((form, index) => {
        const hasLabel = form.getAttribute('aria-label') || 
                         form.getAttribute('aria-labelledby') ||
                         form.getAttribute('name');
        if (!hasLabel && form.querySelectorAll('input, select, textarea').length > 0) {
            issues.push({
                type: 'warning',
                code: 'FORM_WITHOUT_NAME',
                message: `Form at index ${index} should have an accessible name if it contains form controls`
            });
        }
    });
    
    // Validate navigation elements
    const navElements = context.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
        const hasLabel = nav.getAttribute('aria-label') || 
                         nav.getAttribute('aria-labelledby');
        const isMultipleNav = navElements.length > 1 && !hasLabel;
        if (isMultipleNav) {
            issues.push({
                type: 'warning',
                code: 'NAV_WITHOUT_LABEL',
                message: `Navigation at index ${index} should have an aria-label when multiple nav elements exist`
            });
        }
    });
    
    // Check for proper header/footer usage
    const headers = context.querySelectorAll('header');
    headers.forEach((header, index) => {
        // Header inside main should be a banner, not a sectioning element
        if (header.closest('main') && !header.closest('section') && !header.closest('article')) {
            issues.push({
                type: 'info',
                code: 'HEADER_NESTING',
                message: `Header at index ${index} is inside main content - consider if this is the intended use`
            });
        }
    });
    
    return {
        isValid: issues.filter(i => i.type === 'error').length === 0,
        issueCount: issues.length,
        issues: issues
    };
}

/**
 * Gets a summary report of landmark structure validation
 * @param {Document|Element} context - The document or container to analyze
 * @returns {string} Human-readable summary
 */
function getLandmarkSummary(context = document) {
    const result = validateLandmarkStructure(context);
    const summary = [];
    
    summary.push('Landmark Structure Validation Summary:');
    summary.push(`- Total issues found: ${result.issueCount}`);
    
    const errors = result.issues.filter(i => i.type === 'error');
    const warnings = result.issues.filter(i => i.type === 'warning');
    const infos = result.issues.filter(i => i.type === 'info');
    
    if (errors.length > 0) {
        summary.push(`- Errors: ${errors.length}`);
        errors.forEach(e => summary.push(`  • ${e.message}`));
    }
    if (warnings.length > 0) {
        summary.push(`- Warnings: ${warnings.length}`);
        warnings.forEach(w => summary.push(`  • ${w.message}`));
    }
    if (infos.length > 0) {
        summary.push(`- Info: ${infos.length}`);
        infos.forEach(i => summary.push(`  • ${i.message}`));
    }
    
    summary.push(`\nValidation ${result.isValid ? 'PASSED' : 'FAILED'}`);
    
    return summary.join('\n');
}

// Common utility functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// New function to add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en'); // Assuming English for this example
  }
}

// New function to fix table structure issues
function fixTableStructure() {
  // Implementation for fixing table structure
}

// New function to add/fix landmark issues
function addMainLandmark() {
  // Implementation for adding/fixing landmark issues
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = findLandmarks(document);
  const usedNames = new Set();
  landmarks.forEach(el => {
    let name = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent.trim();
    if (!name) {
      name = el.tagName.toLowerCase();
    }
    let uniqueName = name;
    let counter = 1;
    while (usedNames.has(uniqueName)) {
      uniqueName = `${name}_${counter}`;
      counter++;
    }
    usedNames.add(uniqueName);
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', uniqueName);
    }
  });
}

// New function to add accessible names to SVGs
function addSvgAccessibleNames() {
  // Implementation for adding accessible names to SVGs
}

// New function to fix fake link issue
function fixFakeLinkIssue() {
  // Implementation for fixing fake link issue
}

// Call the new functions as needed, for example:
addLangAttribute();
// fixTableStructure();
// addMainLandmark();
// ensureUniqueLandmarks();
// addSvgAccessibleNames();
// fixFakeLinkIssue();

// New function to handle credential response
function handleCredentialResponse(response) {
  // TODO: Implement the logic to handle the credential response
  // This function should be called when a credential response is received
  // For example, you might parse the response, validate it, and then store or use the credentials
  console.log('Handling credential response:', response);
  // Placeholder for actual implementation
}

// Module exports
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateLandmarkStructure,
        getLandmarkSummary,
        findLandmarks,
        LANDMARK_ELEMENTS,
        LANDMARK_SELECTORS,
        add,
        subtract,
        multiply,
        divide,
        addLangAttribute,
        fixTableStructure,
        addMainLandmark,
        ensureUniqueLandmarks,
        addSvgAccessibleNames,
        fixFakeLinkIssue,
        handleCredentialResponse
    };
}

// Auto-validate on load if this is a browser context
if (typeof window !== 'undefined') {
    // Store validation result globally for debugging
    window.landmarkValidation = validateLandmarkStructure(document);
}