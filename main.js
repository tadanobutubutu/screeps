import './styles.less';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';

// Landmark data structure
const landmarks = [];

// Application data structure
const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-it's)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97ba2237d968a50cc419 -->

// Implemented validateLandmark functionality
/**
 * Function to check if the specified landmark element is in the document.
 * @param {string} id - The ID of the landmark element.
 * @returns {boolean} Returns true if the element exists; otherwise, false.
 */
function checkLandmarkElement(id) {
    const element = document ? document.getElementById(id) : null;
    return element !== null;
}

// Landmark validation function with merged logic from both branches
function validateLandmark(landmark) {
    const errors = [];

    // Check if landmark exists
    if (!landmark) {
        errors.push('Landmark is required');
        return { valid: false, errors };
    }

    // Validate name
    if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
        errors.push('Landmark must have a valid name');
    }

    // Validate latitude
    if (landmark.latitude === undefined || landmark.latitude === null) {
        errors.push('Landmark must have a latitude');
    } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
        errors.push('Landmark latitude must be a number');
    } else if (landmark.latitude < -90 || landmark.latitude > 90) {
        errors.push('Landmark latitude must be between -90 and 90');
    }

    // Validate longitude
    if (landmark.longitude === undefined || landmark.longitude === null) {
        errors.push('Landmark must have a longitude');
    } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
        errors.push('Landmark longitude must be a number');
    } else if (landmark.longitude < -180 || landmark.longitude > 180) {
        errors.push('Landmark longitude must be between -180 and 180');
    }

    // Check for updated validation changes from another branch that also checks for array composition
    if (Array.isArray(landmark)) {
        landmark.forEach(innerLandmark => {
            if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
                errors.push('Landmark array must have valid names');
            }
        });
    }

    return { valid: errors.length === 0, errors };
}

// Accessibility helper function to validate table structure
function validateTableStructure(table) {
    const issues = [];

    // Check for proper table structure (thead, tbody, tfoot)
    if (!table.querySelector('thead')) {
        issues.push('Table missing thead');
    }
    if (!table.querySelector('tbody')) {
        issues.push('Table missing tbody');
    }

    // Check for proper row structure
    const rows = table.querySelectorAll('tr');
    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td, th');
        if (cells.length === 0) {
            issues.push(`Row ${index} has no cells`);
        }
    });

    return issues;
}

// Table accessibility functions (merged from both branches)
function validateTableAccessibility() {
    // Implementation for merged table accessibility validation
}

function validateTableStructure() {
    // Implementation for merged table structure validation
}

function fixTableStructure() {
    // Implementation for merged table structure fixing
}

// Landmark functions (merged from both branches)
function ensureLandmarkUniqueness(elements) {
    const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

    const elementsById = {};

    if (Array.isArray(elements)) {
        for (const landmark of elements) {
            if (landmark.id) {
                if (elementsById[landmark.id]) {
                    landmark.id += '_duplicate';
                } else {
                    elementsById[landmark.id] = true;
                }
            }
        }
    }

    return elements;
}

// Accessibility helper function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
    // Check for aria-label
    let label = svgElement.getAttribute('aria-label');

    // Check for aria-labelledby
    const labelledBy = svgElement.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelElement = document.getElementById(labelledBy);
        if (labelElement) {
            label = labelElement.textContent;
        }
    }

    // Check for title element inside SVG
    if (!label) {
        const title = svgElement.querySelector('title');
        if (title) {
            label = title.textContent;
        }
    }

    return label || '';
}

// Accessibility helper function to set SVG attributes for accessibility
function setSvgAttributes(svgElement, accessibleName) {
    // Ensure SVG has role="img"
    svgElement.setAttribute('role', 'img');

    // Set aria-label if not already set
    if (!svgElement.getAttribute('aria-label') && accessibleName) {
        svgElement.setAttribute('aria-label', accessibleName);
    }

    // Add title element if missing
    const existingTitle = svgElement.querySelector('title');
    if (!existingTitle && accessibleName) {
        const title = document.createElement('title');
        title.textContent = accessibleName;
        svgElement.insertBefore(title, svgElement.firstChild);
    }
}

