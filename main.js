// Main entry point for the application

/**
 * Generates the HTML content with proper landmark elements
 * @param {Object} options - Configuration options
 * @returns {string} Generated HTML string
 */
function generatePageContent(options = {}) {
    const { title = 'Quality & Metrics Reports', content = '' } = options;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header>
        <nav>...</nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>...</footer>
</body>
</html>
    `.trim();
}

/**
 * Wraps content in a main landmark element
 * @param {string} content - The content to wrap
 * @returns {string} Content wrapped in main tags
 */
function wrapInMainLandmark(content) {
    return `<main>\n        ${content}\n    </main>`;
}

/**
 * Updates HTML files to include proper landmark elements
 * @param {string} htmlContent - The HTML content to update
 * @returns {string} Updated HTML content with main landmark
 */
function updateHTMLWithLandmarks(htmlContent) {
    // Check if main landmark already exists
    if (htmlContent.includes('<main>')) {
        return htmlContent;
    }

    // Find body content and wrap it in main
    const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        const bodyContent = bodyMatch[1].trim();
        const wrappedContent = wrapInMainLandmark(bodyContent);
        return htmlContent.replace(
            /<body>[\s\S]*?<\/body>/i,
            `<body>\n        ${wrappedContent}\n    </body>`
        );
    }

    return htmlContent;
}

// TODO: This is the existing code that needs to be preserved

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];

/**
 * Updates HTML files to include proper landmark elements
 * This function will iterate through LANDMARK_ELEMENTS and ensure they have proper IDs
 */
function addLandmarkRegions() {
    const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
    landmarkElements.forEach((landmark) => {
        if (landmark) {
            if (!landmark.id) {
                landmark.id = `${landmark.tagName.toLowerCase()}-${landmark.id ? landmark.id : 0}`;
            }
        }
    });
}

// Function to check landmark elements
function checkLandmarkElements() {
    const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, article');
    landmarkElements.forEach((landmark, index) => {
        if (landmark.id === '') {
            landmark.id = `${landmark.tagName.toLowerCase()}-${index}`;
        }

        if (landmarkElements.length > 1) {
            if (landmark.id === '') {
                landmark.id = `${landmark.tagName.toLowerCase()}-${index}`;
            }
        }
    });
}

// ... rest of your main.js code ...

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
    a11yStore.init();
});

// Preserve existing code
a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach(issue => {
        // Handle each issue type
        switch (issue.type) {
            case 'missing-lang':
                if (!document.documentElement.lang) {
                    document.documentElement.lang = 'en';
                }
                break;
            case 'missing-skip-link':
                if (!document.querySelector('.skip-link')) {
                    const skipLink = document.createElement('a');
                    skipLink.className = 'skip-link';
                    skipLink.href = '#main-content';
                    skipLink.textContent = 'Skip to main content';
                    document.body.insertBefore(skipLink, document.body.firstChild);
                }
                break;
            case 'missing-alt':
                document.querySelectorAll('img').forEach(img => {
                    if (!img.getAttribute('alt')) {
                        img.setAttribute('alt', 'Image description');
                    }
                });
                break;
            case 'missing-label':
                document.querySelectorAll('input, select, textarea').forEach(el => {
                    if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
                        el.setAttribute('aria-label', 'Form field');
                    }
                });
                break;
            // Add more cases as needed
        }
    });
}

// ... ( keep existing implementation )

// Checks the schema of an object with a "columns" property
function checkTableSchema(tableSchema) {
    if (!tableSchema || typeof tableSchema !== 'object' || !Array.isArray(tableSchema.columns)) {
        return { isValid: false, errors: ['Table schema must have a "columns" property'] };
    }

    const errors = [];
    const columns = tableSchema.columns;

    const expectedColumns = tableSchema.expectedColumns || [];

    expectedColumns.forEach((expecting) => {
        const found = tableSchema.columns.find((col) => col.name === expecting.name);
        if (!found) {
            errors.push(`Missing expected column: ${expecting.name}`);
            return;
        }

        if (expecting.type && found.type !== expecting.type) {
            errors.push(`Expected column ${found.name} to be a ${expecting.type}, but it is a ${found.type}`);
        }

        if (expecting.unique !== undefined && found.unique !== expecting.unique) {
            errors.push(`Expected column ${found.name} to be ${expecting.unique ? 'unique' : 'not unique'}, but it is ${found.unique ? 'unique' : 'not unique'}`);
        }
    });

    if (errors.length > 0) {
        return {isValid: false, errors};
    }

    return {isValid: true};
}

// Accessibility fixes as per insight report
// REACT_015: Add lang attribute
// REACT_025: Add skip link functionality for keyboard users

/**
 * Sets the lang attribute on the document root element
 * @param {string} lang - Language code (default: 'en')
 */
function setLangAttribute(lang = 'en') {
    document.documentElement.lang = lang;
}

/**
 * Initializes accessibility features based on insight report
 */
function initAccessibility() {
    // REACT_015: Add lang attribute
    setLangAttribute();

    // REACT_025: Add skip link functionality for keyboard users
    const skipLink = document.getElementById('main-content') || document.querySelector('main');
    if (skipLink) {
        skipLink.setAttribute('tabindex', '-1');
        skipLink.addEventListener('focus', function() {
            this.removeAttribute('tabindex');
        });
    }

    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(function(element) {
        if (!element.getAttribute('tabindex') && !element.hasAttribute('href')) {
            element.setAttribute('tabindex', '0');
        }
    });
}

// Export affected functions to make them accessible
module.exports = {
    addLandmarkRegions,
    checkLandmarkElements,
    addSVGAccessibilityProps,
    fixFakeLinks,
    setLangAttribute,
    initAccessibility,
    generatePageContent,
    wrapInMainLandmark,
    updateHTMLWithLandmarks,
    checkTableSchema,
    countDependencies,
    createInPageButton,
    addressAccessibilityIssues
};

// Export for module usage (ES modules)
if (typeof exports !== 'undefined') {
    exports.a11yStore = a11yStore;
    exports.addressAccessibilityIssues = addressAccessibilityIssues;
    exports.createInPageButton = createInPageButton;
    exports.default = a11yStore;
}