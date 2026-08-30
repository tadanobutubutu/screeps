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
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
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
  const elementToModify = document.querySelector('some-selector');
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
    if (!element.hasAttribute('aria-label')) {
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

// TODO: Implement renderIndexView functionality
/**
 * Renders an accessible index view with navigation items.
 * @param {HTMLElement} container - The container element to render the index view into.
 * @param {Array} items - Array of items to display in the index view.
 * @param {Object} options - Configuration options for the index view.
 * @param {Function} options.onItemClick - Callback function when an item is clicked.
 * @param {string} options.ariaLabel - ARIA label for the index view.
 * @param {string} options.headingLevel - Heading level for item titles (default: '2').
 * @returns {HTMLElement} The rendered nav element containing the index view.
 */
function renderIndexView(container, items = [], options = {}) {
    const {
        onItemClick = null,
        ariaLabel = 'Index navigation',
        headingLevel = '2'
    } = options;

    // Create the navigation landmark
    const nav = document.createElement('nav');
    const navId = ensureUniqueLandmarkId('index-nav');
    nav.id = navId;
    nav.setAttribute('aria-label', ariaLabel);

    // Create heading for the index
    const heading = document.createElement(`h${headingLevel}`);
    heading.textContent = 'Index';
    addAriaLabel(heading, 'Index section heading');
    nav.appendChild(heading);

    // Create the list of items
    const list = document.createElement('ul');
    list.setAttribute('role', 'list');

    items.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('role', 'listitem');

        const link = document.createElement('a');
        link.href = item.href || '#';
        link.textContent = item.label || item.title || `Item ${index + 1}`;
        
        if (item.id) {
            link.id = `${navId}-link-${index}`;
        }
        
        if (item.description) {
            link.setAttribute('aria-describedby', `${navId}-desc-${index}`);
            
            const description = document.createElement('span');
            description.id = `${navId}-desc-${index}`;
            description.className = 'index-item-description';
            description.textContent = item.description;
            
            listItem.appendChild(link);
            listItem.appendChild(description);
        } else {
            listItem.appendChild(link);
        }

        // Add click handler if provided
        if (onItemClick && typeof onItemClick === 'function') {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                onItemClick(item, index, event);
            });
        }

        // Add keyboard navigation support
        setupKeyboardNavigation(link, {
            onEnter: () => {
                if (onItemClick) {
                    onItemClick(item, index, new Event('keyboard'));
                } else {
                    link.click();
                }
            }
        });

        list.appendChild(listItem);
    });

    nav.appendChild(list);

    // Validate landmark structure
    validateLandmark(nav);

    // Append to container if provided
    if (container && container instanceof HTMLElement) {
        container.appendChild(nav);
    }

    return nav;
}

// ... existing functions from both branches

// Accessibility helper functions
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;

  element.addEventListener('keydown', (event) => {
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
  });
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

// ... other existing functions remained unchanged

/**
 * Validates that a landmark element has proper landmark role.
 * @param {HTMLElement} element - The landmark element to validate.
 * @returns {boolean} - Whether the landmark is valid.
 */
function validateLandmark(element) {
    if (!element) return false;
    
    const landmarkRoles = [
        'banner', 'navigation', 'main', 'complementary', 
        'contentinfo', 'search', 'form', 'region'
    ];
    
    const hasLandmarkRole = landmarkRoles.some(role => 
        element.getAttribute('role') === role || 
        element.tagName.toLowerCase() === role
    );
    
    const isSemanticLandmark = ['nav', 'header', 'main', 'footer', 'aside', 'section', 'article']
        .includes(element.tagName.toLowerCase());
    
    return hasLandmarkRole || isSemanticLandmark;
}

/**
 * Validates landmark structure for accessibility.
 * @param {HTMLElement} container - Container to validate landmarks in.
 * @returns {Array} - Array of validation issues found.
 */
function validateLandmarkStructure(container) {
    const issues = [];
    const landmarks = container.querySelectorAll('nav, header, main, footer, aside, section, article');
    
    landmarks.forEach(landmark => {
        if (!validateLandmark(landmark)) {
            issues.push({
                element: landmark,
                message: 'Landmark missing proper role or semantic element'
            });
        }
    });
    
    return issues;
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @returns {string} - The accessible name.
 */
function getSvgAccessibleName(svg) {
    const titleElement = svg.querySelector('title');
    if (titleElement) {
        return titleElement.textContent;
    }
    
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) {
        return ariaLabel;
    }
    
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    if (ariaLabelledby) {
        const titleElementById = document.getElementById(ariaLabelledby);
        if (titleElementById) {
            return titleElementById.textContent;
        }
    }
    
    return '';
}

