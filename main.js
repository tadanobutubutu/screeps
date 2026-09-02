const { dependencyGraphContent, indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
    // Use dependencyGraphContent from the imported module
    return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
    // Use indexContent from the imported module
    return indexContent(data, options);
}

// Add lang attribute to HTML element
function getLangAttribute() {
    return 'lang="en"';
}

// Function to generate person names for accessibility
function personName(id) {
    const names = [
        'John Doe',
        'Jane Smith',
        'Bob Johnson',
        'Alice Williams',
        'Charlie Brown'
    ];
    return names[id % names.length] || 'User';
}

// Utility functions for accessibility
const accessibilityUtils = {
    // Original newFocusTrap implementation for elements without focusable children
    originNewFocusTrap(element) {
        element.setAttribute('tabindex', '-1');
        element.addEventListener('focus', function() {
            element.setAttribute('tabindex', '-1');
        });
    },

    newFocusTrap(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return accessibilityUtils.originNewFocusTrap(element);
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    },

    // Announce message to screen readers
    announceToScreenReader: function(message, priority) {
        if (priority === undefined) {
            priority = 'polite';
        }
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(function() {
            announcer.remove();
        }, 1000);
    },

    // Handle keyboard navigation
    handleKeyboardNav: function(e, handlers) {
        const key = e.key;
        if (handlers[key]) {
            handlers[key](e);
        }
    },

    // Initialize skip link for accessibility
    initSkipLink: function(skipLinkId, targetId) {
        const skipLink = document.getElementById(skipLinkId);
        if (skipLink) {
            skipLink.setAttribute('href', `#${targetId}`);
            skipLink.setAttribute('aria-label', 'Skip to main content');
            skipLink.className = 'skip-link';
        }
    },

    // Function to ensure the element has an id, add aria-label, render dependency graphs
    ensureElementAccessibility: function(element, options) {
        if (!element) return false;
        
        options = options || {};
        
        // Ensure element has an id
        if (!element.id && options.id) {
            element.id = options.id;
        }
        
        // Ensure element has an aria-label if provided
        if (options.label && !element.hasAttribute('aria-label')) {
            element.setAttribute('aria-label', options.label);
        }
        
        // Ensure element has accessible name
        if (options.accessibleName && !element.hasAttribute('aria-label') && !element.hasAttribute('title')) {
            element.setAttribute('aria-label', options.accessibleName);
        }
        
        return true;
    },

    // Function to fix table structure and accessibility issues (REACT_027)
    validateTableAccessibility: function(table) {
        if (!table || table.tagName.toLowerCase() !== 'table') {
            return false;
        }

        // Ensure table has caption
        const caption = table.querySelector('caption');
        if (!caption && table.getAttribute('aria-label')) {
            const newCaption = document.createElement('caption');
            newCaption.textContent = table.getAttribute('aria-label');
            newCaption.className = 'sr-only';
            table.insertBefore(newCaption, table.firstChild);
        }

        // Ensure table has proper summary
        if (!table.hasAttribute('summary') && !table.querySelector('caption')) {
            table.setAttribute('summary', 'Table with structured data');
        }

        // Validate table structure
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('th, td');
            cells.forEach(cell => {
                // Ensure th cells have scope attribute
                if (cell.tagName.toLowerCase() === 'th' && !cell.hasAttribute('scope')) {
                    const isHeaderRow = row.parentElement.querySelectorAll('tr')[0] === row;
                    cell.setAttribute('scope', isHeaderRow ? 'row' : 'col');
                }
            });
        });

        return true;
    },

    // Function to validate and fix table structure (related to REACT_027)
    validateTableStructure: function(table) {
        return accessibilityUtils.validateTableAccessibility(table);
    },

    // Function to fix landmark structure and accessibility issues (REACT_017)
    validateLandmark: function(landmark) {
        if (!landmark) return false;

        // Ensure landmark has proper role
        const landmarkRole = landmark.getAttribute('role');
        const landmarkId = landmark.id;

        // Check for duplicate landmarks
        if (landmarkId) {
            const existingLandmarks = document.querySelectorAll(`[role="${landmarkRole}"][id="${landmarkId}"]`);
            if (existingLandmarks.length > 1) {
                landmark.setAttribute('aria-roledescription', landmarkRole);
            }
        }

        // Add unique identifying attribute
        if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            const role = landmark.getAttribute('role');
            if (role) {
                landmark.setAttribute('aria-label', `${role} region`);
            }
        }

        return true;
    },

    // Function to fix landmark structure (related to REACT_017)
    validateLandmarkStructure: function(landmark) {
        return accessibilityUtils.validateLandmark(landmark);
    },

    // Function to improve SVG accessibility (REACT_041)
    improveSvgAccessibility: function(svg) {
        if (!svg || svg.tagName.toLowerCase() !== 'svg') {
            return false;
        }

        // Ensure SVG has role="img"
        if (!svg.hasAttribute('role')) {
            svg.setAttribute('role', 'img');
        }

        // Ensure SVG has focusable="false"
        if (!svg.hasAttribute('focusable')) {
            svg.setAttribute('focusable', 'false');
        }

        // Add aria-hidden to decorative SVGs
        if (svg.getAttribute('aria-hidden') !== 'true') {
            const ariaHidden = svg.getAttribute('aria-hidden');
            if (ariaHidden === null) {
                svg.setAttribute('aria-hidden', 'true');
            }
        }

        return true;
    },

    // Function to get accessible name for SVG (REACT_041)
    getSvgAccessibleName: function(svg, title) {
        if (!svg || svg.tagName.toLowerCase() !== 'svg') {
            return null;
        }

        // Remove aria-hidden if title is provided
        if (title) {
            svg.setAttribute('aria-hidden', 'false');
            
            // Create or update title element
            let svgTitle = svg.querySelector('title');
            if (!svgTitle) {
                svgTitle = document.createElement('title');
                svg.insertBefore(svgTitle, svg.firstChild);
            }
            svgTitle.textContent = title;
            svg.setAttribute('aria-label', title);
        }

        return svg.getAttribute('aria-label');
    },

    // Function to create an in-page button with accessible link (REACT_036)
    createAccessibleInPageButton: function(options) {
        if (!options || !options.targetId) {
            return null;
        }

        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = options.text || 'Go to section';
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', options.text || 'Navigate to section');
        button.addEventListener('click', function() {
            const target = document.getElementById(options.targetId);
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });

        return button;
    },

    // Function to ensure unique landmarks (REACT_025)
    ensureUniqueLandmarks: function() {
        const landmarkRoles = ['banner', 'navigation', 'main', 'article', 'aside', 'footer'];
        const landmarkCounts = {};

        landmarkRoles.forEach(role => {
            const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
            if (elements.length > 1) {
                // Add unique identifiers to duplicate landmarks
                for (let i = 0; i < elements.length; i++) {
                    const el = elements[i];
                    if (!el.id) {
                        el.id = `${role}-${i}`;
                    }
                }
            }
        });
    },

    // Function to handle accessibility issues from insight report
    handleAccessibilityIssues: function(container, report) {
        if (!container || !report) {
            return false;
        }

        // Handle table issues
        const tables = container.querySelectorAll('table');
        tables.forEach(table => {
            accessibilityUtils.validateTableAccessibility(table);
        });

        // Handle landmark issues
        const landmarks = container.querySelectorAll('[role], banner, nav, main, article, aside, footer');
        landmarks.forEach(landmark => {
            accessibilityUtils.validateLandmark(landmark);
        });

        // Handle SVG issues
        const svgs = container.querySelectorAll('svg');
        svgs.forEach(svg => {
            accessibilityUtils.improveSvgAccessibility(svg);
        });

        // Handle link issues
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            accessibilityUtils.validateAndFixLinkAccessibility(link);
        });

        return true;
    },

    // Initialize all accessibility features
    initAccessibility: function(container) {
        if (container) {
            accessibilityUtils.handleAccessibilityIssues(container);
            accessibilityUtils.ensureUniqueLandmarks();
        }
    },

    // New function to render dependency graphs with accessibility
    renderDependencyGraphWithAccessibility: function(deps, options = {}) {
        // Ensure proper lang attribute on container
        if (options.container) {
            options.container.setAttribute('lang', 'en');
        }
        
        return dependencyGraphContent(deps, options);
    },

    // New function to validate and fix form accessibility
    validateAndFixFormAccessibility: function(form) {
        if (!form || form.tagName.toLowerCase() !== 'form') {
            return false;
        }

        // Ensure form has a proper role
        if (!form.getAttribute('role')) {
            form.setAttribute('role', 'form');
        }

        // Check for required labels
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const id = input.id;
            if (id) {
                const label = form.querySelector(`label[for="${id}"]`);
                if (!label) {
                    // Create implicit label if missing
                    const labelText = input.getAttribute('aria-label') || input.placeholder || 'Input field';
                    input.setAttribute('aria-label', labelText);
                }
            } else {
                // Generate ID if missing
                input.id = `input-${Math.random().toString(36).substr(2, 9)}`;
            }
        });

        // Check for submit button
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (!submitButton) {
            const newButton = document.createElement('button');
            newButton.type = 'submit';
            newButton.textContent = 'Submit';
            form.appendChild(newButton);
        }

        return true;
    },

    // New function to validate and fix link accessibility
    validateAndFixLinkAccessibility: function(link) {
        if (!link || link.tagName.toLowerCase() !== 'a') {
            return false;
        }

        // Ensure link has proper text content
        if (!link.textContent.trim()) {
            link.textContent = link.getAttribute('aria-label') || 'Link';
        }

        // Ensure link has href or role
        if (!link.getAttribute('href') && !link.getAttribute('role')) {
            link.setAttribute('role', 'button');
        }

        return true;
    },

    // New function to validate and fix button accessibility
    validateAndFixButtonAccessibility: function(button) {
        if (!button || (button.tagName.toLowerCase() !== 'button' && button.getAttribute('role') !== 'button')) {
            return false;
        }

        // Ensure button has proper text content
        if (!button.textContent.trim()) {
            button.textContent = button.getAttribute('aria-label') || 'Button';
        }

        // Ensure button has type attribute
        if (!button.getAttribute('type')) {
            button.setAttribute('type', 'button');
        }

        return true;
    },

    // Function to create skip link
    initSkipLink: function(skipLinkId, targetId) {
        const skipLink = document.getElementById(skipLinkId);
        if (skipLink) {
            skipLink.href = `#${targetId}`;
            skipLink.setAttribute('aria-label', 'Skip to main content');
            skipLink.className = 'skip-link';
        }
        return skipLink;
    },

    // Function to trap focus within an element
    trapFocus: function(element) {
        if (!element) return;
        
        const focusableElements = element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) {
            element.setAttribute('tabindex', '-1');
            return;
        }
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
};

