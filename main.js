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
    LANDMARK_ELEMENTS.forEach((tag) => {
        const elements = context.querySelectorAll(tag);
        elements.forEach((el) => landmarks.push(el));
    });
    return landmarks;
}

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
        const hasLabel = nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby');
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

    // Check for required main landmark
    const foundLandmarks = {};
    LANDMARK_ELEMENTS.forEach((tag) => {
        foundLandmarks[tag] = context.querySelectorAll(tag).length;
    });

    if (!foundLandmarks.main) {
        issues.push({
            type: 'warning',
            code: 'MISSING_MAIN_LANDMARK',
            message: 'Missing main landmark element'
        });
    }

    // Check for duplicate landmarks (potential issue)
    LANDMARK_ELEMENTS.forEach((landmark) => {
        if (foundLandmarks[landmark] > 1) {
            issues.push({
                type: 'warning',
                code: 'MULTIPLE_LANDMARKS',
                message: `Multiple ${landmark} elements found`
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

// Import a11y store configuration
const a11yStore = require('./a11yStore');

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

// New function to validate link accessibility and handle fake links
const validateLinkAccessibility = () => {
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.href.startsWith('#') || !link.hasAttribute('href')) {
            handleFakeLinks(link);
        }
    }
};

// New function to handle fake links by wrapping them in an in-page button
const handleFakeLinks = (link) => {
    const fakeLinkButton = createInPageButton({ text: link.textContent, onClick: () => {} });
    link.textContent = '';
    link.setAttribute('target', '_top');
    link.addEventListener('click', (event) => {
        event.preventDefault();
        fakeLinkButton.onClick();
    });
};

// New function to wrap primary content in a main element
const wrapPrimaryContentInMain = () => {
    const primaryContent = document.getElementById('primary-content');
    if (primaryContent) {
        const mainElement = document.createElement('main');
        mainElement.appendChild(primaryContent);
        document.body.insertBefore(mainElement, document.body.firstChild);
    }
};

// New function to count dependencies
function countDependencies() {
    // Existing function implementation

    // New implementation to count dependencies using dependencyGraphContent and regex
    const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
    const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
    return importCount.length;
}

// Render index view content using indexContent
function renderIndexView() {
    return indexContent;
}

// New function to handle credential response
function handleCredentialResponse(response) {
  // TODO: Implement the logic to handle the credential response
  // This function should be called when a credential response is received
  // For example, you might parse the response, validate it, and then store or use the credentials
  console.log('Handling credential response:', response);
  // Placeholder for actual implementation
}

// New function to handle dynamic content updates
function updateLiveRegion(message, priority = 'polite') {
    a11yStore.updateLiveRegion(message, priority);
}

// New function to add IDs to landmark elements
function addLandmarkIds() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((tag) => {
        const landmark = document.querySelector(tag);
        if (landmark && landmark.id === '') {
            landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
        }
    });
}

// New function to check landmark elements in the DOM
function checkLandmarkElementsInDom() {
    a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
    a11yStore.addSVGAccessibilityProps();
}

// Preserve existing code functionality
function preserveExistingCode() {
    a11yStore.preserveExistingCode();
}

// New function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
    if (!report) return;
    a11yStore.addressAccessibilityIssues(report);
}

// New function to add landmark regions
function addLandmarkRegions() {
    const landmarks = {
        main: true,
        nav: false,
        aside: false,
    };

    return {
        landmarks,
        regions: Object.keys(landmarks).filter((key) => landmarks[key]),
    };
}

// Get SVG accessible name helper
function getSvgAccessibleName(svg) {
    return a11yStore.getSvgAccessibleName(svg);
}

// Get person name for accessible labeling
function personName() {
    return a11yStore.personName();
}

// Validate and fix table accessibility
function validateTableAccessibility() {
    a11yStore.validateTableAccessibility();
}

// Validate and fix table structure
function validateTableStructure() {
    a11yStore.validateTableStructure();
}

// Validate landmark elements
function validateLandmark() {
    a11yStore.validateLandmark();
}

// Validate landmark structure
function validateLandmarkStructure() {
    a11yStore.validateLandmarkStructure();
}

// Ensure unique landmark IDs
function ensureUniqueLandmarks() {
    a11yStore.ensureUniqueLandmarks();
}

// Fix fake link issues
const fixFakeLinkIssues = () => {
    validateLinkAccessibility();
};

// New function to get the language attribute value
const getLangAttribute = () => {
    // Assuming the function to determine the page language
    // This is a placeholder for the actual implementation
    return 'en';
};

// New function to handle creating in-page buttons
function createInPageButton(options) {
    const button = document.createElement('button');
    button.textContent = options.text;
    if (options.onClick) {
        button.addEventListener('click', options.onClick);
    }
    return button;
}

// New function to check landmark elements
function checkLandmarkElements() {
    return findLandmarks(document);
}

// New function to handle adding landmark regions
function addLandmarkRegions() {
    const landmarks = {
        main: true,
        nav: false,
        aside: false,
    };

    return {
        landmarks,
        regions: Object.keys(landmarks).filter((key) => landmarks[key]),
    };
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
        handleCredentialResponse,
        validateLinkAccessibility,
        handleFakeLinks,
        wrapPrimaryContentInMain,
        countDependencies,
        renderIndexView,
        updateLiveRegion,
        addLandmarkIds,
        checkLandmarkElementsInDom,
        addSVGAccessibilityProps,
        preserveExistingCode,
        personName,
        validateTableAccessibility,
        validateTableStructure,
        validateLandmark,
        getSvgAccessibleName,
        addressAccessibilityIssues,
        addLandmarkRegions,
        getLangAttribute,
        a11yStore,
    };
}

// Auto-validate on load if this is a browser context
if (typeof window !== 'undefined') {
    // Store validation result globally for debugging
    window.landmarkValidation = validateLandmarkStructure(document);
}