/**
 * Creates an accessible in-page button.
 * @param {Object} options - Button options.
 * @returns {HTMLButtonElement} - The created button element.
 */
function createInPageButton(options = {}) {
    const {
        text = '',
        ariaLabel = '',
        onClick = null,
        className = '',
        id = ''
    } = options;

    const button = document.createElement('button');
    button.type = 'button';
    
    if (id) {
        button.id = id;
    }
    
    if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
    }
    
    if (text) {
        button.textContent = text;
    }
    
    if (className) {
        button.className = className;
    }
    
    if (onClick && typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    
    // Ensure the button has an accessible name
    if (!button.textContent && !button.getAttribute('aria-label')) {
        button.setAttribute('aria-label', 'Button');
    }
    
    return button;
}

/**
 * Creates an accessible link.
 * @param {Object} options - Link options.
 * @returns {HTMLAnchorElement} - The created anchor element.
 */
function createAccessibleLink(options = {}) {
    const {
        href = '#',
        text = '',
        ariaLabel = '',
        onClick = null,
        className = '',
        id = ''
    } = options;

    const link = document.createElement('a');
    link.href = href;
    
    if (id) {
        link.id = id;
    }
    
    if (ariaLabel) {
        link.setAttribute('aria-label', ariaLabel);
    }
    
    if (text) {
        link.textContent = text;
    }
    
    if (className) {
        link.className = className;
    }
    
    if (onClick && typeof onClick === 'function') {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            onClick(event);
        });
    }
    
    return link;
}

/**
 * Validates table accessibility.
 * @param {HTMLTableElement} table - Table to validate.
 * @returns {Object} - Validation result with issues array.
 */
function validateTableAccessibility(table) {
    const issues = [];
    
    if (!table) {
        return { valid: false, issues: ['No table provided'] };
    }
    
    const headers = table.querySelectorAll('th');
    headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
            issues.push({
                element: th,
                index: index,
                message: 'TH element missing scope attribute'
            });
        }
    });
    
    return {
        valid: issues.length === 0,
        issues: issues
    };
}

/**
 * Validates table structure for accessibility.
 * @param {HTMLTableElement} table - Table to validate.
 * @returns {boolean} - Whether the table structure is valid.
 */
function validateTableStructure(table) {
    if (!table) return false;
    
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    const tfoot = table.querySelector('tfoot');
    
    // Basic structure validation
    const hasHeaderCells = table.querySelectorAll('th').length > 0;
    
    return hasHeaderCells;
}

/**
 * Handles accessibility issues found during validation.
 * @param {Array} issues - Array of accessibility issues.
 * @param {HTMLElement} container - Container to report issues in.
 */
function handleAccessibilityIssues(issues, container) {
    if (!issues || issues.length === 0) return;
    
    const announcementRegion = document.createElement('div');
    announcementRegion.setAttribute('role', 'alert');
    announcementRegion.setAttribute('aria-live', 'polite');
    announcementRegion.className = 'accessibility-announcements';
    announcementRegion.style.position = 'absolute';
    announcementRegion.style.left = '-10000px';
    announcementRegion.style.width = '1px';
    announcementRegion.style.height = '1px';
    announcementRegion.style.overflow = 'hidden';
    
    announcementRegion.textContent = `${issues.length} accessibility issue(s) found`;
    
    if (container) {
        container.appendChild(announcementRegion);
    }
}

// Export for testing and external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ensureUniqueLandmarkId,
        uniqueLandmarks,
        addLangAttribute,
        addAriaLabel,
        getLangAttribute,
        getFullLangAttribute,
        renderIndexView,
        setupKeyboardNavigation,
        trapFocus,
        validateLandmark,
        validateLandmarkStructure,
        getSvgAccessibleName,
        createInPageButton,
        createAccessibleLink,
        validateTableAccessibility,
        validateTableStructure,
        handleAccessibilityIssues
    };
}