// Accessibility helper function to ensure unique landmarks
function ensureUniqueLandmarks() {
    const landmarks = {};
    const issues = [];

    // Find all landmark elements
    const banner = document.querySelectorAll('[role="banner"], .banner');
    const navigation = document.querySelectorAll('[role="navigation"], .navigation');
    const main = document.querySelectorAll('[role="main"], .main');
    const contentinfo = document.querySelectorAll('[role="contentinfo"], .contentinfo');
    const complementary = document.querySelectorAll('[role="complementary"], .complementary');
    const search = document.querySelectorAll('[role="search"], .search');

    // Check for duplicate landmarks
    if (banner.length > 1) landmarks.banner = banner;
    if (main.length > 1) landmarks.main = main;
    if (contentinfo.length > 1) landmarks.contentinfo = contentinfo;

    if (complementary.length > 1) {
        issues.push(`Found ${complementary.length} complementary landmarks, should have at most 1`);
    }

    if (search.length > 1) {
        issues.push(`Found ${search.length} search landmarks, should have at most 1`);
    }

    return { landmarks, issues };
}

// Accessibility helper function to add proper landmark regions
function addLandmarkRegions() {
    // Check for main landmark
    let main = document.querySelector('[role="main"], .main');
    if (!main) {
        main = document.createElement('main');
        main.setAttribute('role', 'main');
    }
    if (!main) {
        // If no main found, wrap content appropriately
        main = document.createElement('main');
        main.setAttribute('id', 'main-content');
        // Content would need to be moved into main here
    }

    // Ensure unique IDs for landmarks
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"], [role="search"], [role="region"]');
    const usedIds = new Set();

    landmarks.forEach(landmark => {
        const existingId = landmark.id;
        if (existingId) {
            usedIds.add(existingId);
        }
    });

    return { main, usedIds };
}

// Visualize dependency tree function (incorporated from origin/main)
function visualizeDependencyTree(dependencies) {
    console.log('Dependency Tree:');
    return dependencies;
}

// Process data function
function processData(data) {
    if (!data) {
        return null;
    }
    appState.data = data;
    return data;
}

function ensureUniqueLandmarks(landmarksArray) {
    if (!landmarksArray || landmarksArray.length === 0) {
        return [];
    }
    const seen = new Set();
    return landmarksArray.filter(landmark => {
        const key = landmark.name + '_' + (landmark.role || 'default');
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    }).filter(landmark => checkLandmarkElement(landmark.id));
}

// NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())
function newFocusTrap(focusableElements, onEscape) {
    const initialFocus = null;

    function trapFocus(event) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            const focusable = Array.from(focusableElements).filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);
            if (focusable[0]) {
                focusable[0].focus();
            } else {
                if (initialFocus) initialFocus.focus();
            }
        } else if (event.key === 'Escape') {
            // Close the trap by returning focus to the last focused element
            // In a real implementation, we would need to track the previous element
            console.log('Focus trap triggered, returning focus');
        }
    }

    return { trapFocus };
}

function addressInsightIssues(insights) {
    if (!Array.isArray(insights)) {
        return [];
    }

    // Process landmarks with validation and uniqueness guarantees
    const validLandmarks = insights.filter(landmark => {
        const validation = validateLandmark(landmark);
        return validation.valid;
    });

    return ensureUniqueLandmarks(validLandmarks);
}

// Export functions for testing
export {
    checkLandmarkElement,
    ensureUniqueLandmarks,
    landmarkStructureCheck,
    setLanguageAttribute,
    addLandmarkRoles,
    fixFakeLinks,
    isSecureContext,
    initApp,
    landmarks,
    appData,
    icons,
    validateLandmark,
    ensureFocusableElements,
    renderDependencyGraphContent,
    ensureLandmarkUniqueness,
    validateSvgAccessibility,
    processUniqueElements,
    addressInsightIssues,
    renderDependencyGraph,
    renderIndexView,
    calculateSum,
    addProperLandmarkRegions,
    countDependencies,
    processLandmarks,
    validateTableStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    visualizeDependencyTree,
    processData,
    newFocusTrap
};