// Export all functions for use in other modules
module.exports = {
    renderDependencyGraph,
    renderIndex,
    getLangAttribute,
    personName,
    accessibilityUtils,
    newFocusTrap: accessibilityUtils.newFocusTrap,
    initSkipLink: accessibilityUtils.initSkipLink,
    trapFocus: accessibilityUtils.trapFocus,
    announceToScreenReader: accessibilityUtils.announceToScreenReader,
    handleKeyboardNav: accessibilityUtils.handleKeyboardNav,
    ensureElementAccessibility: accessibilityUtils.ensureElementAccessibility,
    validateAndFixTableStructure: accessibilityUtils.validateTableAccessibility,
    validateTableStructure: accessibilityUtils.validateTableStructure,
    validateAndFixLandmark: accessibilityUtils.validateLandmark,
    validateLandmarkStructure: accessibilityUtils.validateLandmarkStructure,
    getSvgAccessibleName: accessibilityUtils.getSvgAccessibleName,
    improveSvgAccessibility: accessibilityUtils.improveSvgAccessibility,
    createAccessibleInPageButton: accessibilityUtils.createAccessibleInPageButton,
    ensureUniqueLandmarks: accessibilityUtils.ensureUniqueLandmarks,
    handleAccessibilityIssues: accessibilityUtils.handleAccessibilityIssues,
    validateAndFixFormAccessibility: accessibilityUtils.validateAndFixFormAccessibility,
    validateAndFixLinkAccessibility: accessibilityUtils.validateAndFixLinkAccessibility,
    validateAndFixButtonAccessibility: accessibilityUtils.validateAndFixButtonAccessibility,
    initAccessibility: accessibilityUtils.initAccessibility,
    renderDependencyGraphWithAccessibility: accessibilityUtils.renderDependencyGraphWithAccessibility
};